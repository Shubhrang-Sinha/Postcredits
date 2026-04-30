import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth.js';
import { bookRoutes } from './routes/books.js';
import { movieRoutes } from './routes/movies.js';
import { genreRoutes } from './routes/genres.js';
import { ratingRoutes } from './routes/ratings.js';
import { statsRoutes } from './routes/stats.js';
import { recommendationRoutes } from './routes/recommendations.js';
import { creatorRoutes } from './routes/creators.js';
import { logger } from 'hono/logger';
import { seed, needsSeed } from './db/seed.js';

const app = new Hono();

app.use(logger())

app.use('/*', cors({
  origin: '*',
}));

app.get('/', (c) => c.json({ 
  name: 'Postcredits API', 
  version: '1.0.0',
  docs: '/openapi.yaml'
}));

app.get('/health', (c) => c.json({ status: 'ok' }));

// Mount routes
authRoutes(app);
bookRoutes(app);
movieRoutes(app);
genreRoutes(app);
ratingRoutes(app);
statsRoutes(app);
recommendationRoutes(app);
creatorRoutes(app);

// Auto-migrate and seed on first run
(async () => {
  try {
    if (await needsSeed()) {
      console.log('Database empty, running migrations and seed...');
      await seed();
      console.log('Database ready!');
    }
  } catch (err) {
    console.error('Startup seed failed:', err);
  }
})();

serve({
  fetch: app.fetch,
  port: parseInt(process.env.PORT || '3000'),
}, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});
