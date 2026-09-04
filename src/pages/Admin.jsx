import { useEffect, useMemo, useState } from "react";
import { TOPICS, DIFFICULTIES, lessonKey } from "../data/topics";
import { topicInsight, saveProgress } from "../state/progress";
import {
  listStudents,
  saveStudentRecord,
  studentToProgress,
  addStudent,
} from "../state/roster";
import TopicInsight from "../components/TopicInsight";
import ProgressPage from "./Progress";
import { CLASS_IDS, DEFAULT_CLASS } from "../data/classes";
import { trophyFromIndex } from "../data/trophies";
import { syncLeagueSeason } from "../state/league";
import { summarizeWalkFeedback } from "../data/walkTitles";

function lessonTotal(counts) {
  return TOPICS.reduce(
    (sum, topic) =>
      sum +
      DIFFICULTIES.filter((diff) => counts[lessonKey(topic.id, diff.id)]).length,
    0
  );
}

function studentSummary(student, counts, leagues) {
  const preview = studentToProgress(student);
  const insights = TOPICS.map((topic) => ({
    topic,
    insight: topicInsight(preview, topic.id),
  }));
  const ranked = insights.filter((row) => row.insight.attempts >= 3);
  const weakest = ranked.reduce(
    (worst, row) =>
      !worst || row.insight.pct < worst.insight.pct ? row : worst,
    null
  );
  const strongest = ranked.reduce(
    (best, row) =>
      !best || row.insight.pct > best.insight.pct ? row : best,
    null
  );
  const done = (student.completed || []).filter(
    (key) => (counts[key] || 0) > 0
  ).length;
  return {
    league: trophyFromIndex(leagues?.[student.username] ?? 0).current,
    done,
    total: lessonTotal(counts),
    weakest,
    strongest,
    preview,
  };
}

export default function Admin({ progress, setProgress, counts }) {
  const [added, setAdded] = useState(0);
  const students = useMemo(
    () => listStudents(progress),
    [progress, added]
  );
  const leagues = useMemo(
    () => syncLeagueSeason(progress).state.leagueIndex,
    [progress, added]
  );
  const [selected, setSelected] = useState(students[0]?.username || "student1");
  const [newName, setNewName] = useState("");
  const [newClass, setNewClass] = useState(DEFAULT_CLASS);
  const [addError, setAddError] = useState("");
  const student =
    students.find((row) => row.username === selected) || students[0];

  function handleAdd(event) {
    event.preventDefault();
    const result = addStudent(newName, newClass);
    if (!result.ok) {
      setAddError(result.error);
      return;
    }
    setAddError("");
    setNewName("");
    setAdded((n) => n + 1);
    setSelected(result.student.username);
  }

  return (
    <div className="page admin-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Staff</p>
          <h1>Students</h1>
        </div>
      </header>
      <p className="login-hint">
        Class overview, then pick a student to view progress or adjust XP,
        streak, lessons, and first-try stats. student1 is the live learner on
        this device. Walkthrough thumbs from this device show under Walkthrough
        feedback. Use Add student to put a new name on the roster.
      </p>
      <form className="admin-add" onSubmit={handleAdd}>
        <label>
          New student name
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Jordan"
            maxLength={32}
          />
        </label>
        <label>
          Class
          <select
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
          >
            {CLASS_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="primary">
          Add student
        </button>
        {addError ? <p className="login-hint">{addError}</p> : null}
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>XP</th>
              <th>League</th>
              <th>Streak</th>
              <th>Lessons</th>
              <th>Focus</th>
            </tr>
          </thead>
          <tbody>
            {students.map((row) => {
              const sum = studentSummary(row, counts, leagues);
              return (
                <tr
                  key={row.username}
                  className={row.username === student?.username ? "on" : ""}
                >
                  <td>
                    <button
                      type="button"
                      className="admin-name-btn"
                      onClick={() => setSelected(row.username)}
                    >
                      {row.display}
                      {row.live ? " · live" : row.custom ? " · added" : ""}
                    </button>
                  </td>
                  <td>{row.classId}</td>
                  <td>{row.xp}</td>
                  <td>
                    <span
                      className="trophy-badge compact"
                      data-tier={sum.league.id}
                    >
                      <span className="trophy-gem" aria-hidden="true">
                        ◆
                      </span>
                      {sum.league.name}
                    </span>
                  </td>
                  <td>🔥 {row.streak}d</td>
                  <td>
                    {sum.done}/{sum.total}
                  </td>
                  <td>
                    {sum.weakest
                      ? `${sum.weakest.topic.name} (${sum.weakest.insight.pct}%)`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <WalkFeedbackTable students={students} />
      {student ? (
        <StudentEditor
          key={student.username}
          student={student}
          counts={counts}
          onSave={(edits) => {
            const nextLive = saveStudentRecord(
              student.username,
              edits,
              progress
            );
            if (student.live) saveProgress(nextLive);
            setProgress({ ...nextLive });
            setAdded((n) => n + 1);
          }}
        />
      ) : null}
    </div>
  );
}

function WalkFeedbackTable({ students }) {
  const rows = useMemo(() => summarizeWalkFeedback(students), [students]);
  const voted = rows.filter((row) => row.up + row.down > 0);
  const up = voted.reduce((sum, row) => sum + row.up, 0);
  const down = voted.reduce((sum, row) => sum + row.down, 0);
  return (
    <section className="admin-walk-feedback">
      <h2>Walkthrough feedback</h2>
      <p className="login-hint">
        Thumbs from this device's live learner (student1). Other roster names
        do not vote here.
      </p>
      <p className="login-hint">
        {up} thumbs up · {down} thumbs down
      </p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Walkthrough</th>
              <th>👍</th>
              <th>👎</th>
              <th>From</th>
            </tr>
          </thead>
          <tbody>
            {voted.length ? (
              voted.map((row) => (
                <tr key={row.key}>
                  <td>
                    {row.section ? `Section ${row.section} · ` : ""}
                    {row.title}
                  </td>
                  <td>{row.up}</td>
                  <td>{row.down}</td>
                  <td>
                    {row.voters
                      .map((who) => `${who.name} ${who.vote === "up" ? "👍" : "👎"}`)
                      .join(", ")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>
                  No thumbs yet. Finish a walkthrough on this device and tap
                  thumbs up or thumbs down.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StudentEditor({ student, counts, onSave }) {
  const [tab, setTab] = useState("progress");
  const [classId, setClassId] = useState(
    student.classId || DEFAULT_CLASS
  );
  const [xp, setXp] = useState(student.xp);
  const [streak, setStreak] = useState(student.streak);
  const [completed, setCompleted] = useState(() => [
    ...(student.completed || []),
  ]);
  const [stats, setStats] = useState(() => {
    const next = {};
    for (const topic of TOPICS) {
      const cur = student.topicStats?.[topic.id] ||
        student.topicStats?.[String(topic.id)] || {
          correct: 0,
          attempts: 0,
        };
      next[topic.id] = {
        correct: Number(cur.correct) || 0,
        attempts: Number(cur.attempts) || 0,
      };
    }
    return next;
  });
  const [saved, setSaved] = useState(false);

  const preview = useMemo(
    () =>
      studentToProgress({
        ...student,
        xp,
        streak,
        topicStats: stats,
        completed,
      }),
    [student, xp, streak, stats, completed]
  );

  useEffect(() => {
    setSaved(false);
  }, [xp, streak, stats, completed, classId]);

  function updateStat(topicId, field, value) {
    const n = Math.max(0, Number(value) || 0);
    setStats((prev) => {
      const row = { ...prev[topicId], [field]: n };
      if (field === "attempts") row.correct = Math.min(row.correct, n);
      if (field === "correct") row.attempts = Math.max(row.attempts, n);
      return { ...prev, [topicId]: row };
    });
  }

  function toggleLesson(key) {
    setCompleted((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  }

  function save() {
    onSave({ xp, streak, topicStats: stats, completed, classId });
    setSaved(true);
  }

  return (
    <div className="admin-detail">
      <div className="admin-detail-head">
        <div>
          <p className="eyebrow">{student.live ? "Live device" : "Demo"}</p>
          <h2>{student.display}</h2>
        </div>
        <div className="board-tabs" role="tablist" aria-label="Student tools">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "progress"}
            className={tab === "progress" ? "on" : ""}
            onClick={() => setTab("progress")}
          >
            Progress
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "adjust"}
            className={tab === "adjust" ? "on" : ""}
            onClick={() => setTab("adjust")}
          >
            Adjust
          </button>
        </div>
      </div>

      {tab === "progress" ? (
        <div className="admin-progress">
          <ProgressPage
            topics={TOPICS}
            progress={preview}
            counts={counts}
            eyebrow="Student progress"
            title={student.display}
          />
        </div>
      ) : (
        <form
          className="admin-edit"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <p className="login-hint">
            Edit numbers, then save. Lesson ticks mark completed difficulties.
          </p>
          <div className="admin-fields">
            <label>
              Class
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              >
                {CLASS_IDS.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </label>
            <label>
              XP
              <input
                type="number"
                min="0"
                value={xp}
                onChange={(e) => setXp(e.target.value)}
              />
            </label>
            <label>
              Streak (days)
              <input
                type="number"
                min="0"
                value={streak}
                onChange={(e) => setStreak(e.target.value)}
              />
            </label>
          </div>
          <h3>Lessons completed</h3>
          <ol className="admin-topics">
            {TOPICS.map((topic) => (
              <li key={topic.id} className="admin-topic">
                <strong>{topic.name}</strong>
                <div className="admin-lessons">
                  {DIFFICULTIES.map((diff) => {
                    const key = lessonKey(topic.id, diff.id);
                    const n = counts[key] || 0;
                    if (!n) {
                      return (
                        <span key={key} className="progress-pill empty">
                          {diff.name} · none
                        </span>
                      );
                    }
                    const on = completed.includes(key);
                    return (
                      <label key={key} className={`admin-lesson ${on ? "on" : ""}`}>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleLesson(key)}
                        />
                        {diff.name} · {n} Qs
                      </label>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>
          <h3>First-try accuracy</h3>
          <ol className="admin-topics">
            {TOPICS.map((topic) => {
              const insight = topicInsight(preview, topic.id);
              const row = stats[topic.id];
              return (
                <li key={topic.id} className="admin-topic">
                  <div className="profile-topic-head">
                    <strong>{topic.name}</strong>
                    <TopicInsight insight={insight} compact />
                  </div>
                  <div className="admin-fields">
                    <label>
                      First-try correct
                      <input
                        type="number"
                        min="0"
                        value={row.correct}
                        onChange={(e) =>
                          updateStat(topic.id, "correct", e.target.value)
                        }
                      />
                    </label>
                    <label>
                      First-try attempts
                      <input
                        type="number"
                        min="0"
                        value={row.attempts}
                        onChange={(e) =>
                          updateStat(topic.id, "attempts", e.target.value)
                        }
                      />
                    </label>
                  </div>
                </li>
              );
            })}
          </ol>
          <button type="submit" className="primary">
            Save changes
          </button>
          {saved ? <p className="login-hint">Saved.</p> : null}
        </form>
      )}
    </div>
  );
}
