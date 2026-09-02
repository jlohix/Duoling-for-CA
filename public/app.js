'use strict';

const state = {
  user: null,       // { id, username, display_name }
  topics: [],
  currentTopicId: null,
  currentQuestion: null,
  questionStartedAt: null,
};

const el = (id) => document.getElementById(id);

// ---------- persistence (this is a real locally-hosted app, not an in-conversation
// preview, so localStorage is fine here — it just remembers who was last logged in) ----------
function saveSession(user) {
  try { localStorage.setItem('ee2101_user', JSON.stringify(user)); } catch (e) { /* ignore */ }
}
function loadSession() {
  try { return JSON.parse(localStorage.getItem('ee2101_user') || 'null'); } catch (e) { return null; }
}
function clearSession() {
  try { localStorage.removeItem('ee2101_user'); } catch (e) { /* ignore */ }
}

// ---------- API helpers ----------
async function api(path, opts) {
  const res = await fetch(path, opts);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || `request failed: ${path}`);
  return body;
}

// ---------- view switching ----------
function showView(name) {
  ['loginView', 'topicPickerView', 'quizView', 'profileView'].forEach(v => el(v).classList.add('hidden'));
  el(name).classList.remove('hidden');
  el('nav').classList.toggle('hidden', name === 'loginView');
  el('navQuiz').classList.toggle('active', name === 'quizView' || name === 'topicPickerView');
  el('navProfile').classList.toggle('active', name === 'profileView');
}

// ---------- login ----------
el('loginBtn').addEventListener('click', async () => {
  const username = el('usernameInput').value.trim();
  if (!username) return;
  const { user } = await api('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  state.user = user;
  saveSession(user);
  await afterLogin();
});
el('usernameInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') el('loginBtn').click(); });

el('navLogout').addEventListener('click', () => {
  clearSession();
  state.user = null;
  el('usernameInput').value = '';
  showView('loginView');
});

async function afterLogin() {
  const { topics } = await api('/api/topics');
  state.topics = topics;
  const sel = el('topicSelect');
  sel.innerHTML = topics.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  showView('topicPickerView');
}

// ---------- topic picker ----------
el('startQuizBtn').addEventListener('click', () => {
  state.currentTopicId = Number(el('topicSelect').value);
  showView('quizView');
  loadNextQuestion();
});
el('changeTopicBtn').addEventListener('click', () => showView('topicPickerView'));
el('navQuiz').addEventListener('click', () => showView(state.currentTopicId ? 'quizView' : 'topicPickerView'));

// ---------- quiz ----------
async function loadNextQuestion() {
  el('nextBtn').classList.add('hidden');
  el('feedbackBox').innerHTML = '';
  el('questionText').textContent = 'Loading question…';
  el('optionsList').innerHTML = '';

  const data = await api(`/api/next-question?userId=${state.user.id}&topicId=${state.currentTopicId}`);
  state.currentQuestion = data.question;
  state.questionStartedAt = Date.now();
  renderProgress(data.progress);
  renderQuestion(data.question);
}

function renderProgress(progress) {
  el('difficultyBadge').textContent = progress.difficultyLabel;
  el('difficultyBadge').className = `badge diff-${progress.difficulty}`;
  el('profBarFill').style.width = `${Math.max(2, Math.min(100, progress.proficiency))}%`;
  el('profValue').textContent = Math.round(progress.proficiency);
}

function renderQuestion(q) {
  el('stageTag').textContent = q.stage;
  el('questionText').textContent = q.questionText;
  const list = el('optionsList');
  list.innerHTML = '';
  ['A', 'B', 'C', 'D'].forEach((letter) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="letter">${letter}.</span><span>${q.options[letter]}</span>`;
    btn.addEventListener('click', () => submitAnswer(letter));
    list.appendChild(btn);
  });
}

async function submitAnswer(letter) {
  const buttons = Array.from(document.querySelectorAll('.option-btn'));
  buttons.forEach(b => b.disabled = true);

  const timeTakenMs = Date.now() - state.questionStartedAt;
  const result = await api('/api/submit-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: state.user.id,
      questionId: state.currentQuestion.id,
      selectedAnswer: letter,
      timeTakenMs,
    }),
  });

  const idx = { A: 0, B: 1, C: 2, D: 3 }[letter];
  const correctIdx = { A: 0, B: 1, C: 2, D: 3 }[result.correctAnswer];
  buttons[idx].classList.add(result.correct ? 'correct' : 'wrong');
  if (!result.correct) buttons[correctIdx].classList.add('correct');

  const box = el('feedbackBox');
  box.innerHTML = `
    <div class="feedback ${result.correct ? 'correct' : 'wrong'}">
      <strong>${result.correct ? 'Correct!' : 'Not quite.'}</strong>
      ${result.correct ? '' : ` The correct answer is ${result.correctAnswer}.`}
      ${result.explanation ? `<div class="explanation">${result.explanation}</div>` : `<div class="explanation">No explanation available yet for this legacy question — see README on backfilling explanations.</div>`}
      <div class="progress-shift">
        Proficiency now ${result.progress.proficiency} · next question will be
        <strong>${result.progress.difficultyLabel}</strong>
      </div>
    </div>`;
  renderProgress(result.progress);
  el('nextBtn').classList.remove('hidden');
}

el('nextBtn').addEventListener('click', loadNextQuestion);

// ---------- profile ----------
el('navProfile').addEventListener('click', async () => {
  showView('profileView');
  const data = await api(`/api/profile?userId=${state.user.id}`);
  const overall = data.overall;
  const pct = overall.attempts ? Math.round((100 * overall.correct) / overall.attempts) : 0;
  el('overallStats').textContent = `${overall.attempts} question(s) attempted overall · ${pct}% correct`;

  const list = el('topicList');
  list.innerHTML = data.topics.map(t => `
    <div class="topic-row">
      <div>
        <div class="topic-name">${t.name}</div>
        <div class="topic-meta">${t.attemptsCount} attempt(s)</div>
      </div>
      <div class="prof-bar-track" style="width:120px;">
        <div class="prof-bar-fill" style="width:${Math.max(2, t.proficiency)}%"></div>
      </div>
      <span class="badge diff-${t.difficulty}">${t.difficultyLabel}</span>
    </div>
  `).join('');
});

// ---------- boot ----------
(async function boot() {
  const existing = loadSession();
  if (existing) {
    state.user = existing;
    try {
      await afterLogin();
      return;
    } catch (e) {
      clearSession();
    }
  }
  showView('loginView');
})();
