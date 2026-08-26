// import_questions.js
//
// Imports the legacy EE2101 question bank (Questions_Set_1.csv, 1320 rows / 45 stages
// across W1-W12) into the prototype's SQLite database.
//
// The legacy CSV has NO difficulty or explanation columns, so this script assigns a
// heuristic difficulty (1=easy, 2=medium, 3=hard) from the stage name:
//   - "...Challenge" stages            -> hard (3)
//   - stage name ends in a digit "1"   -> easy (1)
//   - stage name ends in a digit "2"   -> medium (2)
//   - stage name ends in a digit >=3   -> hard (3)
//   - no trailing digit, not Challenge -> easy (1)   (treated as the intro stage for that concept)
//
// This is a PLACEHOLDER heuristic for prototyping the adaptive engine end-to-end.
// It should be reviewed/replaced by the team with difficulty tags assigned by content owners
// (see README.md "Known limitations").
//
// Usage:
//   node backend/scripts/import_questions.js /path/to/Questions_Set_1.csv
//
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const db = require('../db');
const { parseCSVFile } = require('./csv');

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node backend/scripts/import_questions.js /path/to/Questions_Set_1.csv');
  process.exit(1);
}
if (!fs.existsSync(csvPath)) {
  console.error(`File not found: ${csvPath}`);
  process.exit(1);
}

// Inferred human-readable names per week. Adjust freely to match the real syllabus wording.
const WEEK_NAMES = {
  1: 'Week 1: Basic Concepts & Laws',
  2: 'Week 2: Circuit Theorems & Nodal/Mesh Analysis',
  3: 'Week 3: Capacitors & Inductors',
  4: 'Week 4: First-Order RL/RC Circuits',
  5: 'Week 5: Laplace Transform Fundamentals',
  6: 'Week 6: Circuit Analysis with Laplace Transform',
  7: 'Week 7: Network Functions & Two-Port Intro',
  8: 'Week 8: Two-Port Networks',
  9: 'Week 9: Sinusoids, Phasors & Impedance',
  10: 'Week 10: Steady-State Power & Nodal/Mesh (Sinusoidal)',
  11: 'Week 11: AC Power & Power Factor',
  12: 'Week 12: Three-Phase Circuits',
};

// `indexInStage` is the 0-based position of this row within its stage, in file order.
// Used to spread single-part stages and Challenge stages across difficulty tiers instead
// of dumping an entire stage into one bucket (see header comment for the full rationale).
function inferDifficulty(stage, indexInStage) {
  if (/challenge/i.test(stage)) {
    // Challenge stages are review/mixed sets -> spread evenly across all 3 tiers.
    return (indexInStage % 3) + 1;
  }
  const m = stage.match(/(\d+)$/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n <= 1) return 1;
    if (n === 2) return 2;
    return 3;
  }
  // Single-part stage with no numbered follow-up: first half easy, second half medium.
  return indexInStage % 2 === 0 ? 1 : 2;
}

function weekFromStage(stage) {
  const m = stage.match(/^W(\d+)_/i);
  return m ? parseInt(m[1], 10) : null;
}

function normalizeImage(ref) {
  if (!ref) return null;
  const trimmed = ref.trim();
  if (!trimmed || /blankimage/i.test(trimmed)) return null;
  return trimmed;
}

function main() {
  const raw = fs.readFileSync(csvPath, 'utf8');
  const records = parseCSVFile(raw);
  console.log(`Parsed ${records.length} rows from ${path.basename(csvPath)}`);

  const getOrCreateTopic = db.prepare('SELECT id FROM topics WHERE code = ?');
  const insertTopic = db.prepare('INSERT INTO topics (week, code, name) VALUES (?, ?, ?)');
  const insertQuestion = db.prepare(`
    INSERT INTO questions
      (topic_id, stage, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, image_ref, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
  `);

  const topicIdCache = new Map();
  const stageIndexCounter = new Map();
  let inserted = 0, skipped = 0;

  const importAll = db.transaction ? null : null; // node:sqlite transactions handled manually below

  db.exec('BEGIN');
  try {
    for (const row of records) {
      const stage = (row['Stage'] !== undefined ? row['Stage'] : row['Stage ']).trim();
      const questionText = (row['QuestionText'] || '').trim();
      const a = (row['OptionA'] || '').trim();
      const b = (row['OptionB'] || '').trim();
      const c = (row['OptionC'] || '').trim();
      const d = (row['OptionD'] || '').trim();
      const correct = (row['Correct'] || '').trim().toUpperCase();
      const image = normalizeImage(row['Image']);

      if (!stage || !questionText || !a || !b || !c || !d || !['A', 'B', 'C', 'D'].includes(correct)) {
        skipped += 1;
        continue;
      }

      const week = weekFromStage(stage);
      if (!week) { skipped += 1; continue; }
      const topicCode = `W${week}`;

      let topicId = topicIdCache.get(topicCode);
      if (topicId === undefined) {
        const existing = getOrCreateTopic.get(topicCode);
        if (existing) {
          topicId = existing.id;
        } else {
          const name = WEEK_NAMES[week] || `Week ${week}`;
          const result = insertTopic.run(week, topicCode, name);
          topicId = Number(result.lastInsertRowid);
        }
        topicIdCache.set(topicCode, topicId);
      }

      const idxInStage = stageIndexCounter.get(stage) || 0;
      stageIndexCounter.set(stage, idxInStage + 1);
      const difficulty = inferDifficulty(stage, idxInStage);
      insertQuestion.run(topicId, stage, questionText, a, b, c, d, correct, difficulty, image);
      inserted += 1;
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  console.log(`Inserted ${inserted} questions, skipped ${skipped} malformed rows.`);

  const topicSummary = db.prepare(`
    SELECT t.code, t.name, COUNT(q.id) AS n,
           SUM(CASE WHEN q.difficulty=1 THEN 1 ELSE 0 END) AS easy,
           SUM(CASE WHEN q.difficulty=2 THEN 1 ELSE 0 END) AS medium,
           SUM(CASE WHEN q.difficulty=3 THEN 1 ELSE 0 END) AS hard
    FROM topics t LEFT JOIN questions q ON q.topic_id = t.id
    GROUP BY t.id ORDER BY t.week
  `).all();
  console.table(topicSummary);
}

main();
