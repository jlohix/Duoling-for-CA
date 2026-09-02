import { listStudents } from "./roster";
import { saveProgress } from "./progress";
import { clampLeagueIndex, trophyFromIndex } from "../data/trophies";

const STORAGE_KEY = "circuito-league-v2";
export const SEASON_DAYS = 3;
export const LEAGUE_SIZE = 8;
const DURATION_MS = SEASON_DAYS * 24 * 60 * 60 * 1000;

const RIVALS = [
  ["kai", "Kai"],
  ["noor", "Noor"],
  ["tess", "Tess"],
  ["rio", "Rio"],
  ["hana", "Hana"],
  ["vik", "Vik"],
  ["suki", "Suki"],
  ["elias", "Elias"],
  ["mira", "Mira"],
  ["jon", "Jon"],
];

function hashString(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 33 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function zoneCounts(total) {
  const n = Math.max(1, total);
  let promote = Math.max(1, Math.round(n * 0.2));
  let demote = Math.max(1, Math.round(n * 0.2));
  if (promote + demote >= n) {
    promote = 1;
    demote = n > 1 ? 1 : 0;
  }
  return { promote, demote };
}

export function zoneForRank(rank, total) {
  const { promote, demote } = zoneCounts(total);
  if (rank <= promote) return "promote";
  if (demote && rank > total - demote) return "demote";
  return "safe";
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.seasonStart) return null;
    return {
      seasonStart: Number(data.seasonStart) || Date.now(),
      startXp: data.startXp && typeof data.startXp === "object" ? data.startXp : {},
      leagueIndex:
        data.leagueIndex && typeof data.leagueIndex === "object"
          ? data.leagueIndex
          : {},
    };
  } catch {
    return null;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function demoSeasonXp(username, seasonStart, now) {
  const hash = hashString(`${username}:${seasonStart}`);
  const target = 35 + (hash % 140);
  const elapsed = Math.min(1, Math.max(0, (now - seasonStart) / DURATION_MS));
  const early = 8 + (hash % 40);
  return Math.round(early + (target - early) * elapsed);
}

function seasonXpFor(student, state, now) {
  if (student.live) {
    const start = Number(state.startXp[student.username]);
    const base = Number.isFinite(start) ? start : student.xp;
    return Math.max(0, (Number(student.xp) || 0) - base);
  }
  return demoSeasonXp(student.username, state.seasonStart, now);
}

function snapshot(students, leagueIndex) {
  const startXp = {};
  const nextIndex = { ...leagueIndex };
  for (const row of students) {
    startXp[row.username] = Number(row.xp) || 0;
    if (nextIndex[row.username] == null) nextIndex[row.username] = 0;
    else nextIndex[row.username] = clampLeagueIndex(nextIndex[row.username]);
  }
  return { startXp, leagueIndex: nextIndex };
}

function withLeagueMeta(students, state, now) {
  return students.map((row) => ({
    ...row,
    filler: false,
    seasonXp: seasonXpFor(row, state, now),
    leagueIndex: clampLeagueIndex(state.leagueIndex[row.username] ?? 0),
  }));
}

function padLeague(members, leagueIndex, state, now) {
  const used = new Set(members.map((row) => row.username.toLowerCase()));
  const out = [...members];
  for (const [name, display] of RIVALS) {
    if (out.length >= LEAGUE_SIZE) break;
    if (used.has(name)) continue;
    const username = `league-${leagueIndex}-${name}`;
    const hash = hashString(`${username}:${state.seasonStart}`);
    out.push({
      username,
      display,
      xp: 0,
      streak: 1 + (hash % 18),
      live: false,
      filler: true,
      seasonXp: demoSeasonXp(username, state.seasonStart, now),
      leagueIndex,
    });
  }
  return out;
}

function sortZone(rows) {
  const total = rows.length;
  return [...rows]
    .sort(
      (a, b) =>
        b.seasonXp - a.seasonXp ||
        b.xp - a.xp ||
        a.display.localeCompare(b.display)
    )
    .map((row, index) => {
      const rank = index + 1;
      return { ...row, rank, zone: zoneForRank(rank, total) };
    });
}

function fieldForLeague(students, state, now, leagueIndex) {
  const members = withLeagueMeta(students, state, now).filter(
    (row) => row.leagueIndex === leagueIndex
  );
  return sortZone(padLeague(members, leagueIndex, state, now));
}

function applySeasonResults(ranked, leagueIndex) {
  const next = { ...leagueIndex };
  for (const row of ranked) {
    if (row.filler) continue;
    const current = clampLeagueIndex(next[row.username] ?? row.leagueIndex);
    if (row.zone === "promote") next[row.username] = clampLeagueIndex(current + 1);
    else if (row.zone === "demote") next[row.username] = clampLeagueIndex(current - 1);
    else next[row.username] = current;
  }
  return next;
}

function settleSeason(students, seasonStart, startXp, leagueIndex, atTime) {
  const state = { seasonStart, startXp, leagueIndex };
  const meta = withLeagueMeta(students, state, atTime);
  const indices = [...new Set(meta.map((row) => row.leagueIndex))];
  let next = { ...leagueIndex };
  for (const index of indices) {
    const ranked = fieldForLeague(students, state, atTime, index);
    next = applySeasonResults(ranked, next);
  }
  return next;
}

export function syncLeagueSeason(liveProgress) {
  const students = listStudents(liveProgress);
  const now = Date.now();
  let state = loadState();
  if (!state) {
    const snap = snapshot(students, {});
    state = { seasonStart: now, ...snap };
    saveState(state);
    const progress = {
      ...liveProgress,
      leagueIndex: state.leagueIndex.student1,
    };
    if (progress.leagueIndex !== liveProgress.leagueIndex) saveProgress(progress);
    return { progress, state };
  }

  let seasonStart = state.seasonStart;
  let leagueIndex = { ...state.leagueIndex };
  let startXp = { ...state.startXp };
  let guard = 0;
  while (now >= seasonStart + DURATION_MS && guard < 24) {
    leagueIndex = settleSeason(
      students,
      seasonStart,
      startXp,
      leagueIndex,
      seasonStart + DURATION_MS - 1
    );
    seasonStart += DURATION_MS;
    const snap = snapshot(students, leagueIndex);
    startXp = snap.startXp;
    leagueIndex = snap.leagueIndex;
    guard += 1;
  }

  for (const row of students) {
    if (leagueIndex[row.username] == null) leagueIndex[row.username] = 0;
    if (startXp[row.username] == null) startXp[row.username] = row.xp;
  }

  state = { seasonStart, startXp, leagueIndex };
  saveState(state);
  const progress = {
    ...liveProgress,
    leagueIndex: leagueIndex.student1,
  };
  if (progress.leagueIndex !== liveProgress.leagueIndex) saveProgress(progress);
  return { progress, state };
}

export function skipLeagueDays(liveProgress, days = 15) {
  const students = listStudents(liveProgress);
  const ms = Math.max(0, Number(days) || 0) * 24 * 60 * 60 * 1000;
  let state = loadState();
  if (!state) {
    state = { seasonStart: Date.now(), ...snapshot(students, {}) };
  }
  saveState({
    ...state,
    seasonStart: Number(state.seasonStart) - ms,
  });
  return syncLeagueSeason(liveProgress);
}

export function formatRemain(ms) {
  const value = Math.max(0, ms);
  const days = Math.floor(value / 86400000);
  const hours = Math.floor((value % 86400000) / 3600000);
  const minutes = Math.floor((value % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export function buildLeagueBoard(user, progress, leagueIndexOverride) {
  const { state } = syncLeagueSeason(progress);
  const students = listStudents(progress);
  const now = Date.now();
  const youName = user?.role === "admin" ? "" : user?.username || "";
  const focusName = youName || "student1";
  const focus =
    students.find(
      (row) => row.username.toLowerCase() === focusName.toLowerCase()
    ) || students[0];
  const leagueIndex = clampLeagueIndex(
    leagueIndexOverride != null
      ? leagueIndexOverride
      : state.leagueIndex[focus?.username] ?? 0
  );
  const ranked = fieldForLeague(students, state, now, leagueIndex);
  const total = ranked.length;
  const counts = zoneCounts(total);
  const league = trophyFromIndex(leagueIndex).current;
  const rows = ranked.map((row) => ({
    username: row.username,
    display: row.display,
    xp: row.xp,
    seasonXp: row.seasonXp,
    streak: row.streak,
    rank: row.rank,
    zone: row.zone,
    league,
    isYou: youName
      ? row.username.toLowerCase() === youName.toLowerCase()
      : false,
  }));
  return {
    rows,
    counts,
    league,
    remainMs: state.seasonStart + DURATION_MS - now,
    seasonDays: SEASON_DAYS,
  };
}
