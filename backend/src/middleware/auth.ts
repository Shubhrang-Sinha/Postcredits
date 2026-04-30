import { Context, Next } from "hono";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "postcredits-secret-key-change-in-production";

export interface AuthContext {
  userId: number;
  email: string;
  role: string;
}

export async function authMiddleware(c: any, next: any) {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.json({ error: "Authorization required" }, 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };
    c.set("user", {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
}

export function getUser(c: any): AuthContext | undefined {
  return c.get("user");
}
