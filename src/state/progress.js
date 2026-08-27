import { DEFAULT_CLASS, normalizeClassId } from "../data/classes";

const STORAGE_KEY = "circuito-progress-v1";
const XP_CORRECT = 10;
const XP_LESSON_BONUS = 20;

const XP_BY_DIFFICULTY = {
  1: { correct: 10, bonus: 20 },
  2: { correct: 20, bonus: 40 },
  3: { correct: 30, bonus: 60 },
};

export function xpForCorrect(difficulty) {
  return XP_BY_DIFFICULTY[Number(difficulty)]?.correct ?? XP_CORRECT;
}

export function xpForLessonBonus(difficulty) {
  return XP_BY_DIFFICULTY[Number(difficulty)]?.bonus ?? XP_LESSON_BONUS;
}

function emptyState() {
  return {
    xp: 0,
    completed: [],
    streak: 0,
    lastPracticeDate: "",
    unlockedBySkip: [],
    topicStats: {},
    leagueIndex: 0,
    classId: DEFAULT_CLASS,
  };
}

export function todayKey() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function dayGap(fromKey, toKey) {
  const from = new Date(`${fromKey}T12:00:00`);
  const to = new Date(`${toKey}T12:00:00`);
  return Math.round((to - from) / 86400000);
}

export function visibleStreak(state) {
  const last = state.lastPracticeDate;
  if (!last) return 0;
  const gap = dayGap(last, todayKey());
  if (gap > 1) return 0;
  return Number(state.streak) || 0;
}

export function wouldExtendStreak(state) {
  return state.lastPracticeDate !== todayKey();
}

/** True when a live streak has not been practiced yet today (resets at midnight). */
export function streakExpiresTonight(state) {
  return visibleStreak(state) > 0 && wouldExtendStreak(state);
}

export function msUntilEndOfDay(now = Date.now()) {
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return Math.max(0, end.getTime() - now);
}

/** Time left until the streak would reset if no more practice happens. */
export function msUntilStreakExpiry(state, now = Date.now()) {
  if (visibleStreak(state) <= 0) return 0;
  const tonight = msUntilEndOfDay(now);
  if (streakExpiresTonight(state)) return tonight;
  return tonight + 86400000;
}

export function formatTimer(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const clock = [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
  return days > 0 ? `${days}d ${clock}` : clock;
}

export function recordPractice(state) {
  const today = todayKey();
  const last = state.lastPracticeDate;
  if (last === today) return state;

  let streak = 1;
  if (last && dayGap(last, today) === 1) {
    streak = (Number(state.streak) || 0) + 1;
  }

  const next = { ...state, streak, lastPracticeDate: today };
  saveProgress(next);
  return next;
}

function parseTopicStats(raw) {
  if (!raw || typeof raw !== "object") return {};
  const out = {};
  for (const [id, val] of Object.entries(raw)) {
    out[id] = {
      correct: Number(val?.correct) || 0,
      attempts: Number(val?.attempts) || 0,
    };
  }
  return out;
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const data = JSON.parse(raw);
    return {
      xp: Number(data.xp) || 0,
      completed: Array.isArray(data.completed) ? data.completed : [],
      streak: Number(data.streak) || 0,
      lastPracticeDate: data.lastPracticeDate || "",
      unlockedBySkip: Array.isArray(data.unlockedBySkip)
        ? data.unlockedBySkip
        : [],
      topicStats: parseTopicStats(data.topicStats),
      leagueIndex: Number.isFinite(Number(data.leagueIndex))
        ? Number(data.leagueIndex)
        : 0,
      classId: normalizeClassId(data.classId),
    };
  } catch {
    return emptyState();
  }
}

function saveProgress(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export { saveProgress };

export function recordFirstTry(state, topicId, ok) {
  if (!topicId) return state;
  const key = String(topicId);
  const topicStats = { ...(state.topicStats || {}) };
  const prev = topicStats[key] || { correct: 0, attempts: 0 };
  topicStats[key] = {
    correct: prev.correct + (ok ? 1 : 0),
    attempts: prev.attempts + 1,
  };
  const next = { ...state, topicStats };
  saveProgress(next);
  return next;
}

const STRENGTH_PCT = 80;
const SOLID_PCT = 60;
const DEVELOP_PCT = 40;
const LABEL_AFTER = 3;

export function topicInsight(progress, topicId) {
  const stats = progress.topicStats?.[topicId] || progress.topicStats?.[String(topicId)];
  const correct = Number(stats?.correct) || 0;
  const attempts = Number(stats?.attempts) || 0;
  if (!attempts) {
    const practiced = (progress.completed || []).some((key) =>
      String(key).startsWith(`${topicId}-`)
    );
    return {
      kind: "empty",
      label: practiced ? "No accuracy yet" : "Not practiced",
      detail: practiced
        ? "Replay a lesson to measure first-try accuracy."
        : "Answer questions to measure this topic.",
      pct: null,
      correct: 0,
      attempts: 0,
    };
  }
  const pct = Math.round((correct / attempts) * 100);
  const score = { pct, correct, attempts };
  if (attempts < LABEL_AFTER) {
    return {
      kind: "starting",
      label: "Getting started",
      detail: `${correct}/${attempts} first try (${pct}%)`,
      ...score,
    };
  }
  if (pct >= STRENGTH_PCT) {
    return {
      kind: "strength",
      label: "Strength",
      detail: `${correct}/${attempts} first try (${pct}%)`,
      ...score,
    };
  }
  if (pct >= SOLID_PCT) {
    return {
      kind: "solid",
      label: "Solid",
      detail: `${correct}/${attempts} first try (${pct}%)`,
      ...score,
    };
  }
  if (pct >= DEVELOP_PCT) {
    return {
      kind: "developing",
      label: "Needs work",
      detail: `${correct}/${attempts} first try (${pct}%)`,
      ...score,
    };
  }
  return {
    kind: "weakness",
    label: "Weakness",
    detail: `${correct}/${attempts} first try (${pct}%)`,
    ...score,
  };
}

export function addXp(state, amount) {
  const next = { ...state, xp: state.xp + amount };
  saveProgress(next);
  return next;
}

export function completeLesson(state, key, bonus = XP_LESSON_BONUS) {
  let next = recordPractice(state);
  if (!next.completed.includes(key)) {
    next = {
      ...next,
      xp: next.xp + bonus,
      completed: [...next.completed, key],
    };
  }
  saveProgress(next);
  return next;
}

export function unlockTopicBySkip(state, topicId) {
  let next = recordPractice(state);
  const unlockedBySkip = next.unlockedBySkip.includes(topicId)
    ? next.unlockedBySkip
    : [...next.unlockedBySkip, topicId];
  next = {
    ...next,
    unlockedBySkip,
    xp: next.xp + XP_LESSON_BONUS,
  };
  saveProgress(next);
  return next;
}

export function isTopicUnlocked(topicIndex, progress, counts = {}) {
  if (topicIndex === 0) return true;
  const topicId = topicIndex + 1;
  if ((progress.unlockedBySkip || []).includes(topicId)) return true;
  const completed = progress.completed || [];
  const prevId = topicIndex;
  const required = [1, 2, 3].find((d) => (counts[`${prevId}-${d}`] || 0) > 0);
  if (!required) return true;
  return completed.includes(`${prevId}-${required}`);
}

export function isLessonUnlocked(topicId, difficulty, progress, counts = {}) {
  const completed = progress.completed || [];
  for (const earlier of [1, 2, 3]) {
    if (earlier >= difficulty) break;
    const n = counts[`${topicId}-${earlier}`] || 0;
    if (!n) continue;
    if (!completed.includes(`${topicId}-${earlier}`)) return false;
  }
  return true;
}

export const SKIP_QUIZ_SIZE = 5;
export const SKIP_PASS_RATIO = 0.8;

export { XP_CORRECT, XP_LESSON_BONUS };
