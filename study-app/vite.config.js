import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import sirv from 'sirv';

// The app fetches deck data from /decks/* at runtime, which lives at the repo
// root (a sibling of this folder), not inside study-app. In production that's
// just a normal static file next to the deployed app. In dev, this plugin
// serves the real ../decks folder at the same /decks path so `npm run dev`
// reads your actual repo content with no extra setup.
function serveRepoDecks() {
  const decksDir = path.resolve(__dirname, '..', 'decks');
  const serve = sirv(decksDir, { dev: true, etag: true });
  return {
    name: 'serve-repo-decks',
    configureServer(server) {
      server.middlewares.use('/decks', (req, res, next) => serve(req, res, next));
    },
  };
}

// Deployed as a sub-path of the portfolio site (kion-smith.github.io/study/).
// The build output gets copied into /study at the repo root by the
// GitHub Actions workflow, alongside the existing static pages.
export default defineConfig({
  plugins: [react(), serveRepoDecks()],
  base: '/study/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
