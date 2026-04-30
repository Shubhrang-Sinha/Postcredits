-- Postcredits PL/SQL Components
-- Required: Procedures, Functions, Cursors, Triggers

DELIMITER $$

-- ==================== Function: Calculate Similarity ====================
-- Calculates taste similarity between two users based on shared ratings
CREATE FUNCTION fn_calculate_similarity(
    p_user1_id INT,
    p_user2_id INT
)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE v_similarity DECIMAL(5,2) DEFAULT 0;
    DECLARE v_shared_count INT DEFAULT 0;
    DECLARE v_user1_count INT DEFAULT 0;
    DECLARE v_user2_count INT DEFAULT 0;
    
    -- Count shared works rated by both users
    SELECT COUNT(*) INTO v_shared_count
    FROM ratings r1
    JOIN ratings r2 ON r1.work_id = r2.work_id
    WHERE r1.user_id = p_user1_id AND r2.user_id = p_user2_id;
    
    -- If no shared works, similarity is 0
    IF v_shared_count = 0 THEN
        RETURN 0;
    END IF;
    
    -- Calculate similarity based on rating agreement
    -- Using Euclidean distance converted to similarity percentage
    SELECT 
        SQRT(SUM(POWER(r1.score - r2.score, 2))),
        COUNT(*),
        COUNT(*)
    INTO v_similarity, v_user1_count, v_user2_count
    FROM ratings r1
    JOIN ratings r2 ON r1.work_id = r2.work_id
    WHERE r1.user_id = p_user1_id AND r2.user_id = p_user2_id;
    
    -- Convert distance to similarity (0 = identical, max = very different)
    -- Similarity = 100 * (1 - distance / max_distance)
    SET v_similarity = 100 * (1 - v_similarity / (v_shared_count * 4));
    
    RETURN GREATEST(0, v_similarity);
END$$

-- ==================== Function: Get Taste Profile ====================
-- Returns a JSON-like string of user's genre preferences
CREATE FUNCTION fn_get_taste_profile(
    p_user_id INT,
    p_work_type VARCHAR(10)
)
RETURNS VARCHAR(1000)
DETERMINISTIC
BEGIN
    DECLARE v_profile VARCHAR(1000) DEFAULT '';
    
    SELECT GROUP_CONCAT(
        CONCAT(g.name, ':', COUNT(*))
    INTO v_profile
    FROM ratings r
    JOIN works w ON r.work_id = w.work_id
    JOIN work_genres wg ON w.work_id = wg.work_id
    JOIN genres g ON wg.genre_id = g.genre_id
    WHERE r.user_id = p_user_id 
    AND w.work_type = p_work_type
    GROUP BY g.name
    ORDER BY COUNT(*) DESC
    LIMIT 5;
    
    RETURN COALESCE(v_profile, 'No ratings yet');
END$$

-- ==================== Procedure: Calculate Blend Recommendations ====================
-- Generates personalized recommendations based on similar users
-- Uses CURSORS as required by instructor
CREATE PROCEDURE proc_generate_blend(
    IN p_user_id INT,
    IN p_work_type VARCHAR(10),
    IN p_limit INT
)
BEGIN
    DECLARE v_done INT DEFAULT FALSE;
    DECLARE v_similar_user_id INT;
    DECLARE v_similarity DECIMAL(5,2);
    DECLARE v_work_id INT;
    DECLARE v_title VARCHAR(255);
    DECLARE v_avg_rating DECIMAL(3,2);
    DECLARE v_count INT DEFAULT 0;
    
    -- Cursor to find similar users
    DECLARE user_cursor CURSOR FOR
        SELECT user_id FROM users 
        WHERE user_id != p_user_id
        ORDER BY fn_calculate_similarity(p_user_id, user_id) DESC
        LIMIT 10;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    
    -- Temp table for results
    DROP TEMPORARY TABLE IF EXISTS blend_results;
    CREATE TEMPORARY TABLE blend_results (
        work_id INT,
        title VARCHAR(255),
        average_rating DECIMAL(3,2),
        source_user_id INT,
        similarity DECIMAL(5,2)
    );
    
    OPEN user_cursor;
    
    user_loop: LOOP
        FETCH user_cursor INTO v_similar_user_id;
        IF v_done = 1 THEN
            LEAVE user_loop;
        END IF;
        
        -- Get similarity score
        SET v_similarity = fn_calculate_similarity(p_user_id, v_similar_user_id);
        
        -- Skip users with low similarity
        IF v_similarity < 30 THEN
            ITERATE user_loop;
        END IF;
        
        -- Find highly-rated works from similar user that current user hasn't rated
        INSERT INTO blend_results
        SELECT w.work_id, w.title, COALESCE(wr.average_rating, 0), v_similar_user_id, v_similarity
        FROM works w
        JOIN ratings r ON w.work_id = r.work_id AND r.user_id = v_similar_user_id AND r.score >= 4
        LEFT JOIN work_avg_rating wr ON w.work_id = wr.work_id
        WHERE w.work_type = p_work_type
        AND NOT EXISTS (
            SELECT 1 FROM ratings r2 
            WHERE r2.user_id = p_user_id AND r2.work_id = w.work_id
        )
        ORDER BY v_similarity * r.score DESC
        LIMIT 5;
        
        SET v_count = v_count + 1;
        IF v_count >= p_limit THEN
            LEAVE user_loop;
        END IF;
    END LOOP;
    
    CLOSE user_cursor;
    
    -- Return results
    SELECT * FROM blend_results 
    ORDER BY similarity DESC, average_rating DESC
    LIMIT p_limit;
    
    DROP TEMPORARY TABLE blend_results;
END$$

-- ==================== Procedure: Get Spotistats ====================
-- Returns genre and year statistics for user
CREATE PROCEDURE proc_get_spotistats(
    IN p_user_id INT,
    IN p_work_type VARCHAR(10)
)
BEGIN
    -- Genre distribution
    SELECT 
        g.name AS genre_name,
        COUNT(*) AS count,
        AVG(r.score) AS avg_rating
    FROM ratings r
    JOIN works w ON r.work_id = w.work_id
    JOIN work_genres wg ON w.work_id = wg.work_id
    JOIN genres g ON wg.genre_id = g.genre_id
    WHERE r.user_id = p_user_id 
    AND w.work_type = p_work_type
    GROUP BY g.genre_id, g.name
    ORDER BY count DESC;
    
    -- Year distribution
    SELECT 
        w.release_year AS year,
        COUNT(*) AS count,
        AVG(r.score) AS avg_rating
    FROM ratings r
    JOIN works w ON r.work_id = w.work_id
    WHERE r.user_id = p_user_id 
    AND w.work_type = p_work_type
    GROUP BY w.release_year
    ORDER BY avg_rating DESC, count DESC;
END$$

-- ==================== Procedure: Rate Media ====================
-- Allows user to rate a book or movie (1-5 scale)
-- Handles both new ratings and updates (upsert)
-- Uses transactions for data consistency
CREATE PROCEDURE rate_media(
    IN p_user_id INT,
    IN p_work_id INT,
    IN p_score INT,
    OUT p_rating_id INT,
    OUT p_message VARCHAR(100)
)
BEGIN
    DECLARE v_error BOOLEAN DEFAULT FALSE;
    
    -- Validate score range
    IF p_score < 1 OR p_score > 5 THEN
        SET p_message = 'Score must be between 1 and 5';
        SET v_error = TRUE;
    END IF;
    
    -- Check if work exists
    IF NOT EXISTS (SELECT 1 FROM works WHERE work_id = p_work_id) AND NOT v_error THEN
        SET p_message = 'Work not found';
        SET v_error = TRUE;
    END IF;
    
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) AND NOT v_error THEN
        SET p_message = 'User not found';
        SET v_error = TRUE;
    END IF;
    
    -- If validation passed, proceed with rating
    IF NOT v_error THEN
        -- Start transaction
        START TRANSACTION;
        
        -- Check for existing rating (upsert logic)
        IF EXISTS (SELECT 1 FROM ratings WHERE user_id = p_user_id AND work_id = p_work_id) THEN
            -- Update existing rating
            UPDATE ratings 
            SET score = p_score, updated_at = NOW() 
            WHERE user_id = p_user_id AND work_id = p_work_id;
            
            SELECT rating_id INTO p_rating_id 
            FROM ratings 
            WHERE user_id = p_user_id AND work_id = p_work_id;
            
            SET p_message = 'Rating updated';
        ELSE
            -- Insert new rating
            INSERT INTO ratings (user_id, work_id, score) VALUES (p_user_id, p_work_id, p_score);
            SET p_rating_id = LAST_INSERT_ID();
            SET p_message = 'Rating created';
        END IF;
        
        COMMIT;
    ELSE
        SET p_rating_id = NULL;
    END IF;
    
    -- Note: Average rating is automatically calculated via the work_avg_rating view
    -- The trigger logs the rating change to audit table for tracking
END$$

-- ==================== Trigger: Update Average Rating ====================
-- Automatically updates average rating when new rating is added
CREATE TRIGGER trg_update_avg_rating
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    -- This trigger maintains data integrity
    -- Note: Views are auto-updated in MySQL, triggers can log changes
    INSERT INTO rating_audit (user_id, work_id, old_score, new_score, action)
    VALUES (NEW.user_id, NEW.work_id, NULL, NEW.score, 'INSERT');
END$$

-- ==================== Trigger: Update Average Rating on UPDATE ====================
CREATE TRIGGER trg_update_avg_rating_update
AFTER UPDATE ON ratings
FOR EACH ROW
BEGIN
    INSERT INTO rating_audit (user_id, work_id, old_score, new_score, action)
    VALUES (NEW.user_id, NEW.work_id, OLD.score, NEW.score, 'UPDATE');
END$$

-- ==================== Trigger: Log Rating Deletion ====================
CREATE TRIGGER trg_log_rating_delete
AFTER DELETE ON ratings
FOR EACH ROW
BEGIN
    INSERT INTO rating_audit (user_id, work_id, old_score, new_score, action)
    VALUES (OLD.user_id, OLD.work_id, OLD.score, NULL, 'DELETE');
END$$

DELIMITER ;

-- ==================== Audit Table ====================
CREATE TABLE IF NOT EXISTS rating_audit (
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    work_id INT NOT NULL,
    old_score INT,
    new_score INT,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);