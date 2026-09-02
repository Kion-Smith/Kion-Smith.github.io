export function makeCardId() {
  return 'c-' + Math.random().toString(36).slice(2, 10);
}
