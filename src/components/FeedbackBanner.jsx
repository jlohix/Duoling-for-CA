import MathText from "./MathText";
import QuizMascot from "./QuizMascot";

export default function FeedbackBanner({
  correct,
  explanation,
  willRepeat,
  failOut,
  onContinue,
}) {
  return (
    <div className={`feedback ${correct ? "ok" : "bad"}`}>
      <div>
        <QuizMascot mood={correct ? "happy" : "scary"} playKey={correct ? "ok" : "bad"} />
        <strong>{correct ? "Correct" : "Not quite"}</strong>
        {failOut ? (
          <p>
            That is two misses. This skip cannot unlock the topic. Next you can
            try again.
          </p>
        ) : willRepeat ? (
          <p>This question will come back at the end.</p>
        ) : null}
        {explanation ? (
          <p>
            <MathText text={explanation} />
          </p>
        ) : null}
      </div>
      <button type="button" className="primary" onClick={onContinue}>
        {failOut ? "See why" : "Continue"}
      </button>
    </div>
  );
}
