(function () {
  "use strict";

  var UNITS = JSON.parse(document.getElementById('units-data').textContent);
  var QUESTIONS = JSON.parse(document.getElementById('questions-data').textContent);
  var QMAP = {};
  QUESTIONS.forEach(function (q) { QMAP[q.id] = q; });

  var STORE_KEY = 'ampup_state_v1';
  var RANKS = [
    { name: 'Apprentice Technician', min: 0, icon: '🔌' },
    { name: 'Junior Engineer', min: 150, icon: '🧰' },
    { name: 'Circuit Technician', min: 400, icon: '⚙️' },
    { name: 'Senior Engineer', min: 800, icon: '🛠️' },
    { name: 'Systems Architect', min: 1400, icon: '🧠' },
    { name: 'Master Analyst', min: 2200, icon: '🏆' }
  ];

  function defaultState() {
    return { volts: 0, streak: 0, lastPlayedDate: null, lessonProgress: {}, mistakes: [], theme: 'system' };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      var base = defaultState();
      for (var k in base) { if (!(k in parsed)) parsed[k] = base[k]; }
      return parsed;
    } catch (e) { return defaultState(); }
  }

  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  var state = loadState();
  applyTheme();

  function applyTheme() {
    var root = document.documentElement;
    if (state.theme === 'light') root.setAttribute('data-theme', 'light');
    else if (state.theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function yesterdayStr() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  function getRank(volts) {
    var cur = RANKS[0], next = RANKS[1] || null;
    for (var i = 0; i < RANKS.length; i++) {
      if (volts >= RANKS[i].min) { cur = RANKS[i]; next = RANKS[i + 1] || null; }
    }
    var pct = 100;
    if (next) pct = Math.max(4, Math.min(100, Math.round(((volts - cur.min) / (next.min - cur.min)) * 100)));
    return { cur: cur, next: next, pct: pct };
  }

  function lessonStars(lessonId) {
    var p = state.lessonProgress[lessonId];
    return p ? p.stars : 0;
  }

  function allUnits() { return UNITS; }

  function isUnitCompleted(unit) {
    return unit.lessons.every(function (l) { return lessonStars(l.id) >= 1; });
  }
  function isUnitUnlocked(index) {
    if (index === 0) return true;
    return isUnitCompleted(UNITS[index - 1]);
  }
  function isLessonUnlocked(unit, lessonIndex) {
    if (lessonIndex === 0) return true;
    return lessonStars(unit.lessons[lessonIndex - 1].id) >= 1;
  }
  function frontierUnitIndex() {
    for (var i = 0; i < UNITS.length; i++) {
      if (isUnitUnlocked(i) && !isUnitCompleted(UNITS[i])) return i;
    }
    return UNITS.length - 1;
  }

  // ===== Rendering =====
  var app = document.getElementById('app');
  var session = null; // active lesson session
  var activeUnitId = null;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function topbar() {
    var r = getRank(state.volts);
    return '' +
      '<div class="topbar">' +
        '<div class="brand"><span class="brand-mark">⚡</span>AmpUp</div>' +
        '<div class="topbar-stats">' +
          '<div class="stat-pill streak">🔥<span class="stat-num">' + state.streak + '</span></div>' +
          '<div class="stat-pill volts">' + r.cur.icon + '<span class="stat-num">' + state.volts + 'V</span></div>' +
          '<button class="theme-toggle" data-action="toggle-theme" title="Toggle theme" aria-label="Toggle theme">' + themeIcon() + '</button>' +
        '</div>' +
      '</div>';
  }
  function themeIcon() {
    if (state.theme === 'dark') return '🌙';
    if (state.theme === 'light') return '☀️';
    return '🌓';
  }

  function renderHome() {
    session = null;
    var r = getRank(state.volts);
    var mistakesCount = state.mistakes.length;
    var html = topbar();
    html += '<div class="home-header"><div class="home-title">Circuit Analysis Lab</div><div class="home-sub">Work the bench, earn Volts, keep your streak alive.</div></div>';
    html += '<div class="rank-card"><div class="rank-icon">' + r.cur.icon + '</div><div style="flex:1">' +
      '<div class="rank-name">' + esc(r.cur.name) + '</div>' +
      '<div class="rank-bar-track"><div class="rank-bar-fill" style="width:' + r.pct + '%"></div></div>' +
      '<div class="rank-meta">' + (r.next ? (state.volts + ' / ' + r.next.min + ' V to ' + esc(r.next.name)) : 'Top rank reached') + '</div>' +
      '</div></div>';

    if (mistakesCount > 0) {
      html += '<div class="mistakes-card" data-action="start-review">' +
        '<div class="mi-icon">🩹</div><div class="mi-text"><div class="mi-title">Repair Bench</div>' +
        '<div class="mi-sub">' + mistakesCount + ' question' + (mistakesCount === 1 ? '' : 's') + ' to re-fix</div></div>' +
        '<div class="mi-arrow">›</div></div>';
    }

    html += '<div class="path">';
    var pattern = ['center', 'right', 'center', 'left'];
    var frontier = frontierUnitIndex();
    UNITS.forEach(function (unit, i) {
      var unlocked = isUnitUnlocked(i);
      var completed = isUnitCompleted(unit);
      var align = pattern[i % pattern.length];
      var cls = 'module-node' + (!unlocked ? ' locked' : (completed ? ' completed' : (i === frontier ? ' current' : '')));
      html += '<div class="module-row align-' + align + '">' +
        '<div>' +
        '<div class="' + cls + '" data-action="open-unit" data-unit="' + unit.id + '" aria-label="' + esc(unit.name) + '">' +
        '<span class="module-icon">' + (unlocked ? unit.icon : '🔒') + '</span>' +
        (completed ? '<span class="module-check">✓</span>' : '') +
        '</div>' +
        '<div class="module-label">' + esc(unit.name) + '</div>' +
        '</div></div>';
    });
    html += '</div>';
    html += '<div class="footer-note">' + QUESTIONS.length + ' questions across ' + UNITS.length + ' modules · adapted from your Circuit Analysis question bank</div>';
    app.innerHTML = html;
  }

  function starString(n) {
    n = Math.max(0, Math.min(3, n || 0));
    var s = '';
    for (var i = 0; i < 3; i++) {
      s += i < n ? '<span class="star-on">★</span>' : '<span class="star-off">☆</span>';
    }
    return s;
  }

  function openUnitSheet(unitId) {
    var unit = UNITS.filter(function (u) { return u.id === unitId; })[0];
    if (!unit) return;
    var unitIndex = UNITS.indexOf(unit);
    if (!isUnitUnlocked(unitIndex)) return;
    activeUnitId = unitId;
    var html = '<div class="scrim" data-action="close-sheet"></div>';
    html += '<div class="sheet" role="dialog" aria-label="' + esc(unit.name) + '">';
    html += '<div class="sheet-handle"></div>';
    html += '<div class="sheet-header"><div class="sheet-icon">' + unit.icon + '</div><div><div class="sheet-title">' + esc(unit.name) + '</div><div class="sheet-blurb">' + esc(unit.blurb) + '</div></div>' +
      '<button class="sheet-close" data-action="close-sheet" aria-label="Close">✕</button></div>';
    html += '<div class="lab-list">';
    unit.lessons.forEach(function (lesson, i) {
      var unlocked = isLessonUnlocked(unit, i);
      var stars = lessonStars(lesson.id);
      var cls = 'lab-card' + (unlocked ? '' : ' locked');
      html += '<div class="' + cls + '" ' + (unlocked ? 'data-action="start-lesson" data-lesson="' + lesson.id + '"' : '') + '>' +
        '<div class="lab-emoji">' + (unlocked ? lesson.icon : '🔒') + '</div>' +
        '<div class="lab-info"><div class="lab-name">' + esc(lesson.label) + '</div>' +
        '<div class="lab-meta">' + lesson.questionIds.length + ' questions</div></div>' +
        (unlocked ? '<div class="lab-stars">' + starString(stars) + '</div><div class="lab-go">›</div>' : '') +
        '</div>';
    });
    html += '</div></div>';
    var wrap = document.createElement('div');
    wrap.id = 'sheet-wrap';
    wrap.innerHTML = html;
    document.body.appendChild(wrap);
  }
  function closeSheet() {
    var w = document.getElementById('sheet-wrap');
    if (w) w.remove();
  }

  // ===== Lesson session =====
  function startLesson(lessonId) {
    var lesson = null, unit = null;
    UNITS.forEach(function (u) { u.lessons.forEach(function (l) { if (l.id === lessonId) { lesson = l; unit = u; } }); });
    if (!lesson) return;
    closeSheet();
    session = {
      ids: lesson.questionIds.slice(),
      idx: 0, charge: 5, correct: 0, xp: 0,
      lessonId: lessonId, unitName: unit.name, lessonName: lesson.label,
      isReview: false, answered: false, missedThisSession: []
    };
    renderLessonScreen();
  }

  function startReview() {
    var ids = state.mistakes.slice(0, 15);
    if (!ids.length) return;
    session = {
      ids: ids, idx: 0, charge: 5, correct: 0, xp: 0,
      lessonId: null, unitName: 'Repair Bench', lessonName: 'Review',
      isReview: true, answered: false, missedThisSession: []
    };
    renderLessonScreen();
  }

  function currentQuestion() { return QMAP[session.ids[session.idx]]; }

  function renderLessonScreen() {
    var q = currentQuestion();
    var pct = Math.round((session.idx / session.ids.length) * 100);
    var html = '<div class="lesson-screen">';
    html += '<div class="lesson-top">' +
      '<button class="lesson-exit" data-action="exit-lesson" aria-label="Exit">✕</button>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="charge-meter" aria-label="Charge remaining">' + chargeBolts() + '</div>' +
      '</div>';
    html += '<div class="lesson-body">';
    html += '<div class="q-eyebrow">' + esc(session.unitName) + (session.lessonName ? ' · ' + esc(session.lessonName) : '') + ' · <span style="white-space:nowrap">Q' + (session.idx + 1) + '/' + session.ids.length + '</span></div>';
    html += '<div class="q-text">' + q.questionHtml + '</div>';
    if (q.image) {
      html += '<a class="q-diagram-link" href="' + esc(q.image) + '" target="_blank" rel="noopener">📐 View circuit diagram ↗</a>';
    }
    html += '<div class="options" id="options-wrap">';
    q.options.forEach(function (opt, i) {
      html += '<button class="option" data-action="select-option" data-idx="' + i + '">' +
        '<span class="opt-badge">' + String.fromCharCode(65 + i) + '</span>' +
        '<span>' + q.optionsHtml[i] + '</span></button>';
    });
    html += '</div>';
    html += '<div id="feedback-slot"></div>';
    html += '</div></div>';
    app.innerHTML = html;
  }

  function chargeBolts() {
    var h = '';
    for (var i = 0; i < 5; i++) {
      h += '<span class="charge-bolt' + (i < session.charge ? '' : ' spent') + '">⚡</span>';
    }
    return h;
  }

  function selectOption(idx) {
    if (session.answered) return;
    session.answered = true;
    var q = currentQuestion();
    var correct = idx === q.correctIndex;
    var buttons = document.querySelectorAll('#options-wrap .option');
    buttons.forEach(function (btn, i) {
      btn.disabled = true;
      if (i === q.correctIndex) btn.classList.add('correct');
      else if (i === idx) btn.classList.add('wrong');
      else btn.classList.add('dimmed');
    });

    if (correct) {
      session.correct++;
      session.xp += 10;
      if (state.mistakes.indexOf(q.id) !== -1) {
        state.mistakes = state.mistakes.filter(function (id) { return id !== q.id; });
      }
    } else {
      session.charge--;
      session.missedThisSession.push(q.id);
      if (state.mistakes.indexOf(q.id) === -1) state.mistakes.push(q.id);
    }
    saveState();

    var isLast = session.idx >= session.ids.length - 1;
    var willFail = session.charge <= 0;
    var feedback = '<div class="feedback-bar ' + (correct ? 'correct' : 'wrong') + '">' +
      '<div class="feedback-head">' + (correct ? '✅ Correct!' : '⚡ Not quite') + '</div>';
    if (q.explanationHtml) {
      feedback += '<div class="feedback-explain">' + q.explanationHtml + '</div>';
    } else if (!correct) {
      feedback += '<div class="feedback-explain">Correct answer: <b>' + q.optionsHtml[q.correctIndex] + '</b></div>';
    }
    feedback += '<button class="btn btn-block ' + (correct ? 'btn-primary' : 'btn-danger') + '" data-action="continue">' +
      (willFail ? "See results" : (isLast ? "Finish" : "Continue")) + '</button>';
    feedback += '</div>';
    document.getElementById('feedback-slot').innerHTML = feedback;
  }

  function continueSession() {
    if (session.charge <= 0) { finishSession(false); return; }
    session.idx++;
    session.answered = false;
    if (session.idx >= session.ids.length) { finishSession(true); return; }
    renderLessonScreen();
  }

  function finishSession(passed) {
    var total = session.ids.length;
    var accuracy = total ? session.correct / total : 0;
    var stars = 0;
    if (passed) {
      stars = accuracy >= 0.9 ? 3 : (accuracy >= 0.7 ? 2 : 1);
    }
    var bonusXp = passed ? (session.charge * 2) + (stars === 3 ? 20 : 0) : 0;
    var earnedVolts = session.xp + bonusXp;

    if (passed && session.lessonId) {
      var prev = state.lessonProgress[session.lessonId];
      var prevStars = prev ? prev.stars : 0;
      state.lessonProgress[session.lessonId] = { stars: Math.max(prevStars, stars) };
    }
    // Correct-answer Volts are kept even on a failed run; only the pass
    // bonus, streak, and lesson stars require actually finishing the lab.
    state.volts += earnedVolts;
    if (passed) {
      var today = todayStr(), yest = yesterdayStr();
      if (state.lastPlayedDate !== today) {
        state.streak = (state.lastPlayedDate === yest) ? state.streak + 1 : 1;
        state.lastPlayedDate = today;
      }
    }
    saveState();
    renderSummary(passed, { total: total, correct: session.correct, accuracy: accuracy, stars: stars, earnedVolts: earnedVolts });
  }

  function renderSummary(passed, r) {
    var html = '<div class="summary-screen">';
    if (passed) {
      html += '<div class="summary-badge">' + (r.stars === 3 ? '🏅' : r.stars === 2 ? '🎯' : '🔧') + '</div>';
      html += '<div class="summary-title">Lab complete!</div>';
      html += '<div class="summary-stars">' + starString(r.stars) + '</div>';
      html += '<div class="summary-sub">' + esc(session.unitName) + (session.lessonName ? ' · ' + esc(session.lessonName) : '') + '</div>';
    } else {
      html += '<div class="summary-badge">🔋</div>';
      html += '<div class="summary-title">Out of charge</div>';
      html += '<div class="summary-sub">You ran out of charge — give it another go.</div>';
    }
    html += '<div class="summary-stats">' +
      '<div class="summary-stat"><div class="val">' + r.correct + '/' + r.total + '</div><div class="lbl">Correct</div></div>' +
      '<div class="summary-stat"><div class="val">' + Math.round(r.accuracy * 100) + '%</div><div class="lbl">Accuracy</div></div>' +
      '<div class="summary-stat"><div class="val">+' + r.earnedVolts + 'V</div><div class="lbl">Volts</div></div>' +
      '</div>';
    html += '<div class="summary-actions">';
    if (!passed) {
      html += '<button class="btn btn-primary btn-block" data-action="retry-lesson">Try again</button>';
    }
    html += '<button class="btn ' + (passed ? 'btn-primary' : 'btn-ghost') + ' btn-block" data-action="go-home">Back to path</button>';
    html += '</div></div>';
    app.innerHTML = html;
  }

  function retryLesson() {
    var lid = session.lessonId, isReview = session.isReview;
    if (isReview) { startReview(); } else if (lid) { startLesson(lid); }
  }

  // ===== Event delegation =====
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');
    switch (action) {
      case 'open-unit': openUnitSheet(el.getAttribute('data-unit')); break;
      case 'close-sheet': closeSheet(); break;
      case 'start-lesson': startLesson(el.getAttribute('data-lesson')); break;
      case 'start-review': startReview(); break;
      case 'select-option': selectOption(parseInt(el.getAttribute('data-idx'), 10)); break;
      case 'continue': continueSession(); break;
      case 'exit-lesson': session = null; renderHome(); break;
      case 'retry-lesson': retryLesson(); break;
      case 'go-home': renderHome(); break;
      case 'toggle-theme':
        state.theme = state.theme === 'system' ? 'light' : (state.theme === 'light' ? 'dark' : 'system');
        saveState(); applyTheme();
        if (session) renderLessonScreen(); else renderHome();
        break;
    }
  });

  renderHome();
})();
