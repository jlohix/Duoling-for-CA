import { useCallback, useState } from "react";
import ThemeSwitch from "../components/ThemeSwitch";
import StreakCelebrate from "../components/StreakCelebrate";

export default function Results({ summary, onHome }) {
  const skip = summary.kind === "skip";
  const failedSkip = skip && !summary.passed;
  const title = skip
    ? failedSkip
      ? "Not enough to skip"
      : "Topic unlocked"
    : "Lesson complete";
  const showStreak = Boolean(summary.streakGrew);
  const finalStreak = summary.streak ?? 0;
  const [streakShown, setStreakShown] = useState(
    showStreak ? summary.streakFrom ?? 0 : finalStreak
  );
  const onTick = useCallback((value) => setStreakShown(value), []);

  return (
    <div className="page results">
      <header className="topbar">
        <h1>{title}</h1>
        <ThemeSwitch />
      </header>
      <p>
        {summary.topicName}
        {summary.difficultyName ? ` · ${summary.difficultyName}` : ""}
      </p>
      {skip ? (
        <p className="skip-result">
          {failedSkip
            ? `You need ${summary.needed}/${summary.total} first try. A second miss ends the skip. Try the lessons, then skip again.`
            : `You scored ${summary.correct}/${summary.total}. This topic is open.`}
        </p>
      ) : null}
      {showStreak ? (
        <StreakCelebrate
          from={summary.streakFrom}
          to={summary.streak}
          onTick={onTick}
        />
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
        <li className={showStreak ? "streak-stat" : ""}>
          <strong>{showStreak ? streakShown : finalStreak}</strong>
          <span>day streak</span>
        </li>
      </ul>
      <button type="button" className="primary" onClick={onHome}>
        Back to path
      </button>
    </div>
  );
}
