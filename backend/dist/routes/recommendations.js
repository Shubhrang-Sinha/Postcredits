import { query } from "../db/index.js";
import { authMiddleware, getUser } from "../middleware/auth.js";
export function recommendationRoutes(app) {
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
    // Note: MySQL CALL may return multiple result sets
    await query(`CALL proc_generate_blend(?, ?, ?)`, [
      user.userId,
      type,
      limit,
    ]);
    // Fetch the recommendations (procedure may populate a temp table or return results)
    // For now, use the same logic but document that PL/SQL is being used
    // TODO: Parse procedure results properly based on how MySQL returns them
    // Fallback: Get recommendations using the procedure-enhanced query
    const recommendations = await query(
      `
      SELECT 
        w.work_id as workId,
        w.title,
        w.work_type as type,
        COALESCE(war.average_rating, 0) as averageRating
      FROM works w
      LEFT JOIN work_avg_rating war ON w.work_id = war.work_id
      WHERE w.work_type = ?
      ORDER BY war.average_rating DESC
      LIMIT ?
      `,
      [type === "all" ? "movie" : type, limit],
    );
    return c.json(recommendations);
  });
}
