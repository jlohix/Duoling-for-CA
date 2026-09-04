import { DIFFICULTIES, lessonKey } from "../data/topics";
import { visibleStreak, topicInsight } from "../state/progress";
import TopicInsight from "../components/TopicInsight";
import HexStats from "../components/HexStats";

export default function ProgressPage({
  topics,
  progress,
  counts,
  eyebrow = "Your stats",
  title = "Progress",
}) {
  const streak = visibleStreak(progress);
  const completed = progress.completed || [];
  const totalLessons = topics.reduce((sum, topic) => {
    return (
      sum +
      DIFFICULTIES.filter((diff) => counts[lessonKey(topic.id, diff.id)]).length
    );
  }, 0);
  const insights = topics.map((topic) => ({
    topic,
    insight: topicInsight(progress, topic.id),
  }));
  const ranked = insights.filter((row) => row.insight.attempts >= 3);
  const strongest = ranked.reduce(
    (best, row) =>
      !best || row.insight.pct > best.insight.pct ? row : best,
    null
  );
  const weakest = ranked.reduce(
    (worst, row) =>
      !worst || row.insight.pct < worst.insight.pct ? row : worst,
    null
  );

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
      </header>
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
          <strong>
            {completed.length}/{totalLessons || 0}
          </strong>
          <span>lessons done</span>
        </li>
      </ul>
      {strongest || weakest ? (
        <p className="focus-line">
          {strongest ? (
            <>
              Strongest: <strong>{strongest.topic.name}</strong>
              {strongest.insight.pct != null
                ? ` (${strongest.insight.pct}%)`
                : ""}
            </>
          ) : null}
          {strongest && weakest && strongest.topic.id !== weakest.topic.id
            ? " · "
            : null}
          {weakest && strongest?.topic.id !== weakest.topic.id ? (
            <>
              Focus: <strong>{weakest.topic.name}</strong>
              {weakest.insight.pct != null ? ` (${weakest.insight.pct}%)` : ""}
            </>
          ) : null}
        </p>
      ) : (
        <p className="focus-line">
          First-try accuracy is measured as you answer. Replay a lesson to fill
          this in.
        </p>
      )}
      <section className="profile-card hex-stats-card">
        <h2>Topic hex</h2>
        <HexStats topics={topics} progress={progress} />
      </section>
      <ol className="progress-topics">
        {insights.map(({ topic, insight }) => (
          <li key={topic.id} className="progress-topic">
            <h2>{topic.name}</h2>
            <p>{topic.blurb}</p>
            <TopicInsight insight={insight} />
            {insight.attempts ? (
              <div className="insight-meter" aria-hidden="true">
                <div
                  className={`insight-fill ${insight.kind}`}
                  style={{ width: `${insight.pct}%` }}
                />
              </div>
            ) : null}
            <ul className="progress-diffs">
              {DIFFICULTIES.map((diff) => {
                const key = lessonKey(topic.id, diff.id);
                const n = counts[key] || 0;
                const done = completed.includes(key);
                return (
                  <li
                    key={key}
                    className={`progress-pill ${done ? "done" : ""} ${n ? "" : "empty"}`}
                  >
                    {diff.name}
                    {n ? (done ? " · done" : ` · ${n} Qs`) : " · none"}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
