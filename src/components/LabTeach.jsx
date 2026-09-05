import { useRef, useState } from "react";
import MathText from "./MathText";
import ThemeSwitch from "./ThemeSwitch";
import { InlineKnowledgeCheck } from "./QuickCheck";

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
  onCheck,
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [ok, setOk] = useState(false);
  const attemptedRef = useRef(new Set());
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
    const checkId = step.id || `step-${index}`;
    const firstTry = !attemptedRef.current.has(checkId);
    attemptedRef.current.add(checkId);
    setOk(pass);
    setRevealed(true);
    onCheck?.({ ok: pass, firstTry, id: checkId });
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

  const checkTotal = steps.filter((item) => item.check).length;
  const checkNumber = steps.slice(0, index + 1).filter((item) => item.check).length;
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
      {step.view && step.view !== "map" && !step.hideBoard ? (
        <div className="circuit-board">
          <Schematic highlight={step.highlight} view={step.view} />
          {(step.boardHint !== undefined ? step.boardHint : boardHint) ? (
            <p className="circuit-dot-key">
              {step.boardHint !== undefined ? step.boardHint : boardHint}
            </p>
          ) : null}
        </div>
      ) : null}
      <section className="teach-card">
        <p className="eyebrow">
          Step {index + 1} of {steps.length}
        </p>
        <h2>
          <MathText text={step.title} />
        </h2>
        <TeachCopy step={step} />
        {step.check ? (
          <InlineKnowledgeCheck
            check={step.check}
            lockKey={step.id}
            selected={selected}
            revealed={revealed}
            ok={ok}
            onSelect={setSelected}
            onCheck={check}
            onRetry={resetCheck}
            progressLabel={checkTotal > 1 ? `${checkNumber} of ${checkTotal}` : undefined}
          />
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
