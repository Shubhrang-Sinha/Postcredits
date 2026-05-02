import { query } from "../db/index.js";
import { authMiddleware, getUser } from "../middleware/auth.js";
export function statsRoutes(app) {
  // Get genre statistics
  app.get("/stats/genres", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const type = c.req.query("type");
    if (!type || !["book", "movie"].includes(type)) {
      return c.json({ error: "type must be book or movie" }, 400);
    }
    const stats = await query(
      `
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
    `,
      [user.userId, type],
    );
    return c.json(stats);
  });
  // Get year statistics
  app.get("/stats/years", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const type = c.req.query("type");
    if (!type || !["book", "movie"].includes(type)) {
      return c.json({ error: "type must be book or movie" }, 400);
    }
    const stats = await query(
      `
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
    `,
      [user.userId, type],
    );
    return c.json(stats);
  });
  // Get Spotistats (user taste profile)
  app.get("/stats/spotistats", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const type = c.req.query("type");
    if (!type || !["book", "movie"].includes(type)) {
      return c.json({ error: "type must be book or movie" }, 400);
    }
    // Use PL/SQL function fn_get_taste_profile
    const profile = await query(
      `SELECT fn_get_taste_profile(?, ?) as profile`,
      [user.userId, type],
    );
    // Also get summary stats
    const summary = await query(
      `
      SELECT 
        COUNT(*) as total_rated,
        AVG(r.score) as avg_rating,
        COUNT(DISTINCT g.name) as genres_explored
      FROM ratings r
      JOIN works w ON r.work_id = w.work_id
      JOIN work_genres wg ON w.work_id = wg.work_id
      JOIN genres g ON wg.genre_id = g.genre_id
      WHERE r.user_id = ?
      AND w.work_type = ?
    `,
      [user.userId, type],
    );
    return c.json({
      profile: profile[0]?.profile || "No ratings yet",
      summary: summary[0] || {},
    });
  });
}
