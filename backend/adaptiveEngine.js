// adaptiveEngine.js
//
// Transparent, EMA-based adaptive difficulty engine, deliberately kept simple and
// explainable (per Prof Sunwoo's "know what the vibe coding is doing" guidance) rather
// than a black-box model. This mirrors the EMA proficiency formula used in both the
// prior-semester AWS build and the current GCP "Impulse 2.0" POC:
//
//   S_t = alpha * x_t + (1 - alpha) * S_(t-1)
//
// where x_t = 100 if the attempt was correct, 0 if wrong, and S_t is a 0-100
// "proficiency" score per (user, topic). alpha=0.3 means recent attempts move the
// score faster than old ones, without letting a single lucky/unlucky answer swing it
// wildly.
//
// Difficulty tiers (matches both prior Impulse versions):
//   proficiency > 75         -> Hard   (3)
//   40 <= proficiency <= 75  -> Medium (2)
//   proficiency < 40         -> Easy   (1)
//
// Anti-fail-up safeguard: never raise difficulty in the same step as a wrong answer,
// even if the EMA update alone would cross a threshold upward. This avoids the
// frustrating "got it wrong, now it's harder" experience.
'use strict';

const ALPHA = 0.3;
const HARD_THRESHOLD = 75;
const MEDIUM_THRESHOLD = 40;

function scoreToDifficulty(score) {
  if (score > HARD_THRESHOLD) return 3;
  if (score >= MEDIUM_THRESHOLD) return 2;
  return 1;
}

/**
 * Compute the next proficiency score after one attempt.
 * @param {number} oldScore current EMA proficiency, 0-100
 * @param {boolean} wasCorrect whether the just-submitted answer was correct
 * @returns {number} new EMA proficiency, 0-100
 */
function updateProficiency(oldScore, wasCorrect) {
  const x = wasCorrect ? 100 : 0;
  const newScore = ALPHA * x + (1 - ALPHA) * oldScore;
  return Math.max(0, Math.min(100, newScore));
}

/**
 * Decide the difficulty to serve on the NEXT question, given the updated proficiency
 * and the anti-fail-up safeguard.
 * @param {number} newScore proficiency after this attempt
 * @param {boolean} wasCorrect whether the just-submitted answer was correct
 * @param {number} previousDifficulty difficulty (1-3) the just-submitted question was served at
 * @returns {number} next difficulty, 1-3
 */
function nextDifficulty(newScore, wasCorrect, previousDifficulty) {
  let target = scoreToDifficulty(newScore);
  if (!wasCorrect && target > previousDifficulty) {
    target = previousDifficulty; // anti-fail-up safeguard
  }
  return target;
}

module.exports = { ALPHA, HARD_THRESHOLD, MEDIUM_THRESHOLD, scoreToDifficulty, updateProficiency, nextDifficulty };
