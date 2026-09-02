import { useState } from "react";
import MathText from "./MathText";
import ThemeSwitch from "./ThemeSwitch";

const LABELS = ["A", "B", "C"];

function asItems(value) {
  if (value == null || value === "") return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function TeachCopy({ step }) {
  const paras = asItems(step.body);
  const points = asItems(step.points);
  const eqs = asItems(step.eq);
  return (
    <div className="teach-copy">
      {paras.map((para, i) => (
        <p key={`p${i}`}>
          <MathText text={para} />
        </p>
      ))}
      {points.length ? (
        <ol className="teach-points">
          {points.map((point, i) => (
            <li key={`n${i}`}>
              <MathText text={point} />
            </li>
          ))}
        </ol>
      ) : null}
      {eqs.length ? (
        <div className="focus-eqs">
          {eqs.map((eq, i) => (
            <p key={`e${i}`} className="focus-eq">
              <MathText text={eq} />
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function LabTeach({
  title,
  steps,
  Schematic,
  practiceLabel = "Try it",
  skipLabel,
  chainLabel,
  progressLabel,
  boardHint = "Filled dots are joins — wires connected.",
  onExit,
  onPractice,
  onChain,
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [ok, setOk] = useState(false);
  const step = steps[index];
  const last = index >= steps.length - 1;
  const needsCheck = Boolean(step.check);
  const canAdvance = !needsCheck || (revealed && ok);

  function resetCheck() {
    setSelected("");
    setRevealed(false);
    setOk(false);
  }

  function check() {
    if (!step.check || !selected || revealed) return;
    const pass = selected === step.check.answer;
    setOk(pass);
    setRevealed(true);
  }

  function next() {
    if (!canAdvance) return;
    if (last) {
      if (onChain) {
        onChain();
        return;
      }
      onPractice();
      return;
    }
    setIndex((n) => n + 1);
    resetCheck();
  }

  const lastLabel = chainLabel || practiceLabel;

  function back() {
    if (index === 0) return;
    setIndex((n) => n - 1);
    resetCheck();
  }

  return (
    <div className="page drag-lab opamp-lab">
      <header className="lesson-bar">
        <button type="button" className="ghost" onClick={onExit}>
          Close
        </button>
        <p className="lesson-meta">
          {progressLabel ? `${progressLabel} · ` : ""}
          {title}, step {index + 1} of {steps.length}
        </p>
        <ThemeSwitch compact />
      </header>
      {skipLabel ? (
        <button type="button" className="ghost back-link" onClick={onPractice}>
          {skipLabel}
        </button>
      ) : null}
      <div className="circuit-board">
        <Schematic highlight={step.highlight} view={step.view} />
        {step.boardHint || boardHint ? (
          <p className="circuit-dot-key">{step.boardHint || boardHint}</p>
        ) : null}
      </div>
      <section className="teach-card">
        <p className="eyebrow">
          Step {index + 1} of {steps.length}
        </p>
        <h2>
          <MathText text={step.title} />
        </h2>
        <TeachCopy step={step} />
        {step.check ? (
          <div className="opamp-check">
            <p>
              <MathText text={step.check.prompt} />
            </p>
            <div className="options">
              {LABELS.map((label) => {
                const key = label.toLowerCase();
                const text = step.check.options[key];
                if (!text) return null;
                const isSelected = selected === key;
                const isCorrect = step.check.answer === key;
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
                    onClick={() => setSelected(key)}
                  >
                    <span className="option-letter">{label}</span>
                    <MathText text={text} />
                  </button>
                );
              })}
            </div>
            {!revealed ? (
              <button
                type="button"
                className="primary check"
                disabled={!selected}
                onClick={check}
              >
                Check
              </button>
            ) : ok ? (
              <p className="ok-text">
                <MathText text={step.check.why} />
              </p>
            ) : (
              <div className="feedback-row">
                <p className="bad-text">
                  <MathText text={step.check.why} />
                </p>
                <button type="button" className="ghost" onClick={resetCheck}>
                  Try again
                </button>
              </div>
            )}
          </div>
        ) : null}
        <div className="opamp-nav">
          <button
            type="button"
            className="ghost"
            disabled={index === 0}
            onClick={back}
          >
            Back
          </button>
          <button
            type="button"
            className="primary"
            disabled={!canAdvance}
            onClick={next}
          >
            {last ? lastLabel : "Next"}
          </button>
        </div>
      </section>
    </div>
  );
}
