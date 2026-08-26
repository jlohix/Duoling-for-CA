import MathText from "./MathText";

const LABELS = ["A", "B", "C", "D"];

export default function QuestionCard({
  question,
  selected,
  revealed,
  onSelect,
}) {
  return (
    <article className="question-card">
      <h2>
        <MathText text={question.question} />
      </h2>
      {question.image ? (
        <img
          className="circuit-image"
          src={question.image}
          alt="Circuit for this question"
        />
      ) : null}
      <div className="options">
        {LABELS.map((label) => {
          const key = label.toLowerCase();
          const text = question.options[key];
          if (!text) return null;
          const isSelected = selected === key;
          const isCorrect = question.answer === key;
          let extra = "";
          if (revealed && isCorrect) extra = "correct";
          if (revealed && isSelected && !isCorrect) extra = "wrong";
          if (!revealed && isSelected) extra = "picked";
          return (
            <button
              key={key}
              type="button"
              className={`option ${extra}`}
              disabled={revealed}
              onClick={() => onSelect(key)}
            >
              <span className="option-letter">{label}</span>
              <MathText text={text} />
            </button>
          );
        })}
      </div>
    </article>
  );
}
