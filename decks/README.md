# Decks

Study card content for the [study app](../study-app). Drop new decks in here
and push — a GitHub Action rebuilds the manifest and the app automatically.

## Adding a deck

Create a JSON file under a subject folder, e.g. `decks/chemistry/bonds.json`:

```json
{
  "title": "Chemical Bonds",
  "cards": [
    { "id": "bonds-001", "question": "What is an ionic bond?", "answer": "A bond formed by the transfer of electrons between atoms" }
  ]
}
```

- `id` must be unique within the deck and should stay stable once created —
  it's the key used to track your per-card study stats (missed count,
  mastery level), so changing it resets that card's history.
- The subject folder name (`chemistry` above) is used to group decks on the
  home page.
- `decks-manifest.json` in this folder is auto-generated — don't hand-edit
  it, the build will overwrite it.

## Editing existing cards

You can either hand-edit the JSON files directly and commit, or use the
"Edit deck" mode in the app (stores changes in your browser until you
export and commit the updated file yourself).
