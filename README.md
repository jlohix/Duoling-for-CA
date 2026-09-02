# EE2101 Adaptive Quiz — Prototype

A from-scratch prototype for the "Duolingo for EE2101 Circuit Analysis" DIP project.
This is deliberately narrow in scope: it proves out the **core adaptive-difficulty quiz
loop**, end to end, seeded with real syllabus content — not a full clone of Impulse's
feature set (no chatbot, no leaderboard, no auth beyond a name).

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

Enter any name to "log in" (no password — see Known limitations). Pick a topic (week),
answer questions, and watch the difficulty badge / proficiency bar update after each
answer. The Profile tab shows per-topic proficiency across all 12 weeks.

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

`users` → `topic_progress` (one row per student × topic: current proficiency, current
difficulty, attempt count) → `attempts` (full history, one row per question answered) →
`questions` (topic, difficulty, options, correct answer) → `topics` (one per week, W1–W12).

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
- **`Image` references don't resolve to real files.** The CSV points at image filenames
  (`QuestionImages/...`) that aren't included here — 484/1320 rows are `BlankImage`
  (no image needed) but the other 836 need the actual image assets sourced or
  regenerated before they'll render. The current UI doesn't render images at all yet.
- **No real authentication.** Logging in is just typing a name — anyone can play as
  anyone. Fine for a prototype demo, not for real deployment (same gap the current
  Impulse 2.0 POC has on its admin routes, for what it's worth).
- **No password/session security, no rate limiting, no input sanitization beyond basic
  type checks.** Don't deploy this publicly as-is.
- **SQLite via `node:sqlite` is marked experimental** by Node.js. Fine for a prototype;
  worth re-evaluating (e.g. Postgres) before a real multi-user rollout.

## Natural next steps

- Backfill explanations + review difficulty tags on the seeded question bank.
- Add a "why" to each proficiency change in the UI (e.g. a small chart of proficiency
  over time) — this is where the "quantitative learning analysis" angle Prof Sunwoo
  mentioned could differentiate you from Impulse.
- Decide if you want per-subtopic (not just per-week) proficiency — the legacy CSV's
  `Stage` values (e.g. `W3_Capacitors` vs `W3_Inductors`) already support a finer split
  than the current per-week topic if you want it.
- Real auth, once you know whether you need per-student cohort data tied to NTU logins.

## File structure

```
backend/
  server.js              — HTTP server + all API routes
  db.js                   — SQLite schema (users, topics, questions, attempts, topic_progress)
  adaptiveEngine.js        — EMA proficiency + difficulty-tier logic
  scripts/
    csv.js                — dependency-free CSV parser
    import_questions.js    — loads Questions_Set_1.csv into the DB
public/
  index.html, app.js, style.css  — vanilla JS frontend (login → topic picker → quiz → profile)
data/
  ee2101.db               — seeded SQLite database (already imported; delete and re-run
                             the import script to reset)
```
