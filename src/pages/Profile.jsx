import { visibleStreak, topicInsight } from "../state/progress";
import { DEFAULT_CLASS, normalizeClassId } from "../data/classes";
import TopicInsight from "../components/TopicInsight";
import StreakNotice from "../components/StreakNotice";

const STRENGTH_KINDS = new Set(["strength", "solid"]);
const WEAK_KINDS = new Set(["weakness", "developing"]);

export default function Profile({ user, topics, progress, setProgress, onPractice }) {
  const streak = visibleStreak(progress);
  const rows = topics.map((topic) => ({
    topic,
    insight: topicInsight(progress, topic.id),
  }));
  const measured = rows.filter((row) => row.insight.attempts > 0);
  const strengths = rows
    .filter((row) => STRENGTH_KINDS.has(row.insight.kind))
    .sort((a, b) => b.insight.pct - a.insight.pct);
  const weaknesses = rows
    .filter((row) => WEAK_KINDS.has(row.insight.kind))
    .sort((a, b) => a.insight.pct - b.insight.pct);
  const starting = rows.filter((row) => row.insight.kind === "starting");
  const empty = rows.filter((row) => row.insight.kind === "empty");

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Student</p>
          <h1>{user.username}</h1>
        </div>
      </header>
      <p className="class-picker">
        Your class
        <strong>{normalizeClassId(progress.classId || DEFAULT_CLASS)}</strong>
        <span className="login-hint">
          Only a teacher can change this.
        </span>
      </p>
      <ul className="stats">
        <li>
          <strong>{progress.xp}</strong>
          <span>XP</span>
        </li>
        <li>
          <strong>{streak}</strong>
          <span>day streak</span>
        </li>
        <li>
          <strong>{measured.length}/{topics.length}</strong>
          <span>topics measured</span>
        </li>
      </ul>
      <StreakNotice
        variant="profile"
        progress={progress}
        onPractice={onPractice}
      />
      <p className="focus-line">
        Strengths and weaknesses use first-try accuracy. A topic needs at least
        3 answers before it is labeled.
      </p>

      <div className="profile-split">
        <section className="profile-card strengths-card">
          <h2>Strengths</h2>
          {strengths.length ? (
            <TopicList rows={strengths} />
          ) : (
            <p className="login-hint">
              No strengths yet. Hit 80% first try on a topic (60%+ counts as
              solid).
            </p>
          )}
        </section>
        <section className="profile-card weaknesses-card">
          <h2>Weaknesses</h2>
          {weaknesses.length ? (
            <TopicList rows={weaknesses} />
          ) : (
            <p className="login-hint">
              No weaknesses tagged yet. Topics under 60% first try will show
              here.
            </p>
          )}
        </section>
      </div>

      {starting.length ? (
        <section className="profile-block">
          <h2>Getting started</h2>
          <TopicList rows={starting} />
        </section>
      ) : null}

      {empty.length ? (
        <section className="profile-block">
          <h2>Not measured yet</h2>
          <TopicList rows={empty} />
        </section>
      ) : null}
    </div>
  );
}

function TopicList({ rows }) {
  return (
    <ol className="profile-topics">
      {rows.map(({ topic, insight }) => (
        <li key={topic.id} className="profile-topic">
          <div className="profile-topic-head">
            <strong>{topic.name}</strong>
            <span className="login-hint">{topic.blurb}</span>
          </div>
          <TopicInsight insight={insight} />
          {insight.attempts ? (
            <div className="insight-meter" aria-hidden="true">
              <div
                className={`insight-fill ${insight.kind}`}
                style={{ width: `${insight.pct}%` }}
              />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
