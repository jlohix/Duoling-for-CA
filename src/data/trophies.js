export const TROPHY_TIERS = [
  { id: "bronze", name: "Bronze", minXp: 0 },
  { id: "silver", name: "Silver", minXp: 100 },
  { id: "gold", name: "Gold", minXp: 250 },
  { id: "sapphire", name: "Sapphire", minXp: 500 },
  { id: "ruby", name: "Ruby", minXp: 800 },
  { id: "emerald", name: "Emerald", minXp: 1200 },
  { id: "amethyst", name: "Amethyst", minXp: 1800 },
  { id: "pearl", name: "Pearl", minXp: 2500 },
  { id: "obsidian", name: "Obsidian", minXp: 3500 },
  { id: "diamond", name: "Diamond", minXp: 5000 },
];

export function clampLeagueIndex(index) {
  const i = Number(index);
  if (!Number.isFinite(i)) return 0;
  return Math.min(TROPHY_TIERS.length - 1, Math.max(0, Math.round(i)));
}

export function trophyFromIndex(index) {
  const i = clampLeagueIndex(index);
  const current = TROPHY_TIERS[i];
  const next = TROPHY_TIERS[i + 1] || null;
  const prev = i > 0 ? TROPHY_TIERS[i - 1] : null;
  return { current, next, prev, index: i };
}

export function trophyForXp(xp) {
  const value = Math.max(0, Number(xp) || 0);
  let index = 0;
  for (let i = 0; i < TROPHY_TIERS.length; i += 1) {
    if (value >= TROPHY_TIERS[i].minXp) index = i;
  }
  const { current, next, prev } = trophyFromIndex(index);
  const span = next ? next.minXp - current.minXp : 1;
  const into = value - current.minXp;
  const pct = next ? Math.min(100, Math.round((into / span) * 100)) : 100;
  return {
    current,
    next,
    prev,
    index,
    xp: value,
    pct,
    toNext: next ? next.minXp - value : 0,
  };
}
