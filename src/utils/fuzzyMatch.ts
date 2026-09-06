/**
 * Small, dependency-free fuzzy matcher for the item-name type-ahead.
 *
 * `fuzzyScore` returns 0 for "no match" and a positive number otherwise, where
 * a higher value is a better match. It is tuned for short product names typed
 * quickly on a phone keyboard, so it tolerates a couple of typos per word
 * (e.g. "chiken" still matches "Chicken Steam Momo").
 */

const normalise = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Classic Levenshtein distance, capped early once it exceeds `max`. */
function editDistance(a: string, b: string, max: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > max) return max + 1;
    [prev, curr] = [curr, prev];
  }

  return prev[b.length];
}

/** How close a single typed token is to a single target word (0 = no match). */
function tokenScore(queryToken: string, targetToken: string): number {
  if (!queryToken || !targetToken) return 0;
  if (targetToken === queryToken) return 1;
  if (targetToken.startsWith(queryToken)) return 0.9;
  if (targetToken.includes(queryToken)) return 0.6;

  // Typo tolerance scales with token length.
  const tolerance = queryToken.length >= 6 ? 2 : queryToken.length >= 4 ? 1 : 0;
  if (tolerance > 0) {
    const dist = editDistance(queryToken, targetToken, tolerance);
    if (dist <= tolerance) return 0.55 - dist * 0.1;
  }
  return 0;
}

/**
 * Score how well `query` matches `target`. Returns 0 when there is no
 * meaningful match.
 */
export function fuzzyScore(query: string, target: string): number {
  const q = normalise(query);
  const t = normalise(target);
  if (!q) return 0;
  if (!t) return 0;

  if (t === q) return 100;
  if (t.startsWith(q)) return 80 - Math.min(t.length - q.length, 20) * 0.5;

  const substringIndex = t.indexOf(q);
  if (substringIndex >= 0) return 60 - Math.min(substringIndex, 20);

  // Every query token must land on some target token.
  const queryTokens = q.split(' ');
  const targetTokens = t.split(' ');
  let total = 0;
  for (const qt of queryTokens) {
    let best = 0;
    for (const tt of targetTokens) {
      const s = tokenScore(qt, tt);
      if (s > best) best = s;
    }
    if (best === 0) return 0;
    total += best;
  }
  return (total / queryTokens.length) * 40;
}
