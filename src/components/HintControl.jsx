import { useEffect, useState } from "react";
import { hintForQuestion } from "../data/hints";
import MathText from "./MathText";

export default function HintControl({ question }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [question.id]);

  const hint = hintForQuestion(question);

  if (open) {
    return (
      <div className="hint-box">
        <strong>Hint</strong>
        <p>
          <MathText text={hint} />
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="ghost hint-btn"
      onClick={() => setOpen(true)}
    >
      Hint
    </button>
  );
}
