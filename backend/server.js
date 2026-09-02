// server.js — plain Node http server (no Express — npm registry wasn't reachable while
// building this prototype, and it turns out to be a nice property: `node backend/server.js`
// just works, no `npm install`, no native-binary build step for anyone on the team).
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');
const db = require('./db');
const { updateProficiency, nextDifficulty, scoreToDifficulty } = require('./adaptiveEngine');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

// ---------- small helpers ----------

function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; if (data.length > 1e6) req.destroy(); });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res, pathname) {
  let filePath = pathname === '/' ? '/index.html' : pathname;
  const resolved = path.join(PUBLIC_DIR, filePath);
  if (!resolved.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(resolved, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const ext = path.extname(resolved);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

// ---------- DB-backed helpers ----------

function getOrCreateUser(username, displayName) {
  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (existing) return existing;
  const result = db.prepare('INSERT INTO users (username, display_name) VALUES (?, ?)').run(username, displayName || username);
  return db.prepare('SELECT * FROM users WHERE id = ?').get(Number(result.lastInsertRowid));
}

function getOrCreateProgress(userId, topicId) {
  const existing = db.prepare('SELECT * FROM topic_progress WHERE user_id = ? AND topic_id = ?').get(userId, topicId);
  if (existing) return existing;
  db.prepare('INSERT INTO topic_progress (user_id, topic_id, proficiency, difficulty) VALUES (?, ?, 50, 2)').run(userId, topicId);
  return db.prepare('SELECT * FROM topic_progress WHERE user_id = ? AND topic_id = ?').get(userId, topicId);
}

function pickQuestion(topicId, difficulty, userId, excludeRecentN = 15) {
  const recent = db.prepare(`
    SELECT question_id FROM attempts WHERE user_id = ? AND topic_id = ?
    ORDER BY id DESC LIMIT ?
  `).all(userId, topicId, excludeRecentN).map(r => r.question_id);

  const placeholders = recent.length ? recent.map(() => '?').join(',') : null;
  let row;
  if (placeholders) {
    row = db.prepare(`
      SELECT * FROM questions WHERE topic_id = ? AND difficulty = ? AND id NOT IN (${placeholders})
      ORDER BY RANDOM() LIMIT 1
    `).get(topicId, difficulty, ...recent);
  }
  if (!row) {
    // fall back: allow repeats if we've exhausted the unseen pool at this difficulty
    row = db.prepare('SELECT * FROM questions WHERE topic_id = ? AND difficulty = ? ORDER BY RANDOM() LIMIT 1').get(topicId, difficulty);
  }
  if (!row) {
    // last resort: any difficulty in this topic (shouldn't normally happen — every topic has all 3 tiers)
    row = db.prepare('SELECT * FROM questions WHERE topic_id = ? ORDER BY RANDOM() LIMIT 1').get(topicId);
  }
  return row;
}

const DIFFICULTY_LABEL = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

// ---------- route handlers ----------

async function handleApi(req, res, pathname, query) {
  // POST /api/users  { username, displayName? }
  if (pathname === '/api/users' && req.method === 'POST') {
    const body = await readBody(req);
    const username = (body.username || '').trim();
    if (!username) return sendJSON(res, 400, { error: 'username is required' });
    const user = getOrCreateUser(username, body.displayName);
    return sendJSON(res, 200, { user });
  }

  // GET /api/topics
  if (pathname === '/api/topics' && req.method === 'GET') {
    const topics = db.prepare('SELECT id, week, code, name FROM topics ORDER BY week').all();
    return sendJSON(res, 200, { topics });
  }

  // GET /api/next-question?userId=&topicId=
  if (pathname === '/api/next-question' && req.method === 'GET') {
    const userId = Number(query.userId);
    const topicId = Number(query.topicId);
    if (!userId || !topicId) return sendJSON(res, 400, { error: 'userId and topicId are required' });

    const progress = getOrCreateProgress(userId, topicId);
    const q = pickQuestion(topicId, progress.difficulty, userId);
    if (!q) return sendJSON(res, 404, { error: 'no questions available for this topic' });

    return sendJSON(res, 200, {
      question: {
        id: q.id,
        stage: q.stage,
        questionText: q.question_text,
        options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
        imageRef: q.image_ref,
        difficulty: q.difficulty,
        difficultyLabel: DIFFICULTY_LABEL[q.difficulty],
      },
      progress: {
        proficiency: Math.round(progress.proficiency * 10) / 10,
        difficulty: progress.difficulty,
        difficultyLabel: DIFFICULTY_LABEL[progress.difficulty],
        attemptsCount: progress.attempts_count,
      },
    });
  }

  // POST /api/submit-answer  { userId, questionId, selectedAnswer, timeTakenMs }
  if (pathname === '/api/submit-answer' && req.method === 'POST') {
    const body = await readBody(req);
    const userId = Number(body.userId);
    const questionId = Number(body.questionId);
    const selectedAnswer = (body.selectedAnswer || '').toUpperCase();
    const timeTakenMs = Number.isFinite(Number(body.timeTakenMs)) ? Math.round(Number(body.timeTakenMs)) : null;

    if (!userId || !questionId || !['A', 'B', 'C', 'D'].includes(selectedAnswer)) {
      return sendJSON(res, 400, { error: 'userId, questionId and a valid selectedAnswer (A-D) are required' });
    }
    const question = db.prepare('SELECT * FROM questions WHERE id = ?').get(questionId);
    if (!question) return sendJSON(res, 404, { error: 'question not found' });

    const topicId = question.topic_id;
    const progress = getOrCreateProgress(userId, topicId);
    const isCorrect = selectedAnswer === question.correct_answer;

    const newProficiency = updateProficiency(progress.proficiency, isCorrect);
    const newDifficulty = nextDifficulty(newProficiency, isCorrect, progress.difficulty);

    db.prepare(`
      INSERT INTO attempts (user_id, question_id, topic_id, is_correct, time_taken_ms, difficulty_at_attempt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, questionId, topicId, isCorrect ? 1 : 0, timeTakenMs, question.difficulty);

    db.prepare(`
      UPDATE topic_progress
      SET proficiency = ?, difficulty = ?, attempts_count = attempts_count + 1, updated_at = datetime('now')
      WHERE user_id = ? AND topic_id = ?
    `).run(newProficiency, newDifficulty, userId, topicId);

    return sendJSON(res, 200, {
      correct: isCorrect,
      correctAnswer: question.correct_answer,
      explanation: question.explanation, // NULL for legacy-imported rows — see README
      progress: {
        proficiency: Math.round(newProficiency * 10) / 10,
        difficulty: newDifficulty,
        difficultyLabel: DIFFICULTY_LABEL[newDifficulty],
      },
    });
  }

  // GET /api/profile/:userId  (encoded as ?userId=)
  if (pathname === '/api/profile' && req.method === 'GET') {
    const userId = Number(query.userId);
    if (!userId) return sendJSON(res, 400, { error: 'userId is required' });
    const rows = db.prepare(`
      SELECT t.id AS topic_id, t.code, t.name, t.week,
             COALESCE(p.proficiency, 50) AS proficiency,
             COALESCE(p.difficulty, 2) AS difficulty,
             COALESCE(p.attempts_count, 0) AS attempts_count
      FROM topics t
      LEFT JOIN topic_progress p ON p.topic_id = t.id AND p.user_id = ?
      ORDER BY t.week
    `).all(userId);

    const overallAttempts = db.prepare('SELECT COUNT(*) AS n, SUM(is_correct) AS correct FROM attempts WHERE user_id = ?').get(userId);

    return sendJSON(res, 200, {
      topics: rows.map(r => ({
        topicId: r.topic_id, code: r.code, name: r.name, week: r.week,
        proficiency: Math.round(r.proficiency * 10) / 10,
        difficulty: r.difficulty,
        difficultyLabel: DIFFICULTY_LABEL[r.difficulty],
        attemptsCount: r.attempts_count,
      })),
      overall: {
        attempts: overallAttempts.n || 0,
        correct: overallAttempts.correct || 0,
      },
    });
  }

  return sendJSON(res, 404, { error: 'not found' });
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  try {
    if (pathname.startsWith('/api/')) {
      await handleApi(req, res, pathname, parsed.query);
    } else {
      serveStatic(req, res, pathname);
    }
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: 'internal error', detail: String(err && err.message || err) });
  }
});

server.listen(PORT, () => {
  console.log(`EE2101 adaptive-quiz prototype listening on http://localhost:${PORT}`);
});
