import { useState } from "react";
import { recordWalkFeedback } from "../state/progress";

export default function WalkRating({ lessonKey, progress, setProgress }) {
  const saved = progress?.walkFeedback?.[lessonKey] || "";
  const [vote, setVote] = useState(saved);

  function pick(next) {
    setVote(next);
    if (!lessonKey || !setProgress) return;
    setProgress((p) => recordWalkFeedback(p, lessonKey, next));
  }

  return (
    <div className="walk-rating">
      <p className="walk-rating-prompt">Did this walkthrough help?</p>
      <div className="walk-rating-row">
        <button
          type="button"
          className={`walk-thumb up ${vote === "up" ? "picked" : ""}`}
          aria-pressed={vote === "up"}
          aria-label="Thumbs up"
          onClick={() => pick("up")}
        >
          <span aria-hidden="true">👍</span>
        </button>
        <button
          type="button"
          className={`walk-thumb down ${vote === "down" ? "picked" : ""}`}
          aria-pressed={vote === "down"}
          aria-label="Thumbs down"
          onClick={() => pick("down")}
        >
          <span aria-hidden="true">👎</span>
        </button>
      </div>
      {vote ? (
        <p className="walk-rating-thanks">
          Thanks — that helps us improve this lesson.
        </p>
      ) : null}
    </div>
  );
}
