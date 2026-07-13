import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import criticScoreHandler from './api/critic-score.js'

// Plain `vite dev` never serves files under /api — that routing only exists
// on Vercel (or `vercel dev`). Without this, every fetch to
// /api/critic-score 404s locally, fetchCriticScore() swallows the error,
// and every album silently looks like "no critic score found". This
// middleware runs the *actual* handler from api/critic-score.js so local
// dev behaves the same as production.
function apiDevMiddleware() {
  return {
    name: 'api-critic-score-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/critic-score')) return next();

        const url = new URL(req.url, 'http://localhost');
        req.query = Object.fromEntries(url.searchParams);

        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        try {
          await criticScoreHandler(req, res);
        } catch (err) {
          console.error('critic-score dev middleware error:', err);
          res.statusCode = 500;
          res.json({ criticScore: null, error: 'dev_middleware_failed' });
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevMiddleware()],
})
