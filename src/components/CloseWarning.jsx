export default function CloseWarning({ open, onStay, onLeave }) {
  if (!open) return null;
  return (
    <div className="overlay" onClick={onStay} role="presentation">
      <div
        className="event-sheet close-sheet"
        role="dialog"
        aria-labelledby="leave-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="leave-title">Leave this lesson?</h2>
        <p>Progress in this run will be lost. XP already earned stays.</p>
        <button type="button" className="quit-btn" onClick={onLeave}>
          Leave
        </button>
        <button type="button" className="ghost sheet-cancel" onClick={onStay}>
          Keep going
        </button>
      </div>
    </div>
  );
}
