import { listStudents } from "../state/roster";
import { syncLeagueSeason } from "../state/league";
import { trophyFromIndex } from "./trophies";
import { CLASS_IDS, DEFAULT_CLASS, normalizeClassId } from "./classes";

function decorate(row, leagues, youName) {
  return {
    username: row.username,
    display: row.display,
    classId: normalizeClassId(row.classId),
    xp: Number(row.xp) || 0,
    streak: Number(row.streak) || 0,
    live: Boolean(row.live),
    custom: Boolean(row.custom),
    synthetic: Boolean(row.synthetic),
    league: trophyFromIndex(leagues[row.username] ?? 0).current,
    isYou: youName
      ? row.username.toLowerCase() === youName.toLowerCase()
      : false,
  };
}

function rankRows(rows) {
  return [...rows]
    .sort(
      (a, b) =>
        b.xp - a.xp ||
        b.streak - a.streak ||
        a.display.localeCompare(b.display)
    )
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function youNameOf(user) {
  return user?.role === "admin" ? "" : user?.username || "";
}

export function studentClassId(user, progress) {
  if (user?.role === "admin") return normalizeClassId(progress.classId);
  const you = listStudents(progress).find(
    (row) =>
      row.username.toLowerCase() === String(user?.username || "").toLowerCase()
  );
  return normalizeClassId(you?.classId || progress.classId);
}

export function buildClassLeaderboard(user, progress, classId) {
  const youName = youNameOf(user);
  const leagues = syncLeagueSeason(progress).state.leagueIndex;
  const focus = normalizeClassId(classId || studentClassId(user, progress));
  const ranked = rankRows(
    listStudents(progress, { includeSynthetic: true })
      .map((row) => decorate(row, leagues, youName))
      .filter((row) => row.classId === focus)
  );
  const you = ranked.find((row) => row.isYou);
  return {
    rows: ranked,
    youRank: you?.rank || null,
    total: ranked.length,
    classId: focus,
  };
}

export function buildCohortLeaderboard(user, progress) {
  const youName = youNameOf(user);
  const leagues = syncLeagueSeason(progress).state.leagueIndex;
  const people = listStudents(progress, { includeSynthetic: true }).map((row) =>
    decorate(row, leagues, youName)
  );
  const yourClass = studentClassId(user, progress);
  const buckets = Object.fromEntries(
    CLASS_IDS.map((id) => [
      id,
      { classId: id, members: 0, xp: 0, you: id === yourClass },
    ])
  );
  for (const row of people) {
    const bucket = buckets[row.classId];
    if (!bucket) continue;
    bucket.members += 1;
    bucket.xp += row.xp;
  }
  const rows = Object.values(buckets)
    .map((row) => ({
      ...row,
      avg: row.members ? Math.round(row.xp / row.members) : 0,
    }))
    .sort(
      (a, b) =>
        b.xp - a.xp || b.avg - a.avg || a.classId.localeCompare(b.classId)
    )
    .map((row, index) => ({ ...row, rank: index + 1 }));
  const yours = rows.find((row) => row.you);
  return {
    rows,
    youRank: yours?.rank || null,
    yourClass,
    total: CLASS_IDS.length,
  };
}

export function buildIndividualLeaderboard(user, progress) {
  const youName = youNameOf(user);
  const leagues = syncLeagueSeason(progress).state.leagueIndex;
  const ranked = rankRows(
    listStudents(progress, { includeSynthetic: true }).map((row) =>
      decorate(row, leagues, youName)
    )
  );
  const you = ranked.find((row) => row.isYou) || null;
  return {
    top: ranked.slice(0, 10),
    you,
    youInTop: Boolean(you && you.rank <= 10),
    youRank: you?.rank || null,
    total: ranked.length,
  };
}
