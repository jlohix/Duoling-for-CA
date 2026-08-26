import MathText from "./MathText";

export default function FeedbackBanner({
  correct,
  explanation,
  willRepeat,
  onContinue,
}) {
  return (
    <div className={`feedback ${correct ? "ok" : "bad"}`}>
      <div>
        <strong>{correct ? "Correct" : "Not quite"}</strong>
        {willRepeat ? <p>This question will come back at the end.</p> : null}
        {explanation ? (
          <p>
            <MathText text={explanation} />
          </p>
        ) : null}
      </div>
      <button type="button" className="primary" onClick={onContinue}>
        Continue
      </button>
    </div>
  );
}
