import { useMemo, useState } from "react";
import MathText from "../components/MathText";
import ThemeSwitch from "../components/ThemeSwitch";
import LabTeach from "../components/LabTeach";
import { LAPLACE_LABS, getLaplaceLab, getNextLaplaceLab, LaplaceSchematic } from "./index";

const LABELS = ["A", "B", "C"];

function PracticeView({ title, progressLabel, practice, Schematic, boardHint, onExit, onDone }) {
  const queue = useMemo(() => practice, [practice]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [ok, setOk] = useState(false);
  const [score, setScore] = useState(0);
  const question = queue[index];
  const last = index + 1 >= queue.length;

  function reset() {
    setSelected("");
    setRevealed(false);
    setOk(false);
  }

  function check() {
    if (!question || !selected || revealed) return;
    const pass = selected === question.answer;
    setOk(pass);
    setRevealed(true);
  }

  function next() {
    if (!revealed) return;
    const nextScore = score + (ok ? 1 : 0);
    if (last) {
      onDone(nextScore, queue.length);
      return;
    }
    setScore(nextScore);
    setIndex((n) => n + 1);
    reset();
  }

  return (
    <div className="page drag-lab opamp-lab">
      <header className="lesson-bar">
        <button type="button" className="ghost" onClick={onExit}>
          Close
        </button>
        <p className="lesson-meta">
          {progressLabel ? `${progressLabel} · ` : ""}
          {title}, try {index + 1} of {queue.length}
        </p>
        <ThemeSwitch compact />
      </header>
      <div className="circuit-board">
        <Schematic highlight="all" view="map" />
        {boardHint ? <p className="circuit-dot-key">{boardHint}</p> : null}
      </div>
      <section className="teach-card">
        <p className="eyebrow">
          Try {index + 1} of {queue.length}
        </p>
        <h2>Quick check</h2>
        <p>
          <MathText text={question.prompt} />
        </p>
        <div className="opamp-check">
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
          ) : (
            <div className="feedback-row">
              <p className={ok ? "ok-text" : "bad-text"}>
                <MathText text={question.why} />
              </p>
              <button type="button" className="primary" onClick={next}>
                {last ? "See score" : "Next"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function LaplaceLesson({ labId, onExit, onContinue }) {
  const lab = getLaplaceLab(labId);
  const next = getNextLaplaceLab(labId);
  const part = Math.max(1, LAPLACE_LABS.findIndex((item) => item.id === lab.id) + 1);
  const progressLabel = `Laplace ${part} of ${LAPLACE_LABS.length}`;
  const [stage, setStage] = useState("teach");
  const [score, setScore] = useState(null);

  if (stage === "done" && score) {
    return (
      <div className="page results">
        <header className="topbar">
          <h1>{lab.title}</h1>
          <ThemeSwitch />
        </header>
        <p className="eyebrow">{progressLabel}</p>
        <p className="focus-eq">
          <MathText text={lab.formula} />
        </p>
        <p>
          You got {score.ok}/{score.total} on the quick checks. {lab.doneBlurb} No
          XP for this try-it lesson.
        </p>
        <div className="opamp-nav">
          {next ? (
            <button type="button" className="ghost" onClick={onExit}>
              Back to Learn
            </button>
          ) : null}
          {next ? (
            <button
              type="button"
              className="primary"
              onClick={() => onContinue(next.id)}
            >
              Next: {next.title}
            </button>
          ) : (
            <button type="button" className="primary" onClick={onExit}>
              Back to Learn
            </button>
          )}
        </div>
      </div>
    );
  }

  if (stage === "practice") {
    return (
      <PracticeView
        title={lab.title}
        progressLabel={progressLabel}
        practice={lab.practice}
        Schematic={LaplaceSchematic}
        boardHint={lab.boardHint}
        onExit={onExit}
        onDone={(ok, total) => {
          setScore({ ok, total });
          setStage("done");
        }}
      />
    );
  }

  return (
    <LabTeach
      title={lab.title}
      progressLabel={progressLabel}
      steps={lab.steps}
      Schematic={LaplaceSchematic}
      boardHint={lab.boardHint}
      practiceLabel="Try a few"
      skipLabel={next ? "Try a few on this topic" : "Skip walkthrough"}
      chainLabel={next ? `Next: ${next.title}` : null}
      onExit={onExit}
      onPractice={() => setStage("practice")}
      onChain={next ? () => onContinue(next.id) : undefined}
    />
  );
}
