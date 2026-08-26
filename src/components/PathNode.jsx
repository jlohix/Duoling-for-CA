export default function PathNode({ lesson, locked, complete, offset, onStart }) {
  const state = locked ? "locked" : complete ? "complete" : "ready";
  return (
    <div className={`path-node-wrap offset-${offset}`}>
      <button
        type="button"
        className={`path-node ${state}`}
        disabled={locked}
        onClick={onStart}
        aria-label={`${lesson.label} lesson${locked ? ", locked" : ""}`}
      >
        {locked ? "🔒" : complete ? "✓" : lesson.id}
      </button>
      <div className="path-node-meta">
        <strong>{lesson.label}</strong>
        <span>{lesson.count} questions</span>
      </div>
    </div>
  );
}
