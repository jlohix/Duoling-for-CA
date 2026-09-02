// gamification.js
//
// XP, hearts (lives), and daily-streak logic — kept in one place and documented like
// adaptiveEngine.js, on the same "explainable, not a black box" principle.
//
// IMPORTANT DESIGN NOTE FOR THE TEAM: hearts (below) block further practice once they
// hit 0, Duolingo-style. That's a real tension with the pedagogy goal of maximizing
// learning time — blocking a student from practicing because they got unlucky/careless
// is arguably the opposite of what an adaptive tutor should do. This was built because
// gamification was explicitly requested, but it's genuinely worth the team deciding
// whether hearts should block practice at all, or just be a cosmetic/motivational
// counter with no gate. The regen interval below is deliberately short for demo
// purposes — tune HEART_REGEN_INTERVAL_MS (or remove the gate in server.js) once you've
// made that call.
'use strict';

// ---------- XP ----------
const XP_BASE_CORRECT = 10;
const XP_DIFFICULTY_BONUS = { 1: 0, 2: 3, 3: 5 }; // easy / medium / hard

function xpForAnswer(isCorrect, difficulty) {
  if (!isCorrect) return 0;
  return XP_BASE_CORRECT + (XP_DIFFICULTY_BONUS[difficulty] || 0);
}

// ---------- Hearts ----------
const MAX_HEARTS = 5;
const HEART_REGEN_INTERVAL_MS = 60 * 1000; // 1 heart per minute — short on purpose, for demoing. Tune freely.

/**
 * Catch up any hearts regenerated since heartsUpdatedAt, given the current time.
 * Pure function — caller is responsible for persisting the result.
 * @returns {{hearts:number, heartsUpdatedAtMs:number, changed:boolean}}
 */
function regenerateHearts(hearts, heartsUpdatedAtMs, nowMs) {
  if (hearts >= MAX_HEARTS) return { hearts, heartsUpdatedAtMs, changed: false };
  const elapsed = nowMs - heartsUpdatedAtMs;
  const regenCount = Math.floor(elapsed / HEART_REGEN_INTERVAL_MS);
  if (regenCount <= 0) return { hearts, heartsUpdatedAtMs, changed: false };
  const newHearts = Math.min(MAX_HEARTS, hearts + regenCount);
  const consumedMs = regenCount * HEART_REGEN_INTERVAL_MS;
  return { hearts: newHearts, heartsUpdatedAtMs: heartsUpdatedAtMs + consumedMs, changed: true };
}

/**
 * Apply one wrong answer. Only starts the regen clock the moment hearts first drop
 * below max, so losing hearts 2 and 3 in quick succession doesn't reset progress
 * already made toward regenerating heart 1.
 */
function loseHeart(hearts, heartsUpdatedAtMs, nowMs) {
  const wasFull = hearts >= MAX_HEARTS;
  return {
    hearts: Math.max(0, hearts - 1),
    heartsUpdatedAtMs: wasFull ? nowMs : heartsUpdatedAtMs,
  };
}

function secondsToNextHeart(heartsUpdatedAtMs, nowMs) {
  const elapsed = nowMs - heartsUpdatedAtMs;
  const remaining = HEART_REGEN_INTERVAL_MS - (elapsed % HEART_REGEN_INTERVAL_MS);
  return Math.max(0, Math.ceil(remaining / 1000));
}

// ---------- Daily streak ----------
// A simple day-over-day "played at all" streak (server local date, YYYY-MM-DD).
// Note for the team: this uses server-local date via toISOString(), which is UTC —
// fine for a single-timezone prototype, but worth revisiting if students span timezones.
function todayDateString(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

function daysBetween(dateStrA, dateStrB) {
  const a = new Date(dateStrA + 'T00:00:00Z').getTime();
  const b = new Date(dateStrB + 'T00:00:00Z').getTime();
  return Math.round((b - a) / 86400000);
}

/**
 * Call once per "session start" (e.g. on login or first answer of a visit).
 * @returns {{currentStreak:number, longestStreak:number, lastActiveDate:string, changed:boolean}}
 */
function applyDailyActivity(lastActiveDate, currentStreak, longestStreak, now = new Date()) {
  const today = todayDateString(now);
  if (lastActiveDate === today) {
    return { currentStreak, longestStreak, lastActiveDate: today, changed: false };
  }
  let newStreak;
  if (lastActiveDate && daysBetween(lastActiveDate, today) === 1) {
    newStreak = currentStreak + 1; // played yesterday -> streak continues
  } else {
    newStreak = 1; // gap of 2+ days, or first time ever -> streak resets
  }
  return {
    currentStreak: newStreak,
    longestStreak: Math.max(longestStreak, newStreak),
    lastActiveDate: today,
    changed: true,
  };
}

module.exports = {
  XP_BASE_CORRECT, XP_DIFFICULTY_BONUS, xpForAnswer,
  MAX_HEARTS, HEART_REGEN_INTERVAL_MS, regenerateHearts, loseHeart, secondsToNextHeart,
  todayDateString, applyDailyActivity,
};
