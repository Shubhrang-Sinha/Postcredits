import { Hono } from "hono";
import { query, queryOne, execute } from "../db/index.js";
import { authMiddleware, getUser } from "../middleware/auth.js";

export function creatorRoutes(app: Hono) {
  // List all creators
  app.get("/creators", async (c) => {
    const type = c.req.query("type");
    let sql = "SELECT creator_id, name, creator_type, created_at FROM creators";
    const params: any[] = [];

    if (type) {
      sql += " WHERE creator_type = ?";
      params.push(type);
    }

    sql += " ORDER BY name";
    const creators = await query(sql, params);
    return c.json(creators);
  });

  // Get creator by ID
  app.get("/creators/:creatorId", async (c) => {
    const creatorId = parseInt(c.req.param("creatorId"));
    const creator = await queryOne(
      "SELECT creator_id, name, creator_type, created_at FROM creators WHERE creator_id = ?",
      [creatorId],
    );

    if (!creator) {
      return c.json({ error: "Creator not found" }, 404);
    }

    return c.json(creator);
  });

  // Create creator (admin only)
  app.post("/creators", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user || user.role !== "admin") {
      return c.json({ error: "Admin only" }, 403);
    }

    const { name, creatorType } = await c.req.json();

    if (!name || !creatorType) {
      return c.json({ error: "Name and type required" }, 400);
    }

    if (!["author", "director"].includes(creatorType)) {
      return c.json({ error: "Type must be author or director" }, 400);
    }

    const result = await execute(
      "INSERT INTO creators (name, creator_type) VALUES (?, ?)",
      [name, creatorType],
    );

    return c.json({ creatorId: result.insertId, name, creatorType }, 201);
  });

  // Update creator (admin only)
  app.put("/creators/:creatorId", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user || user.role !== "admin") {
      return c.json({ error: "Admin only" }, 403);
    }

    const creatorId = parseInt(c.req.param("creatorId"));
    const { name, creatorType } = await c.req.json();

    const creator = await queryOne(
      "SELECT * FROM creators WHERE creator_id = ?",
      [creatorId],
    );
    if (!creator) {
      return c.json({ error: "Creator not found" }, 404);
    }

    if (creatorType && !["author", "director"].includes(creatorType)) {
      return c.json({ error: "Type must be author or director" }, 400);
    }

    await execute(
      "UPDATE creators SET name = COALESCE(?, name), creator_type = COALESCE(?, creator_type) WHERE creator_id = ?",
      [name || null, creatorType || null, creatorId],
    );

    return c.json({ success: true });
  });

  // Delete creator (admin only)
  app.delete("/creators/:creatorId", authMiddleware, async (c) => {
    const user = getUser(c);
    if (!user || user.role !== "admin") {
      return c.json({ error: "Admin only" }, 403);
    }

    const creatorId = parseInt(c.req.param("creatorId"));

    const creator = await queryOne(
      "SELECT * FROM creators WHERE creator_id = ?",
      [creatorId],
    );
    if (!creator) {
      return c.json({ error: "Creator not found" }, 404);
    }

    await execute("DELETE FROM creators WHERE creator_id = ?", [creatorId]);
    return c.json({ success: true });
  });
}
