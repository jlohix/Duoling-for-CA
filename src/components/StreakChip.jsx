import { visibleStreak } from "../state/progress";

export default function StreakChip({ progress }) {
  const days = visibleStreak(progress);
  return (
    <div
      className={`streak-chip ${days > 0 ? "hot" : ""}`}
      title="Days practiced in a row"
    >
      <span aria-hidden="true">🔥</span>
      {days} day{days === 1 ? "" : "s"}
    </div>
  );
}
