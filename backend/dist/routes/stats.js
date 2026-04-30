import { query } from '../db/index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
export function statsRoutes(app) {
    // Get genre statistics
    app.get('/stats/genres', authMiddleware, async (c) => {
        const user = getUser(c);
        if (!user) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        const type = c.req.query('type');
        if (!type || !['book', 'movie'].includes(type)) {
            return c.json({ error: 'type must be book or movie' }, 400);
        }
        const stats = await query(`
      SELECT 
        g.genre_id as genreId,
        g.name AS genreName,
        COUNT(*) AS count,
        AVG(r.score) AS avgRating
      FROM ratings r
      JOIN works w ON r.work_id = w.work_id
      JOIN work_genres wg ON w.work_id = wg.work_id
      JOIN genres g ON wg.genre_id = g.genre_id
      WHERE r.user_id = ? 
      AND w.work_type = ?
      GROUP BY g.genre_id, g.name
      ORDER BY count DESC, avgRating DESC
    `, [user.userId, type]);
        return c.json(stats);
    });
    // Get year statistics
    app.get('/stats/years', authMiddleware, async (c) => {
        const user = getUser(c);
        if (!user) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        const type = c.req.query('type');
        if (!type || !['book', 'movie'].includes(type)) {
            return c.json({ error: 'type must be book or movie' }, 400);
        }
        const stats = await query(`
      SELECT 
        w.release_year AS year,
        COUNT(*) AS count,
        AVG(r.score) AS avgRating
      FROM ratings r
      JOIN works w ON r.work_id = w.work_id
      WHERE r.user_id = ? 
      AND w.work_type = ?
      GROUP BY w.release_year
      ORDER BY avgRating DESC, count DESC
    `, [user.userId, type]);
        return c.json(stats);
    });
}
