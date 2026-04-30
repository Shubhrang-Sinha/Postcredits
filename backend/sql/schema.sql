-- Postcredits Database Schema (MySQL 8.x)
-- 3NF Normalized Design

-- ==================== Users ====================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ==================== Creators (Authors & Directors) ====================
CREATE TABLE creators (
    creator_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    creator_type ENUM('author', 'director') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_creators_name ON creators(name);

-- ==================== Works (Unified Media Entity) ====================
CREATE TABLE works (
    work_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    work_type ENUM('book', 'movie') NOT NULL,
    release_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_works_title ON works(title);
CREATE INDEX idx_works_type ON works(work_type);
CREATE INDEX idx_works_year ON works(release_year);

-- ==================== Books (extends Works) ====================
CREATE TABLE books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    work_id INT NOT NULL UNIQUE,
    author_id INT NOT NULL,
    pages INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_id) REFERENCES works(work_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES creators(creator_id)
);

CREATE INDEX idx_books_author ON books(author_id);

-- ==================== Movies (extends Works) ====================
CREATE TABLE movies (
    movie_id INT PRIMARY KEY AUTO_INCREMENT,
    work_id INT NOT NULL UNIQUE,
    director_id INT NOT NULL,
    duration INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_id) REFERENCES works(work_id) ON DELETE CASCADE,
    FOREIGN KEY (director_id) REFERENCES creators(creator_id)
);

CREATE INDEX idx_movies_director ON movies(director_id);

-- ==================== Genres ====================
CREATE TABLE genres (
    genre_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ==================== Work_Genres (Junction Table) ====================
CREATE TABLE work_genres (
    work_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (work_id, genre_id),
    FOREIGN KEY (work_id) REFERENCES works(work_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

CREATE INDEX idx_work_genres_genre ON work_genres(genre_id);

-- ==================== Ratings ====================
CREATE TABLE ratings (
    rating_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    work_id INT NOT NULL,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_work (user_id, work_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (work_id) REFERENCES works(work_id) ON DELETE CASCADE
);

CREATE INDEX idx_ratings_user ON ratings(user_id);
CREATE INDEX idx_ratings_work ON ratings(work_id);

-- ==================== Helper Views ====================
-- Average rating per work
CREATE OR REPLACE VIEW work_avg_rating AS
SELECT 
    work_id,
    AVG(score) as average_rating,
    COUNT(*) as rating_count
FROM ratings
GROUP BY work_id;

-- ==================== Seed Data ====================
INSERT INTO genres (name) VALUES 
('Fiction'), ('Non-Fiction'), ('Mystery'), ('Romance'), 
('Sci-Fi'), ('Fantasy'), ('Thriller'), ('Horror'),
('Comedy'), ('Drama'), ('Action'), ('Adventure');

INSERT INTO creators (name, creator_type) VALUES 
('J.K. Rowling', 'author'), 
('George R.R. Martin', 'author'),
('Stephen King', 'author'),
('Christopher Nolan', 'director'),
('Quentin Tarantino', 'director'),
('Steven Spielberg', 'director');