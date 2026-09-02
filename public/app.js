'use strict';

const state = {
  user: null,
  topics: [],          // from /api/topics
  topicProfiles: [],    // from /api/profile (per-topic proficiency/difficulty/started)
  currentTopicId: null,
  currentQuestion: null,
  questionStartedAt: null,
  combo: 0,             // client-side "correct in a row" counter, resets on wrong answer or topic change
  heartTimerInterval: null,
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
  if (!res.ok && !body.outOfHearts) throw new Error(body.error || `request failed: ${path}`);
  return body;
}

// ---------- view switching ----------
function showView(name) {
  ['loginView', 'topicPickerView', 'quizView', 'profileView', 'outOfHeartsView'].forEach(v => el(v).classList.add('hidden'));
  el(name).classList.remove('hidden');
  el('nav').classList.toggle('hidden', name === 'loginView');
  el('statsBar').classList.toggle('hidden', name === 'loginView');
  el('navQuiz').classList.toggle('active', ['quizView', 'topicPickerView', 'outOfHeartsView'].includes(name));
  el('navProfile').classList.toggle('active', name === 'profileView');
  if (name !== 'outOfHeartsView' && state.heartTimerInterval) {
    clearInterval(state.heartTimerInterval);
    state.heartTimerInterval = null;
  }
}

// ---------- header stats bar ----------
function renderStatsBar(g) {
  if (!g) return;
  el('statStreak').innerHTML = `🔥 <b>${g.currentStreak}</b>`;
  el('statXp').innerHTML = `⭐ <b>${g.xp}</b> XP`;
  const heartsEl = el('statHearts');
  let html = '';
  for (let i = 0; i < g.heartsMax; i++) {
    html += `<span class="heart-icon">${i < g.hearts ? '❤️' : '🤍'}</span>`;
  }
  heartsEl.innerHTML = html;
}

function shakeHearts() {
  const heartsEl = el('statHearts');
  heartsEl.style.animation = 'none';
  // force reflow so the animation can restart
  void heartsEl.offsetWidth;
  heartsEl.style.animation = 'wrongShake 0.35s ease';
}

function showXpToast(amount) {
  if (!amount) return;
  const toast = document.createElement('div');
  toast.className = 'xp-toast';
  toast.textContent = `+${amount} XP`;
  el('toastLayer').appendChild(toast);
  setTimeout(() => toast.remove(), 1400);
}

// ---------- login ----------
el('loginBtn').addEventListener('click', async () => {
  const username = el('usernameInput').value.trim();
  if (!username) return;
  const { user, gamification } = await api('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  state.user = user;
  saveSession(user);
  renderStatsBar(gamification);
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
  await loadTopicPicker();
}

// ---------- topic picker (card grid, replaces the old dropdown) ----------
async function loadTopicPicker() {
  const { topics: profiles } = await api(`/api/profile?userId=${state.user.id}`);
  state.topicProfiles = profiles;
  const grid = el('topicGrid');
  grid.innerHTML = profiles.map(t => `
    <div class="topic-card" data-topic-id="${t.topicId}">
      <div>
        <div class="topic-week">Week ${t.week}</div>
        <div class="topic-name">${t.name}</div>
        <div class="topic-meta-row">
          <div class="prof-bar-track" style="width:100px;">
            <div class="prof-bar-fill" style="width:${Math.max(2, t.proficiency)}%"></div>
          </div>
          <span style="font-size:0.75rem; color:var(--muted);">${t.attemptsCount} attempt(s)</span>
        </div>
      </div>
      <div class="topic-right">
        ${t.started
          ? `<span class="badge diff-${t.difficulty}">${t.difficultyLabel}</span>`
          : `<span class="badge not-started">Not started</span>`}
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.topic-card').forEach(card => {
    card.addEventListener('click', () => {
      state.currentTopicId = Number(card.dataset.topicId);
      state.combo = 0;
      showView('quizView');
      loadNextQuestion();
    });
  });
  showView('topicPickerView');
}

el('changeTopicBtn').addEventListener('click', loadTopicPicker);
el('heartsChangeTopicBtn').addEventListener('click', loadTopicPicker);
el('navQuiz').addEventListener('click', () => {
  if (state.currentTopicId) { showView('quizView'); } else { loadTopicPicker(); }
});

// ---------- quiz ----------
async function loadNextQuestion() {
  el('nextBtn').classList.add('hidden');
  el('feedbackBox').innerHTML = '';
  el('comboBanner').classList.add('hidden');
  el('imagePlaceholder').classList.add('hidden');
  el('questionText').textContent = 'Loading question…';
  el('optionsList').innerHTML = '';

  const data = await api(`/api/next-question?userId=${state.user.id}&topicId=${state.currentTopicId}`);
  renderStatsBar(data.gamification);

  if (data.outOfHearts) {
    enterOutOfHearts(data.gamification);
    return;
  }

  state.currentQuestion = data.question;
  state.questionStartedAt = Date.now();
  renderProgress(data.progress);
  renderQuestion(data.question);
}

function renderProgress(progress) {
  el('difficultyBadge').textContent = progress.difficultyLabel;
  el('difficultyBadge').className = `badge diff-${progress.difficulty}`;
  el('profBarFill').style.width = `${Math.max(2, Math.min(100, progress.proficiency))}%`;
}

function renderQuestion(q) {
  el('stageTag').textContent = q.stageLabel || q.stage;
  el('questionText').textContent = q.questionText;

  if (q.imageRef) {
    el('imagePlaceholder').classList.remove('hidden');
  } else {
    el('imagePlaceholder').classList.add('hidden');
  }

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

function renderCombo() {
  const banner = el('comboBanner');
  if (state.combo >= 2) {
    banner.textContent = `🔥 ${state.combo} in a row!`;
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
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

  if (result.outOfHearts) {
    renderStatsBar(result.gamification);
    enterOutOfHearts(result.gamification);
    return;
  }

  const idx = { A: 0, B: 1, C: 2, D: 3 }[letter];
  const correctIdx = { A: 0, B: 1, C: 2, D: 3 }[result.correctAnswer];
  buttons[idx].classList.add(result.correct ? 'correct' : 'wrong');
  if (!result.correct) buttons[correctIdx].classList.add('correct');

  if (result.correct) {
    state.combo += 1;
    showXpToast(result.xpGained);
  } else {
    state.combo = 0;
    shakeHearts();
  }
  renderCombo();

  const box = el('feedbackBox');
  box.innerHTML = `
    <div class="feedback ${result.correct ? 'correct' : 'wrong'}">
      <strong>${result.correct ? 'Correct!' : 'Not quite.'}</strong>
      ${result.correct ? '' : ` The correct answer is ${result.correctAnswer}.`}
      ${result.explanation ? `<div class="explanation">${result.explanation}</div>` : `<div class="explanation">No explanation available yet for this legacy question — see README on backfilling explanations.</div>`}
      ${result.correct ? `<div class="xp-line">+${result.xpGained} XP</div>` : ''}
      <div class="progress-shift">
        Proficiency now ${result.progress.proficiency} · next question will be
        <strong>${result.progress.difficultyLabel}</strong>
      </div>
    </div>`;
  renderProgress(result.progress);
  renderStatsBar(result.gamification);
  el('nextBtn').classList.remove('hidden');
}

el('nextBtn').addEventListener('click', loadNextQuestion);

// ---------- out of hearts ----------
function enterOutOfHearts(g) {
  showView('outOfHeartsView');
  updateHeartTimer(g.secondsToNextHeart);
  let remaining = g.secondsToNextHeart;
  state.heartTimerInterval = setInterval(async () => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(state.heartTimerInterval);
      state.heartTimerInterval = null;
      // re-check with the server (regen math lives there, this is just a UI countdown)
      const me = await api(`/api/me?userId=${state.user.id}`);
      renderStatsBar(me.gamification);
      if (me.gamification.hearts > 0) {
        loadNextQuestion();
      } else {
        enterOutOfHearts(me.gamification); // safety net in case client/server clocks drifted
      }
      return;
    }
    updateHeartTimer(remaining);
  }, 1000);
}

function updateHeartTimer(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  el('heartTimer').textContent = `${m}:${s}`;
}

// ---------- profile ----------
el('navProfile').addEventListener('click', async () => {
  showView('profileView');
  const [{ overall, topics }, me] = await Promise.all([
    api(`/api/profile?userId=${state.user.id}`),
    api(`/api/me?userId=${state.user.id}`),
  ]);
  renderStatsBar(me.gamification);

  const pct = overall.attempts ? Math.round((100 * overall.correct) / overall.attempts) : 0;
  el('overallStats').innerHTML = `
    <div class="stat-item"><div class="val">${overall.attempts}</div><div class="lbl">Attempted</div></div>
    <div class="stat-item"><div class="val">${pct}%</div><div class="lbl">Correct</div></div>
    <div class="stat-item"><div class="val">${me.gamification.xp}</div><div class="lbl">Total XP</div></div>
    <div class="stat-item"><div class="val">${me.gamification.currentStreak}</div><div class="lbl">Day streak</div></div>
    <div class="stat-item"><div class="val">${me.gamification.longestStreak}</div><div class="lbl">Best streak</div></div>
  `;

  const list = el('topicList');
  list.innerHTML = topics.map(t => `
    <div class="topic-row">
      <div>
        <div class="topic-name">${t.name}</div>
        <div class="topic-meta">${t.attemptsCount} attempt(s)</div>
      </div>
      <div class="prof-bar-track" style="width:120px;">
        <div class="prof-bar-fill" style="width:${Math.max(2, t.proficiency)}%"></div>
      </div>
      ${t.started
        ? `<span class="badge diff-${t.difficulty}">${t.difficultyLabel}</span>`
        : `<span class="badge not-started">Not started</span>`}
    </div>
  `).join('');
});

// ---------- boot ----------
(async function boot() {
  const existing = loadSession();
  if (existing) {
    state.user = existing;
    try {
      const me = await api(`/api/me?userId=${state.user.id}`);
      renderStatsBar(me.gamification);
      await afterLogin();
      return;
    } catch (e) {
      clearSession();
    }
  }
  showView('loginView');
})();
