import { query, queryOne, execute } from '../db/index.js';
import { authMiddleware, getUser } from '../middleware/auth.js';
export function bookRoutes(app) {
    // List books
    app.get('/books', async (c) => {
        const genre = c.req.query('genre');
        const page = parseInt(c.req.query('page') || '1');
        const limit = parseInt(c.req.query('limit') || '20');
        const offset = (page - 1) * limit;
        let sql = `
      SELECT b.book_id, w.work_id, w.title, w.release_year, b.pages,
             c.name as author_name, c.creator_id as author_id,
             COALESCE(war.average_rating, 0) as average_rating
      FROM books b
      JOIN works w ON b.work_id = w.work_id
      JOIN creators c ON b.author_id = c.creator_id
      LEFT JOIN work_avg_rating war ON w.work_id = war.work_id
      WHERE w.work_type = 'book'
    `;
        const params = [];
        if (genre) {
            sql += ` AND w.work_id IN (SELECT work_id FROM work_genres WHERE genre_id = ?)`;
            params.push(genre);
        }
        sql += ` ORDER BY w.title LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        const books = await query(sql, params);
        // Get genres for each book
        for (const book of books) {
            const genres = await query(`SELECT g.name FROM genres g 
         JOIN work_genres wg ON g.genre_id = wg.genre_id 
         WHERE wg.work_id = ?`, [book.work_id]);
            book.genres = genres.map((g) => g.name);
        }
        return c.json(books);
    });
    // Get book by ID
    app.get('/books/:bookId', async (c) => {
        const bookId = parseInt(c.req.param('bookId'));
        const book = await queryOne(`
      SELECT b.book_id, w.work_id, w.title, w.release_year, b.pages,
             c.name as author_name, c.creator_id as author_id,
             COALESCE(war.average_rating, 0) as average_rating
      FROM books b
      JOIN works w ON b.work_id = w.work_id
      JOIN creators c ON b.author_id = c.creator_id
      LEFT JOIN work_avg_rating war ON w.work_id = war.work_id
      WHERE b.book_id = ?
    `, [bookId]);
        if (!book) {
            return c.json({ error: 'Book not found' }, 404);
        }
        const genres = await query(`SELECT g.name FROM genres g 
       JOIN work_genres wg ON g.genre_id = wg.genre_id 
       WHERE wg.work_id = ?`, [book.work_id]);
        return c.json({ ...book, genres: genres.map((g) => g.name) });
    });
    // Create book (admin only)
    app.post('/books', authMiddleware, async (c) => {
        const user = getUser(c);
        if (!user || user.role !== 'admin') {
            return c.json({ error: 'Admin only' }, 403);
        }
        const { title, authorId, pages, releaseYear, genreIds } = await c.req.json();
        if (!title || !authorId || !pages || !releaseYear) {
            return c.json({ error: 'Missing required fields' }, 400);
        }
        const db = await import('../db/index.js');
        const conn = await db.getPool().getConnection();
        await conn.beginTransaction();
        try {
            const [workResult] = await conn.execute('INSERT INTO works (title, work_type, release_year) VALUES (?, ?, ?)', [title, 'book', releaseYear]);
            const workId = workResult.insertId;
            const [bookResult] = await conn.execute('INSERT INTO books (work_id, author_id, pages) VALUES (?, ?, ?)', [workId, authorId, pages]);
            if (genreIds && genreIds.length > 0) {
                for (const gid of genreIds) {
                    await conn.execute('INSERT INTO work_genres (work_id, genre_id) VALUES (?, ?)', [workId, gid]);
                }
            }
            await conn.commit();
            return c.json({ bookId: bookResult.insertId, workId }, 201);
        }
        catch (err) {
            await conn.rollback();
            throw err;
        }
        finally {
            conn.release();
        }
    });
    // Update book
    app.put('/books/:bookId', authMiddleware, async (c) => {
        const user = getUser(c);
        if (!user || user.role !== 'admin') {
            return c.json({ error: 'Admin only' }, 403);
        }
        const bookId = parseInt(c.req.param('bookId'));
        const { title, authorId, pages, releaseYear, genreIds } = await c.req.json();
        const book = await queryOne('SELECT work_id FROM books WHERE book_id = ?', [bookId]);
        if (!book) {
            return c.json({ error: 'Book not found' }, 404);
        }
        await execute('UPDATE works SET title = ?, release_year = ? WHERE work_id = ?', [title, releaseYear, book.work_id]);
        await execute('UPDATE books SET author_id = ?, pages = ? WHERE book_id = ?', [authorId, pages, bookId]);
        if (genreIds) {
            await execute('DELETE FROM work_genres WHERE work_id = ?', [book.work_id]);
            for (const gid of genreIds) {
                await execute('INSERT INTO work_genres (work_id, genre_id) VALUES (?, ?)', [book.work_id, gid]);
            }
        }
        return c.json({ success: true });
    });
    // Delete book
    app.delete('/books/:bookId', authMiddleware, async (c) => {
        const user = getUser(c);
        if (!user || user.role !== 'admin') {
            return c.json({ error: 'Admin only' }, 403);
        }
        const bookId = parseInt(c.req.param('bookId'));
        const book = await queryOne('SELECT work_id FROM books WHERE book_id = ?', [bookId]);
        if (!book) {
            return c.json({ error: 'Book not found' }, 404);
        }
        await execute('DELETE FROM works WHERE work_id = ?', [book.work_id]);
        return c.json({ success: true });
    });
}
