import { Hono } from "hono";
import { query } from "../db/index.js";
import { authMiddleware, getUser } from "../middleware/auth.js";

export function recommendationRoutes(app: Hono) {
  // Get similarity with another user
  app.get("/recommendations/similarity/:userId", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const otherUserId = parseInt(c.req.param("userId"));

    if (otherUserId === user.userId) {
      return c.json({ error: "Cannot compare with yourself" }, 400);
    }

    // Use PL/SQL function fn_calculate_similarity
    const result = await query(
      `SELECT fn_calculate_similarity(?, ?) as similarityScore`,
      [user.userId, otherUserId],
    );

    return c.json({
      userId: otherUserId,
      similarityScore: result[0]?.similarityScore || 0,
    });
  });

  // Get blend recommendations
  app.get("/recommendations/blend", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const type = c.req.query("type") || "all";
    const limit = parseInt(c.req.query("limit") || "10");

    // Use PL/SQL procedure proc_generate_blend
    // Note: MySQL CALL returns an array of result sets. The results we want are in the first result set.
    const resultSets = await query(`CALL proc_generate_blend(?, ?, ?)`, [
      user.userId,
      type,
      limit,
    ]);

    // mysql2 returns [ [results], [OkPacket] ] for stored procedures
    const recommendations = resultSets[0] || [];

    return c.json(
      recommendations.map((row: any) => ({
        workId: row.work_id,
        title: row.title,
        averageRating: row.average_rating,
        similarity: row.similarity,
        sourceUserId: row.source_user_id,
      })),
    );
  });
}
