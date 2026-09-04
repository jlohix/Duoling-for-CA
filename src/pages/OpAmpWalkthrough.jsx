import { useMemo, useRef, useState } from "react";
import { ColourCodeKey, ResistorBody } from "../data/resistorBands";
import MathText from "../components/MathText";
import ThemeSwitch from "../components/ThemeSwitch";
import LabTeach from "../components/LabTeach";
import WalkRating from "../components/WalkRating";
import {
  XP_CORRECT,
  finishGuidedLesson,
  payGuidedCheck,
} from "../state/progress";

const MODE_KEY = "circuito-lab-mode-v1";

function shuffle(list) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function loadMode() {
  try {
    return localStorage.getItem(MODE_KEY) === "hard" ? "hard" : "easy";
  } catch {
    return "easy";
  }
}

function ResistorChip({ ohms, hard, onPointerDown, onPick, disabled }) {
  return (
    <button
      type="button"
      className="resistor-chip"
      disabled={disabled}
      aria-label={hard ? "Resistor with colour bands" : `${ohms} kilohm resistor`}
      onClick={() => onPick(ohms)}
      onPointerDown={(event) => onPointerDown(event, ohms)}
    >
      <ResistorBody ohms={ohms} unit="kΩ" showValue={!hard} />
    </button>
  );
}

function PracticeView({
  title,
  practice,
  Schematic,
  caption,
  onExit,
  onDone,
  onCheck,
  xpHint,
}) {
  const queue = useMemo(() => shuffle(practice), [practice]);
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [ok, setOk] = useState(false);
  const [score, setScore] = useState(0);
  const [drag, setDrag] = useState(null);
  const [mode, setMode] = useState(loadMode);
  const slotRef = useRef(null);
  const dragRef = useRef(null);
  const attemptedRef = useRef(new Set());
  const hard = mode === "hard";
  const question = queue[index];
  const choices = useMemo(
    () => (question ? shuffle(question.choices) : []),
    [question?.id]
  );

  function setLabMode(next) {
    setMode(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      /* ignore */
    }
  }

  function resetPlace() {
    setPlaced(null);
    setRevealed(false);
    setOk(false);
  }

  function overSlot(clientX, clientY) {
    const box = slotRef.current?.getBoundingClientRect();
    if (!box) return false;
    return (
      clientX >= box.left &&
      clientX <= box.right &&
      clientY >= box.top &&
      clientY <= box.bottom
    );
  }

  function startDrag(event, ohms) {
    if (revealed) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const next = {
      ohms,
      x: event.clientX,
      y: event.clientY,
      over: overSlot(event.clientX, event.clientY),
    };
    dragRef.current = next;
    setDrag(next);
  }

  function moveDrag(event) {
    if (!dragRef.current) return;
    const next = {
      ...dragRef.current,
      x: event.clientX,
      y: event.clientY,
      over: overSlot(event.clientX, event.clientY),
    };
    dragRef.current = next;
    setDrag(next);
  }

  function endDrag(event) {
    const cur = dragRef.current;
    if (!cur) return;
    if (overSlot(event.clientX, event.clientY)) setPlaced(cur.ohms);
    dragRef.current = null;
    setDrag(null);
  }

  function check() {
    if (placed == null || revealed) return;
    const pass = placed === question.correctOhm;
    const checkId = question.id || `q-${index}`;
    const firstTry = !attemptedRef.current.has(checkId);
    attemptedRef.current.add(checkId);
    setOk(pass);
    setRevealed(true);
    if (pass) setScore((n) => n + 1);
    onCheck?.({ ok: pass, firstTry, id: `practice-${checkId}` });
  }

  function next() {
    setIndex((n) => n + 1);
    resetPlace();
  }

  function finish() {
    onDone(score, queue.length);
  }

  return (
    <div
      className="page drag-lab opamp-lab"
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <header className="lesson-bar">
        <button type="button" className="ghost" onClick={onExit}>
          Close
        </button>
        <p className="lesson-meta">
          {title} · Drop Rf · {index + 1}/{queue.length}
          {xpHint ? ` · ${xpHint}` : ""}
        </p>
        <ThemeSwitch compact />
      </header>
      <div className="board-tabs" role="tablist" aria-label="Lab difficulty">
        <button
          type="button"
          role="tab"
          aria-selected={!hard}
          className={hard ? "" : "on"}
          onClick={() => setLabMode("easy")}
        >
          Easy
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={hard}
          className={hard ? "on" : ""}
          onClick={() => setLabMode("hard")}
        >
          Hard
        </button>
      </div>
      <p className="focus-line">
        <MathText text={question.prompt} />
        {hard
          ? " Hard mode: read the colour bands (no kΩ labels)."
          : " Easy mode: kΩ value and colour bands."}
      </p>
      <div className="circuit-board">
        <Schematic
          highlight="rf"
          question={question}
          placed={placed}
          drag={drag}
          revealed={revealed}
          ok={ok}
          practice
          slotRef={slotRef}
        />
        <p className="circuit-current">{caption}</p>
      </div>
      <p className="login-hint">Hold a resistor and drop it on Rf, or tap it.</p>
      <div className="resistor-tray">
        {choices.map((ohms) => (
          <ResistorChip
            key={ohms}
            ohms={ohms}
            hard={hard}
            disabled={revealed}
            onPick={(value) => {
              if (!revealed) setPlaced(value);
            }}
            onPointerDown={startDrag}
          />
        ))}
      </div>
      {!revealed ? (
        <button
          type="button"
          className="primary check"
          disabled={placed == null}
          onClick={check}
        >
          Check
        </button>
      ) : (
        <div className="feedback-row">
          <p className={ok ? "ok-text" : "bad-text"}>
            {ok ? "Correct. " : "Not that value. "}
            <MathText text={question.why} />
          </p>
          <button
            type="button"
            className="primary"
            onClick={index + 1 >= queue.length ? finish : next}
          >
            {index + 1 >= queue.length ? "See score" : "Next"}
          </button>
        </div>
      )}
      <ColourCodeKey />
      {drag ? (
        <div className="resistor-ghost" style={{ left: drag.x, top: drag.y }}>
          <ResistorBody ohms={drag.ohms} unit="kΩ" showValue={!hard} ghost />
        </div>
      ) : null}
    </div>
  );
}

export default function OpAmpWalkthrough({
  title,
  formula,
  doneBlurb,
  caption,
  steps,
  practice,
  Schematic,
  onExit,
  onFinished,
  progress,
  setProgress,
  preview = false,
  walkKey,
  topicId = 3,
}) {
  const [stage, setStage] = useState("teach");
  const [score, setScore] = useState(null);
  const paidRef = useRef(new Set());
  const xpRef = useRef(0);
  const alreadyDone = Boolean(progress?.completed?.includes(walkKey));
  const xpEach = preview || alreadyDone ? 0 : XP_CORRECT;
  const xpHint = preview
    ? "staff preview · no XP"
    : xpEach
      ? `+${xpEach} XP`
      : "practice";

  function payCheck(outcome) {
    payGuidedCheck(setProgress, {
      preview,
      xpEach,
      topicId,
      paidRef,
      xpRef,
      ...outcome,
    });
  }

  function completeRun(ok, total) {
    if (onFinished) {
      finishGuidedLesson({
        preview,
        progress,
        setProgress,
        key: walkKey,
        xpFromChecks: xpRef.current,
        correct: ok,
        total,
        topicName: title,
        difficultyName: "Walkthrough",
        kind: "walk",
        onFinished,
      });
      return;
    }
    setScore({ ok, total });
    setStage("done");
  }

  if (stage === "done") {
    return (
      <div className="page results">
        <header className="topbar">
          <h1>Walkthrough completed</h1>
          <ThemeSwitch />
        </header>
        <p className="focus-eq">
          <MathText text={formula} />
        </p>
        <p>
          You placed {score.ok}/{score.total} feedback resistors correctly.{" "}
          {doneBlurb}
        </p>
        <WalkRating
          lessonKey={walkKey}
          progress={progress}
          setProgress={setProgress}
        />
        <button type="button" className="primary" onClick={onExit}>
          Back to Learn
        </button>
      </div>
    );
  }

  if (stage === "practice") {
    return (
      <PracticeView
        title={title}
        practice={practice}
        Schematic={Schematic}
        caption={caption}
        xpHint={xpHint}
        onExit={onExit}
        onCheck={payCheck}
        onDone={completeRun}
      />
    );
  }

  return (
    <LabTeach
      title={title}
      steps={steps}
      Schematic={Schematic}
      practiceLabel="Try Rf"
      skipLabel="Skip walkthrough"
      onExit={onExit}
      onPractice={() => setStage("practice")}
      onCheck={payCheck}
    />
  );
}
