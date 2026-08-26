export default function Results({ summary, onHome }) {
  const skip = summary.kind === "skip";
  const failedSkip = skip && !summary.passed;
  const title = skip
    ? failedSkip
      ? "Not enough to skip"
      : "Topic unlocked"
    : "Lesson complete";

  return (
    <div className="page results">
      <h1>{title}</h1>
      <p>
        {summary.topicName}
        {summary.difficultyName ? ` · ${summary.difficultyName}` : ""}
      </p>
      {skip ? (
        <p className="skip-result">
          {failedSkip
            ? `You need ${summary.needed}/${summary.total} to skip. Try the lessons, then skip again.`
            : `You scored ${summary.correct}/${summary.total}. This topic is open.`}
        </p>
      ) : null}
      <ul className="stats">
        <li>
          <strong>{summary.correct}</strong>
          <span>correct</span>
        </li>
        <li>
          <strong>+{summary.xpGained}</strong>
          <span>XP</span>
        </li>
        <li>
          <strong>{summary.streak ?? 0}</strong>
          <span>day streak</span>
        </li>
      </ul>
      <button type="button" className="primary" onClick={onHome}>
        Back to path
      </button>
    </div>
  );
}
