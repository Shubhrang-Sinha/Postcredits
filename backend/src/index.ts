import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { authRoutes } from "./routes/auth.js";
import { bookRoutes } from "./routes/books.js";
import { movieRoutes } from "./routes/movies.js";
import { genreRoutes } from "./routes/genres.js";
import { ratingRoutes } from "./routes/ratings.js";
import { statsRoutes } from "./routes/stats.js";
import { recommendationRoutes } from "./routes/recommendations.js";
import { creatorRoutes } from "./routes/creators.js";

import { migrate, seed, needsSeed } from "./db/seed.js";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: "*",
  }),
);

app.get("/", (c) =>
  c.json({
    name: "Postcredits API",
    version: "1.0.0",
    docs: "/openapi.yaml",
  }),
);

app.get("/health", (c) => c.json({ status: "ok" }));

// Routes
authRoutes(app);
bookRoutes(app);
movieRoutes(app);
genreRoutes(app);
ratingRoutes(app);
statsRoutes(app);
recommendationRoutes(app);
creatorRoutes(app);

async function start() {
  // Migrations (optional)
  try {
    console.log("Running migrations...");
    await migrate();
    console.log("Migrations completed");
  } catch (err) {
    console.error("Migration failed (continuing):", err);
  }

  // Seeding (optional)
  try {
    if (await needsSeed()) {
      console.log("Seeding database...");
      await seed();
      console.log("Seeding completed");
    }
  } catch (err) {
    console.error("Seeding failed (continuing):", err);
  }

  // Start server
  const port = parseInt(process.env.PORT || "3000");

  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(`Server running on http://localhost:${info.port}`);
    },
  );
}

start();
