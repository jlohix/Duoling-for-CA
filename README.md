# EE2101 Adaptive Quiz — Prototype

A from-scratch prototype for the "Duolingo for EE2101 Circuit Analysis" DIP project.
This is deliberately narrow in scope: it proves out the **core adaptive-difficulty quiz
loop**, end to end, seeded with real syllabus content — not a full clone of Impulse's
feature set (no chatbot yet, no leaderboard yet, no auth beyond a name).

## What's new in this version

Built in response to first-round feedback ("questions aren't showing correctly, some
diagrams aren't showing" / "the interface is unfriendly and not appealing"):

- **Diagram bug fixed the honest way.** Questions that need a circuit diagram now show
  a clearly-labeled "diagram not available yet" placeholder instead of silently asking
  an unanswerable question. The underlying image assets still don't exist in this repo
  (see Known limitations) — sourcing/creating them is a separate, real task for the
  content team — but the app no longer pretends the question is complete when it isn't.
- **Full visual redesign**: proper branded header, a real layout instead of a card
  floating in empty space, human-readable topic names instead of raw stage codes
  (`W3_MethodOfAnalysisPart1` → "Method Of Analysis Part 1"), a topic picker you click
  into directly instead of a bare dropdown, and a "Not started" state instead of a
  misleading default difficulty badge on topics you haven't touched.
- **Gamification**: XP, hearts (lives), and a daily streak — see below. This is a
  genuinely bigger feature, not just a visual add-on, so it gets its own section.

## Gamification

Three mechanics, all server-authoritative (the client just displays what the server
says — no gamification state lives only in the browser):

- **XP.** +10 for a correct answer, plus a difficulty bonus (+3 Medium, +5 Hard) — so
  10/13/15 XP per correct answer depending on tier. Wrong answers earn 0. Shown as a
  running total in the header and a floating "+N XP" toast on each correct answer.
  Formula lives in `backend/gamification.js` (`xpForAnswer`).
- **Hearts.** 5 max, lose 1 per wrong answer, regenerate automatically over time
  (1 heart per minute — short on purpose for demoing; see the note below). Hit 0 and
  the app blocks further questions in a dedicated "Out of hearts" screen with a live
  countdown, Duolingo-style.
- **Daily streak.** Counts consecutive calendar days you've done at least one question.
  Resets if you skip a day. Shown as a 🔥 counter in the header and on the Profile tab
  alongside your best-ever streak.
- **Combo counter** (session-only, not persisted): a "🔥 N in a row!" banner during a
  quiz while you keep answering correctly, resets on a wrong answer. Purely a
  frontend nicety, no server state.

**A design tension worth the team's attention:** hearts blocking practice once they hit
zero is real friction between "gamified" and "pedagogically optimal" — a student who's
struggling and needs *more* practice on a topic is the one most likely to run out of
hearts and get blocked from getting it. This was built because gamification was
explicitly requested, and it mirrors what real Duolingo (and last semester's Impulse,
which had its own "heart regeneration mechanism") both do — but it's genuinely worth
deciding as a team whether hearts should gate practice at all, or just be a cosmetic
counter with no consequence. If you decide to remove the gate, delete the
`if (user.hearts <= 0)` blocks in `backend/server.js`'s `/api/next-question` and
`/api/submit-answer` handlers and the mechanic becomes purely cosmetic.

## Why this scope

Per the team's decision to build from scratch, and Prof Sunwoo's suggestion to focus on
"pedagogy and quantitative analysis," the highest-value thing to prove first is the
adaptive engine itself — the part that's actually interesting to design and measure,
as opposed to CRUD/UI plumbing you'll rebuild in your own stack anyway.

## Why zero dependencies

`npm install` could not reach the npm registry in the environment this was built in, so
the whole thing is written against **only Node.js built-ins**: `node:http` for the server
and `node:sqlite` (built into Node 22.5+, currently experimental) for the database. No
`package-lock.json`, no `node_modules`, no native module compilation. If your team's
machines *can* reach npm, you're free to swap in Express/Postgres/whatever your team
prefers — this is a prototype, not a framework commitment. Requires **Node.js 22.5+**
(check with `node -v`; you'll see an "ExperimentalWarning: SQLite" message on startup —
that's expected and harmless).

## Running it

```bash
# 1. Import the question bank (only needs to be run once, or after editing the CSV)
node backend/scripts/import_questions.js /path/to/Questions_Set_1.csv

# 2. Start the server
node backend/server.js

# 3. Open http://localhost:3000
```

Enter any name to "log in" (no password — see Known limitations). Pick a topic card
(week), answer questions, and watch XP, hearts, streak, difficulty, and proficiency all
update live in the header and after each answer. The Profile tab shows per-topic
proficiency across all 12 weeks plus your overall stats.

## How the adaptive engine works

Implemented in `backend/adaptiveEngine.js`, and deliberately simple/explainable rather
than a black box (see Prof Sunwoo's note: "you should know what the vibe coding is
writing and fix as you go"):

- Each (student, topic) pair has a **proficiency score**, 0–100, updated after every
  answer with an exponential moving average:
  `S_t = 0.3 * x_t + 0.7 * S_(t-1)`, where `x_t` = 100 if correct, 0 if wrong.
  This is the same formula both the prior-semester AWS build and the current GCP
  "Impulse 2.0" POC use.
- The score maps to a difficulty tier: **>75 → Hard, 40–75 → Medium, <40 → Easy.**
- **Anti-fail-up safeguard:** difficulty is never raised in the same step as a wrong
  answer, even if the math would otherwise justify it — avoids the "got it wrong, now
  it's harder" experience.
- No neural net, no synthetic bootstrapping — every new (student, topic) pair starts at
  50/Medium. That's a real simplification versus last semester's brain.js approach
  (which needed synthetic pre-training since it had no cold-start default); an EMA
  doesn't need cold-start training, which is part of why it's a reasonable prototype
  starting point.

## Data model (`backend/db.js`)

`users` (now also carries `xp`, `hearts`, `hearts_updated_at`, `current_streak`,
`longest_streak`, `last_active_date`) → `topic_progress` (one row per student × topic:
current proficiency, current difficulty, attempt count) → `attempts` (full history, one
row per question answered) → `questions` (topic, difficulty, options, correct answer,
image reference) → `topics` (one per week, W1–W12).

If you're upgrading from an earlier copy of this prototype and want to keep existing
progress: keep your old `data/ee2101.db` file in place when you copy in these new
`backend/`/`public/` files. `db.js` runs a small migration on startup that adds the new
gamification columns to an existing `users` table rather than requiring a fresh
database. If you just want a clean slate, delete `data/ee2101.db` and re-run the import
script.

## What was imported, and how

`backend/scripts/import_questions.js` loads all 1,320 rows of the legacy
`Questions_Set_1.csv` bank (45 stages across weeks 1–12) and groups them by week into
12 topics. That CSV has **no difficulty column**, so difficulty is assigned by a
heuristic based on stage name — see the comment at the top of the import script for the
exact rule. This is a placeholder good enough to make the adaptive engine demonstrable
immediately; it is **not** a substitute for a real content review pass.

## Known limitations (read before demoing or extending)

- **Difficulty tags are heuristic, not reviewed.** Re-tag questions by hand (or have
  whoever owns content review) before trusting them for a real cohort.
- **No explanations.** The legacy CSV has no explanation field, so the UI shows a
  placeholder note instead. Backfilling explanations per question is a good next task
  for whoever owns content.
- **`Image` references still don't resolve to real files.** The CSV points at image
  filenames (`QuestionImages/...`) that aren't included here — 484/1320 rows are
  `BlankImage` (no image needed, and those questions display fine) but the other 836
  reference a diagram this repo doesn't have. The app now shows an honest "diagram not
  available yet" placeholder for those (decided deliberately over silently asking an
  unanswerable question) — but the underlying task of actually sourcing or redrawing
  836 circuit diagrams is still open, and those questions remain in the pool, so
  students will still hit the placeholder fairly often on some topics. Worth deciding
  whether to temporarily exclude image-needing questions from being served at all until
  images exist, versus leaving them visible-but-flagged as now.
- **No real authentication.** Logging in is just typing a name — anyone can play as
  anyone. Fine for a prototype demo, not for real deployment (same gap the current
  Impulse 2.0 POC has on its admin routes, for what it's worth).
- **No password/session security, no rate limiting, no input sanitization beyond basic
  type checks.** Don't deploy this publicly as-is.
- **SQLite via `node:sqlite` is marked experimental** by Node.js. Fine for a prototype;
  worth re-evaluating (e.g. Postgres) before a real multi-user rollout.
- **Hearts-blocks-practice is an unresolved design question**, not a bug — see the
  Gamification section above.
- **Daily streak uses UTC dates** (`toISOString().slice(0,10)`) rather than the
  student's local timezone — fine for a single-timezone demo, worth revisiting if this
  goes to a real cohort.
- **Stage-name humanization is a heuristic**, same spirit as the difficulty tagging —
  most read fine ("Basic Concepts 2"), a few abbreviation-heavy ones don't
  ("SFRLRCCircuit" → "SFRLRC Circuit"). See `humanizeStage()` in `server.js`.

## Natural next steps

- Backfill explanations + review difficulty tags on the seeded question bank.
- Source or redraw the 836 missing circuit diagrams (or decide to exclude those
  questions from the pool in the meantime).
- Decide the hearts-vs-pedagogy question above, one way or the other.
- Add a "why" to each proficiency change in the UI (e.g. a small chart of proficiency
  over time) — this is where the "quantitative learning analysis" angle Prof Sunwoo
  mentioned could differentiate you from Impulse.
- Decide if you want per-subtopic (not just per-week) proficiency — the legacy CSV's
  `Stage` values (e.g. `W3_Capacitors` vs `W3_Inductors`) already support a finer split
  than the current per-week topic if you want it.
- Real auth, once you know whether you need per-student cohort data tied to NTU logins.
- Chatbot/AI hint integration and a leaderboard are the two biggest features from the
  original Impulse apps this prototype still doesn't touch at all.

## File structure

```
backend/
  server.js               — HTTP server + all API routes
  db.js                    — SQLite schema (users, topics, questions, attempts, topic_progress)
  adaptiveEngine.js        — EMA proficiency + difficulty-tier logic
  gamification.js          — XP, hearts (regen), daily streak logic
  scripts/
    csv.js                 — dependency-free CSV parser
    import_questions.js    — loads Questions_Set_1.csv into the DB
public/
  index.html, app.js, style.css  — vanilla JS frontend (login → topic picker → quiz → profile,
                                    plus the out-of-hearts screen)
data/
  ee2101.db               — seeded SQLite database (already imported; delete and re-run
                             the import script for a clean slate, or see the upgrade note
                             above to keep existing progress)
```
