import { query, queryOne, execute } from '../db/index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
export function movieRoutes(app) {
    // List movies
    app.get('/movies', async (c) => {
        const genre = c.req.query('genre');
        const page = parseInt(c.req.query('page') || '1');
        const limit = parseInt(c.req.query('limit') || '20');
        const offset = (page - 1) * limit;
        let sql = `
      SELECT m.movie_id, w.work_id, w.title, w.release_year, m.duration,
             c.name as director_name, c.creator_id as director_id,
             COALESCE(war.average_rating, 0) as average_rating
      FROM movies m
      JOIN works w ON m.work_id = w.work_id
      JOIN creators c ON m.director_id = c.creator_id
      LEFT JOIN work_avg_rating war ON w.work_id = war.work_id
      WHERE w.work_type = 'movie'
    `;
        const params = [];
        if (genre) {
            sql += ` AND w.work_id IN (SELECT work_id FROM work_genres WHERE genre_id = ?)`;
            params.push(genre);
        }
        sql += ` ORDER BY w.title LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        const movies = await query(sql, params);
        for (const movie of movies) {
            const genres = await query(`SELECT g.name FROM genres g 
         JOIN work_genres wg ON g.genre_id = wg.genre_id 
         WHERE wg.work_id = ?`, [movie.work_id]);
            movie.genres = genres.map((g) => g.name);
        }
        return c.json(movies);
    });
    // Get movie by ID
    app.get('/movies/:movieId', async (c) => {
        const movieId = parseInt(c.req.param('movieId'));
        const movie = await queryOne(`
      SELECT m.movie_id, w.work_id, w.title, w.release_year, m.duration,
             c.name as director_name, c.creator_id as director_id,
             COALESCE(war.average_rating, 0) as average_rating
      FROM movies m
      JOIN works w ON m.work_id = w.work_id
      JOIN creators c ON m.director_id = c.creator_id
      LEFT JOIN work_avg_rating war ON w.work_id = war.work_id
      WHERE m.movie_id = ?
    `, [movieId]);
        if (!movie) {
            return c.json({ error: 'Movie not found' }, 404);
        }
        const genres = await query(`SELECT g.name FROM genres g 
       JOIN work_genres wg ON g.genre_id = wg.genre_id 
       WHERE wg.work_id = ?`, [movie.work_id]);
        return c.json({ ...movie, genres: genres.map((g) => g.name) });
    });
    // Create movie (admin only)
    app.post('/movies', authMiddleware, async (c) => {
        const user = getUser(c);
        if (!user || user.role !== 'admin') {
            return c.json({ error: 'Admin only' }, 403);
        }
        const { title, directorId, duration, releaseYear, genreIds } = await c.req.json();
        if (!title || !directorId || !duration || !releaseYear) {
            return c.json({ error: 'Missing required fields' }, 400);
        }
        const db = await import('../db/index.js');
        const conn = await db.getPool().getConnection();
        await conn.beginTransaction();
        try {
            const [workResult] = await conn.execute('INSERT INTO works (title, work_type, release_year) VALUES (?, ?, ?)', [title, 'movie', releaseYear]);
            const workId = workResult.insertId;
            const [movieResult] = await conn.execute('INSERT INTO movies (work_id, director_id, duration) VALUES (?, ?, ?)', [workId, directorId, duration]);
            if (genreIds && genreIds.length > 0) {
                for (const gid of genreIds) {
                    await conn.execute('INSERT INTO work_genres (work_id, genre_id) VALUES (?, ?)', [workId, gid]);
                }
            }
            await conn.commit();
            return c.json({ movieId: movieResult.insertId, workId }, 201);
        }
        catch (err) {
            await conn.rollback();
            throw err;
        }
        finally {
            conn.release();
        }
    });
    // Update movie
    app.put('/movies/:movieId', authMiddleware, async (c) => {
        const user = getUser(c);
        if (!user || user.role !== 'admin') {
            return c.json({ error: 'Admin only' }, 403);
        }
        const movieId = parseInt(c.req.param('movieId'));
        const { title, directorId, duration, releaseYear, genreIds } = await c.req.json();
        const movie = await queryOne('SELECT work_id FROM movies WHERE movie_id = ?', [movieId]);
        if (!movie) {
            return c.json({ error: 'Movie not found' }, 404);
        }
        await execute('UPDATE works SET title = ?, release_year = ? WHERE work_id = ?', [title, releaseYear, movie.work_id]);
        await execute('UPDATE movies SET director_id = ?, duration = ? WHERE movie_id = ?', [directorId, duration, movieId]);
        if (genreIds) {
            await execute('DELETE FROM work_genres WHERE work_id = ?', [movie.work_id]);
            for (const gid of genreIds) {
                await execute('INSERT INTO work_genres (work_id, genre_id) VALUES (?, ?)', [movie.work_id, gid]);
            }
        }
        return c.json({ success: true });
    });
    // Delete movie
    app.delete('/movies/:movieId', authMiddleware, async (c) => {
        const user = getUser(c);
        if (!user || user.role !== 'admin') {
            return c.json({ error: 'Admin only' }, 403);
        }
        const movieId = parseInt(c.req.param('movieId'));
        const movie = await queryOne('SELECT work_id FROM movies WHERE movie_id = ?', [movieId]);
        if (!movie) {
            return c.json({ error: 'Movie not found' }, 404);
        }
        await execute('DELETE FROM works WHERE work_id = ?', [movie.work_id]);
        return c.json({ success: true });
    });
}
