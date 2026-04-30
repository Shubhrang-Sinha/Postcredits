import { Hono } from "hono";
import { query, queryOne, execute } from "../db/index.js";
import { authMiddleware, getUser } from "../middleware/auth.js";

export function ratingRoutes(app: Hono) {
  // Get user's ratings
  app.get("/ratings", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const type = c.req.query("type");

    let sql = `
      SELECT r.rating_id, r.user_id, r.work_id, r.score, r.created_at,
             w.title, w.work_type
      FROM ratings r
      JOIN works w ON r.work_id = w.work_id
      WHERE r.user_id = ?
    `;
    const params: any[] = [user.userId];

    if (type) {
      sql += " AND w.work_type = ?";
      params.push(type);
    }

    sql += " ORDER BY r.created_at DESC";

    const ratings = await query(sql, params);
    return c.json(ratings);
  });

  // Rate a work (book or movie)
  app.post("/ratings", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { workId, score } = await c.req.json();

    if (!workId || !score) {
      return c.json({ error: "workId and score required" }, 400);
    }

    if (score < 1 || score > 5) {
      return c.json({ error: "Score must be 1-5" }, 400);
    }

    // Check if work exists
    const work = await queryOne(
      "SELECT work_id, work_type FROM works WHERE work_id = ?",
      [workId],
    );
    if (!work) {
      return c.json({ error: "Work not found" }, 404);
    }

    // Check for existing rating (upsert)
    const existing = await queryOne(
      "SELECT rating_id FROM ratings WHERE user_id = ? AND work_id = ?",
      [user.userId, workId],
    );

    let ratingId: number;

    if (existing) {
      await execute(
        "UPDATE ratings SET score = ?, updated_at = NOW() WHERE rating_id = ?",
        [score, existing.rating_id],
      );
      ratingId = existing.rating_id;
    } else {
      const result = await execute(
        "INSERT INTO ratings (user_id, work_id, score) VALUES (?, ?, ?)",
        [user.userId, workId, score],
      );
      ratingId = result.insertId;
    }

    const ratedWork = await queryOne(
      "SELECT title, work_type FROM works WHERE work_id = ?",
      [workId],
    );

    return c.json({
      ratingId,
      workId,
      score,
      workType: ratedWork?.work_type,
      title: ratedWork?.title,
    });
  });

  // Update rating
  app.put("/ratings/:ratingId", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const ratingId = parseInt(c.req.param("ratingId"));
    const { score } = await c.req.json();

    if (!score || score < 1 || score > 5) {
      return c.json({ error: "Score must be 1-5" }, 400);
    }

    // Verify ownership
    const rating = await queryOne(
      "SELECT user_id FROM ratings WHERE rating_id = ?",
      [ratingId],
    );

    if (!rating) {
      return c.json({ error: "Rating not found" }, 404);
    }

    if (rating.user_id !== user.userId) {
      return c.json({ error: "Not your rating" }, 403);
    }

    await execute(
      "UPDATE ratings SET score = ?, updated_at = NOW() WHERE rating_id = ?",
      [score, ratingId],
    );

    return c.json({ success: true });
  });

  // Delete rating
  app.delete("/ratings/:ratingId", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const ratingId = parseInt(c.req.param("ratingId"));

    const rating = await queryOne(
      "SELECT user_id FROM ratings WHERE rating_id = ?",
      [ratingId],
    );

    if (!rating) {
      return c.json({ error: "Rating not found" }, 404);
    }

    if (rating.user_id !== user.userId) {
      return c.json({ error: "Not your rating" }, 403);
    }

    await execute("DELETE FROM ratings WHERE rating_id = ?", [ratingId]);

    return c.json({ success: true });
  });
}
