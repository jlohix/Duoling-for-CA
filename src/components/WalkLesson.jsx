import { useMemo, useState } from "react";
import MathText from "./MathText";
import ThemeSwitch from "./ThemeSwitch";
import LabTeach from "./LabTeach";
import ValueDragLab from "./ValueDragLab";
import { InlineKnowledgeCheck } from "./QuickCheck";

function resolvePracticeView(question, lab, practiceView) {
  if (!question || question.hideBoard) return null;
  if (question.view) return question.view;
  if (practiceView) return practiceView;
  const step = [...(lab?.steps || [])]
    .reverse()
    .find((item) => item.view && item.view !== "map" && !item.hideBoard);
  return step?.view || null;
}

function PracticeView({ title, progressLabel, practice, Schematic, boardHint, practiceView, lab, lastLabel = "See score", onExit, onDone }) {
  const queue = useMemo(() => practice, [practice]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [ok, setOk] = useState(false);
  const [score, setScore] = useState(0);
  const question = queue[index];
  const last = index + 1 >= queue.length;
  const boardView = resolvePracticeView(question, lab, practiceView);
  const boardHighlight = question?.highlight || "all";
  const hint =
    question?.boardHint !== undefined ? question.boardHint : boardHint;

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
      {boardView ? (
        <div className="circuit-board">
          <Schematic highlight={boardHighlight} view={boardView} />
          {hint ? <p className="circuit-dot-key">{hint}</p> : null}
        </div>
      ) : null}
      <section className="teach-card">
        <InlineKnowledgeCheck
          badge="Try a few"
          check={question}
          lockKey={question.id}
          selected={selected}
          revealed={revealed}
          ok={ok}
          onSelect={setSelected}
          onCheck={check}
          progressLabel={`${index + 1} of ${queue.length}`}
          afterReveal={
            <button type="button" className="primary qc-next" onClick={next}>
              {last ? lastLabel : "Next"}
            </button>
          }
        />
      </section>
    </div>
  );
}

export default function WalkLesson({ labId, catalog, Schematic, onExit, onContinue }) {
  const lab = catalog.getLab(labId);
  const next = catalog.getNext(labId);
  const part = Math.max(1, catalog.labs.findIndex((item) => item.id === lab.id) + 1);
  const progressLabel = `${catalog.label} ${part} of ${catalog.labs.length}`;
  const hasPractice = Boolean(lab.practice?.length);
  const hasDrag = Boolean(lab.drag?.length && lab.DragBoard);
  const [stage, setStage] = useState("teach");
  const [score, setScore] = useState(null);

  function afterPractice(ok, total) {
    setScore({ ok, total });
    setStage(hasDrag ? "drag" : "done");
  }

  if (stage === "done" && score) {
    const checks =
      score.total != null
        ? `You got ${score.ok}/${score.total} on the quick checks`
        : "";
    const drags =
      score.dragTotal != null
        ? `${checks ? " and " : "You got "}${score.dragOk}/${score.dragTotal} on the drag board`
        : "";
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
          {checks}
          {drags}
          {checks || drags ? ". " : ""}
          {lab.doneBlurb} No XP for this try-it lesson.
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

  if (stage === "drag" && hasDrag) {
    return (
      <ValueDragLab
        title={lab.title}
        progressLabel={progressLabel}
        questions={lab.drag}
        Board={lab.DragBoard}
        promptFor={lab.dragPrompt}
        labelFor={lab.dragLabel}
        hint={lab.dragHint}
        onExit={onExit}
        onDone={(ok, total) => {
          setScore((prev) => ({
            ...(prev || {}),
            dragOk: ok,
            dragTotal: total,
          }));
          setStage("done");
        }}
      />
    );
  }

  if (stage === "practice" && hasPractice) {
    return (
      <PracticeView
        title={lab.title}
        progressLabel={progressLabel}
        practice={lab.practice}
        Schematic={Schematic}
        boardHint={lab.boardHint}
        practiceView={lab.practiceView}
        lab={lab}
        lastLabel={hasDrag ? "Drag values" : "See score"}
        onExit={onExit}
        onDone={afterPractice}
      />
    );
  }

  return (
    <LabTeach
      title={lab.title}
      progressLabel={progressLabel}
      steps={lab.steps}
      Schematic={Schematic}
      boardHint={lab.boardHint}
      practiceLabel={hasPractice ? "Try a few" : hasDrag ? "Drag values" : "Finish"}
      skipLabel={
        hasPractice
          ? "Try a few on this topic"
          : hasDrag
            ? "Skip to drag lab"
            : "Skip walkthrough"
      }
      onExit={onExit}
      onPractice={() => setStage(hasPractice ? "practice" : hasDrag ? "drag" : "done")}
    />
  );
}

export function makeCatalog(label, labs) {
  return {
    label,
    labs,
    getLab(id) {
      return labs.find((lab) => lab.id === id) || labs[0];
    },
    getNext(id) {
      const index = labs.findIndex((lab) => lab.id === id);
      if (index < 0 || index >= labs.length - 1) return null;
      return labs[index + 1];
    },
  };
}
