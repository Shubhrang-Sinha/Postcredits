import { query } from '../db/index.js';
export function genreRoutes(app) {
    // List genres
    app.get('/genres', async (c) => {
        const genres = await query('SELECT genre_id, name FROM genres ORDER BY name');
        return c.json(genres);
    });
}
