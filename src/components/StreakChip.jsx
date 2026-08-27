import { streakExpiresTonight, visibleStreak } from "../state/progress";

export default function StreakChip({ progress }) {
  const days = visibleStreak(progress);
  const atRisk = streakExpiresTonight(progress);
  return (
    <div
      className={`streak-chip ${days > 0 ? "hot" : ""} ${atRisk ? "at-risk" : ""}`}
      title={
        atRisk
          ? "Practice today or this streak resets at midnight"
          : "Days practiced in a row"
      }
    >
      <span aria-hidden="true">🔥</span>
      {days} day{days === 1 ? "" : "s"}
      {atRisk ? <span className="streak-chip-warn">today</span> : null}
    </div>
  );
}
