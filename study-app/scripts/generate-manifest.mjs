// Scans the repo's /decks folder and writes decks-manifest.json listing
// every deck file found, so the static app always knows what decks exist
// without you maintaining an index by hand. Run automatically by the
// GitHub Actions workflow on every push that touches /decks, and can be
// run locally with `npm run generate-manifest`.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const decksDir = path.resolve(__dirname, '..', '..', 'decks');
const manifestPath = path.join(decksDir, 'decks-manifest.json');

function walk(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.endsWith('.json') && entry !== 'decks-manifest.json') {
      files.push(full);
    }
  }
  return files;
}

function toDeckEntry(fullPath) {
  const relPath = path.relative(decksDir, fullPath).split(path.sep).join('/');
  const subject = relPath.includes('/') ? relPath.split('/')[0] : null;
  let title = relPath;
  let cardCount = 0;
  try {
    const data = JSON.parse(readFileSync(fullPath, 'utf8'));
    title = data.title || relPath;
    cardCount = Array.isArray(data.cards) ? data.cards.length : 0;
  } catch (err) {
    console.warn(`Skipping unparsable deck file ${relPath}: ${err.message}`);
    return null;
  }
  return { path: relPath, title, subject, cardCount };
}

const deckFiles = walk(decksDir);
const decks = deckFiles.map(toDeckEntry).filter(Boolean).sort((a, b) => a.path.localeCompare(b.path));

const manifest = {
  generatedAt: new Date().toISOString(),
  decks,
};

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${manifestPath} with ${decks.length} deck(s).`);
