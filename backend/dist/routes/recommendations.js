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
    // Calculate similarity using SQL (simulating the PL/SQL function)
    const similarity = await calculateSimilarity(user.userId, otherUserId);
    return c.json({ userId: otherUserId, similarityScore: similarity });
  });
  // Get blend recommendations
  app.get("/recommendations/blend", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const type = c.req.query("type") || "all";
    const limit = parseInt(c.req.query("limit") || "10");
    // Find similar users and recommend their highly-rated works
    const recommendations = await generateBlendRecommendations(
      user.userId,
      type,
      limit,
    );
    return c.json(recommendations);
  });
}
async function calculateSimilarity(user1Id, user2Id) {
  // Count shared works rated by both users
  const shared = await query(
    `
    SELECT COUNT(*) as count
    FROM ratings r1
    JOIN ratings r2 ON r1.work_id = r2.work_id
    WHERE r1.user_id = ? AND r2.user_id = ?
  `,
    [user1Id, user2Id],
  );
  const sharedCount = shared[0]?.count || 0;
  if (sharedCount === 0) {
    return 0;
  }
  // Calculate similarity based on rating agreement
  const diff = await query(
    `
    SELECT SUM(ABS(r1.score - r2.score)) as total_diff
    FROM ratings r1
    JOIN ratings r2 ON r1.work_id = r2.work_id
    WHERE r1.user_id = ? AND r2.user_id = ?
  `,
    [user1Id, user2Id],
  );
  const maxDiff = sharedCount * 4;
  const similarity = Math.round(
    100 * (1 - (diff[0]?.total_diff || 0) / maxDiff),
  );
  return Math.max(0, similarity);
}
async function generateBlendRecommendations(userId, workType, limit) {
  // Find other users with similar ratings
  const similarUsers = await query(
    `
    SELECT r2.user_id, 
           100 * (1 - SUM(ABS(r1.score - r2.score)) / (COUNT(*) * 4)) as similarity
    FROM ratings r1
    JOIN ratings r2 ON r1.work_id = r2.work_id
    WHERE r1.user_id = ? AND r2.user_id != ?
    GROUP BY r2.user_id
    HAVING similarity > 30
    ORDER BY similarity DESC
    LIMIT 10
  `,
    [userId, userId],
  );
  if (!similarUsers || similarUsers.length === 0) {
    return [];
  }
  const userIds = similarUsers.map((u) => u.user_id);
  const typeCondition =
    workType !== "all" ? `AND w.work_type = '${workType}'` : "";
  if (userIds.length === 0) return [];
  // Get works that similar users rated highly but current user hasn't
  const recommendations = await query(
    `
    SELECT w.work_id as workId, w.title, w.work_type as type, COALESCE(war.average_rating, 0) as averageRating,
           su.similarity
    FROM works w
    JOIN ratings r ON w.work_id = r.work_id
    JOIN (
      SELECT user_id, 
             100 * (1 - SUM(ABS(r1.score - r2.score)) / (COUNT(*) * 4))) as similarity
      FROM ratings r1
      JOIN ratings r2 ON r1.work_id = r2.work_id
      WHERE r1.user_id = ? AND r2.user_id IN (${userIds.join(",")})
      GROUP BY r2.user_id
      ORDER BY similarity DESC
      LIMIT 3
    ) su ON r.user_id = su.user_id
    LEFT JOIN work_avg_rating war ON w.work_id = war.work_id
    WHERE r.score >= 4 ${typeCondition}
    AND NOT EXISTS (
      SELECT 1 FROM ratings r2 
      WHERE r2.user_id = ? AND r2.work_id = w.work_id
    )
    ORDER BY su.similarity * r.score DESC
    LIMIT ?
  `,
    [userId, userId, limit],
  );
  return recommendations;
}
