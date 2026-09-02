// db.js — thin wrapper around Node's built-in SQLite (no external dependencies).
'use strict';
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'ee2101.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  hearts INTEGER NOT NULL DEFAULT 5,
  hearts_updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT,                   -- 'YYYY-MM-DD', for the daily streak (see gamification.js)
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  week INTEGER NOT NULL,
  code TEXT UNIQUE NOT NULL,       -- e.g. "W1"
  name TEXT NOT NULL               -- e.g. "Week 1: Basic Concepts & Laws"
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  stage TEXT NOT NULL,             -- original "Stage" value, e.g. "W1_BasicConcepts1"
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL,    -- 'A' | 'B' | 'C' | 'D'
  difficulty INTEGER NOT NULL,     -- 1=easy, 2=medium, 3=hard (prototype heuristic — see import script)
  image_ref TEXT,                  -- original image filename reference, NULL if none/placeholder
  explanation TEXT                 -- not present in legacy CSV; left NULL, backfill later
);
CREATE INDEX IF NOT EXISTS idx_questions_topic_difficulty ON questions(topic_id, difficulty);

CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  question_id INTEGER NOT NULL REFERENCES questions(id),
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  is_correct INTEGER NOT NULL,     -- 0 | 1
  time_taken_ms INTEGER,
  difficulty_at_attempt INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_attempts_user_topic ON attempts(user_id, topic_id, created_at);

CREATE TABLE IF NOT EXISTS topic_progress (
  user_id INTEGER NOT NULL REFERENCES users(id),
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  proficiency REAL NOT NULL DEFAULT 50,   -- EMA score, 0-100
  difficulty INTEGER NOT NULL DEFAULT 2,  -- current serving difficulty, 1-3
  attempts_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, topic_id)
);
`);

// ---------- migration: add gamification columns to a users table created before they existed ----------
// (keeps any existing data/db.file's attempt history and users intact instead of requiring a wipe)
const existingUserColumns = new Set(db.prepare('PRAGMA table_info(users)').all().map(c => c.name));
const userColumnMigrations = [
  ['xp', "ALTER TABLE users ADD COLUMN xp INTEGER NOT NULL DEFAULT 0"],
  ['hearts', "ALTER TABLE users ADD COLUMN hearts INTEGER NOT NULL DEFAULT 5"],
  ['hearts_updated_at', "ALTER TABLE users ADD COLUMN hearts_updated_at TEXT NOT NULL DEFAULT (datetime('now'))"],
  ['current_streak', "ALTER TABLE users ADD COLUMN current_streak INTEGER NOT NULL DEFAULT 0"],
  ['longest_streak', "ALTER TABLE users ADD COLUMN longest_streak INTEGER NOT NULL DEFAULT 0"],
  ['last_active_date', "ALTER TABLE users ADD COLUMN last_active_date TEXT"],
];
for (const [col, sql] of userColumnMigrations) {
  if (!existingUserColumns.has(col)) db.exec(sql);
}

module.exports = db;
