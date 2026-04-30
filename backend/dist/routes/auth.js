import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { queryOne, execute } from "../db/index.js";
const JWT_SECRET =
  process.env.JWT_SECRET || "postcredits-secret-key-change-in-production";
const EXPIRY = "7d";
export function authRoutes(app) {
  // Register
  app.post("/auth/register", async (c) => {
    const { email, password, displayName } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    try {
      const result = await execute(
        "INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)",
        [email, passwordHash, displayName || email.split("@")[0]],
      );
      const token = jwt.sign(
        { userId: result.insertId, email, role: "user" },
        JWT_SECRET,
        { expiresIn: EXPIRY },
      );
      return c.json({ userId: result.insertId, email, token }, 201);
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return c.json({ error: "Email already exists" }, 400);
      }
      throw err;
    }
  });
  // Login
  app.post("/auth/login", async (c) => {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }
    const user = await queryOne("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return c.json({ error: "Invalid credentials" }, 401);
    }
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: EXPIRY },
    );
    return c.json({
      userId: user.user_id,
      token,
      displayName: user.display_name,
    });
  });
  // Logout (stateless - just confirm)
  app.post("/auth/logout", async (c) => {
    return c.json({ success: true });
  });
  // Get current user
  app.get("/auth/me", async (c) => {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await queryOne(
        "SELECT user_id, email, display_name, role FROM users WHERE user_id = ?",
        [decoded.userId],
      );
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }
      return c.json({
        userId: user.user_id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
      });
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }
  });
}
