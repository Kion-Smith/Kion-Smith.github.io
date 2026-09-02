# Study App

A React app for studying flashcards defined by JSON files in [/decks](../decks).
Deployed to `kion-smith.github.io/study/`.

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/study/`. The dev server proxies `/decks/*`
to the real `../decks` folder, so it reads your actual repo content.

## How deployment works

There's no manual deploy step. On every push to `master` that touches
`study-app/**` or deck content, [.github/workflows/deploy-study-app.yml](../.github/workflows/deploy-study-app.yml):

1. Regenerates `decks/decks-manifest.json` from whatever's in `/decks`.
2. Builds this app (`npm run build`).
3. Copies the build output into `/study` at the repo root.
4. Commits both back to `master`.

GitHub Pages then serves it like any other static file in the repo — no
Pages settings changes needed.

## Progress data & local edits

All study stats (times seen/missed, mastery) and any in-app card edits are
stored in the browser's `localStorage`, per-deck. There's no backend, so
this data is per-browser/device. Card edits made in "Edit deck" mode can be
exported as a JSON file and committed to `/decks` to make them permanent.
