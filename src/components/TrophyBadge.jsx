import { trophyFromIndex } from "../data/trophies";

export default function TrophyBadge({ index, compact = false }) {
  const current = trophyFromIndex(index).current;
  return (
    <span
      className={`trophy-badge ${compact ? "compact" : ""}`}
      data-tier={current.id}
      title={`${current.name} league`}
    >
      <span className="trophy-gem" aria-hidden="true">
        ◆
      </span>
      {compact ? current.name : `${current.name} league`}
    </span>
  );
}
