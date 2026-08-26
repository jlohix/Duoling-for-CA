const STORAGE_KEY = "circuito-progress-v1";
const XP_CORRECT = 10;
const XP_LESSON_BONUS = 20;

function emptyState() {
  return {
    xp: 0,
    completed: [],
    streak: 0,
    lastPracticeDate: "",
    unlockedBySkip: [],
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
    };
  } catch {
    return emptyState();
  }
}

function saveProgress(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addXp(state, amount) {
  const next = { ...state, xp: state.xp + amount };
  saveProgress(next);
  return next;
}

export function completeLesson(state, key) {
  let next = recordPractice(state);
  if (!next.completed.includes(key)) {
    next = {
      ...next,
      xp: next.xp + XP_LESSON_BONUS,
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

export const SKIP_QUIZ_SIZE = 5;
export const SKIP_PASS_RATIO = 0.8;

export { XP_CORRECT, XP_LESSON_BONUS };
