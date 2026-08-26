export default function ReviewGate({ count, onContinue }) {
  return (
    <div className="review-gate">
      <p className="eyebrow">Review round</p>
      <h2>Missed questions</h2>
      <p>
        You missed {count} question{count === 1 ? "" : "s"} the first time
        through. They’ll come up now so you can try again.
      </p>
      <button type="button" className="primary" onClick={onContinue}>
        Start review
      </button>
    </div>
  );
}
