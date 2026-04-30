import { query, queryOne, execute } from '../db/index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
export function genreRoutes(app) {
    // List genres
    app.get('/genres', async (c) => {
        const genres = await query('SELECT genre_id as genreId, name FROM genres ORDER BY name');
        return c.json(genres);
    });
    // Get genre by ID
    app.get('/genres/:genreId', async (c) => {
        const genreId = parseInt(c.req.param('genreId'));
        const genre = await queryOne('SELECT genre_id as genreId, name FROM genres WHERE genre_id = ?', [genreId]);
        if (!genre) {
            return c.json({ error: 'Genre not found' }, 404);
        }
        return c.json(genre);
    });
    // Create genre (admin only)
    app.post('/genres', authMiddleware, async (c) => {
        const user = getUser(c);
        if (!user || user.role !== 'admin') {
            return c.json({ error: 'Admin only' }, 403);
        }
        const { name } = await c.req.json();
        if (!name) {
            return c.json({ error: 'Name required' }, 400);
        }
        try {
            const result = await execute('INSERT INTO genres (name) VALUES (?)', [name]);
            return c.json({ genreId: result.insertId, name }, 201);
        }
        catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return c.json({ error: 'Genre already exists' }, 400);
            }
            throw err;
        }
    });
    // Update genre (admin only)
    app.put('/genres/:genreId', authMiddleware, async (c) => {
        const user = getUser(c);
        if (!user || user.role !== 'admin') {
            return c.json({ error: 'Admin only' }, 403);
        }
        const genreId = parseInt(c.req.param('genreId'));
        const { name } = await c.req.json();
        const genre = await queryOne('SELECT * FROM genres WHERE genre_id = ?', [genreId]);
        if (!genre) {
            return c.json({ error: 'Genre not found' }, 404);
        }
        await execute('UPDATE genres SET name = ? WHERE genre_id = ?', [name, genreId]);
        return c.json({ success: true });
    });
    // Delete genre (admin only)
    app.delete('/genres/:genreId', authMiddleware, async (c) => {
        const user = getUser(c);
        if (!user || user.role !== 'admin') {
            return c.json({ error: 'Admin only' }, 403);
        }
        const genreId = parseInt(c.req.param('genreId'));
        const genre = await queryOne('SELECT * FROM genres WHERE genre_id = ?', [genreId]);
        if (!genre) {
            return c.json({ error: 'Genre not found' }, 404);
        }
        await execute('DELETE FROM genres WHERE genre_id = ?', [genreId]);
        return c.json({ success: true });
    });
}
