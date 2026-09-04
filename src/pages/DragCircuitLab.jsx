import { useMemo, useRef, useState } from "react";
import { DRAG_CIRCUIT_QUESTIONS, labKindLabel, labPrompt } from "../data/dragCircuits";
import { ColourCodeKey, ResistorBody } from "../data/resistorBands";
import OhmLabSchematic from "../components/OhmLabSchematic";
import PowerSchematic from "../components/PowerSchematic";
import MaxPowerSchematic from "../components/MaxPowerSchematic";
import DependentSchematic from "../components/DependentSchematic";
import LabTeach from "../components/LabTeach";
import MathText from "../components/MathText";
import ThemeSwitch from "../components/ThemeSwitch";
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

function orderLabQuestions(list) {
  const easy = shuffle(list.filter((q) => q.level !== "hard"));
  const hardQs = shuffle(list.filter((q) => q.level === "hard"));
  if (!hardQs.length) return shuffle(list);
  return [...easy, ...hardQs];
}

function formatAmps(amps) {
  return Number.isInteger(amps) ? `${amps}` : String(amps);
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
      aria-label={hard ? "Resistor with colour bands" : `${ohms} ohm resistor`}
      onClick={() => onPick(ohms)}
      onPointerDown={(event) => onPointerDown(event, ohms)}
    >
      <ResistorBody ohms={ohms} showValue={!hard} />
    </button>
  );
}

export default function DragCircuitLab({
  onExit,
  onFinished,
  questions = DRAG_CIRCUIT_QUESTIONS,
  walkthrough = null,
  progress,
  setProgress,
  preview = false,
  walkKey = "walk-lab-ohm",
  topicId = 1,
}) {
  const [stage, setStage] = useState(walkthrough ? "teach" : "lab");
  const queue = useMemo(() => orderLabQuestions(questions), [questions]);
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [ok, setOk] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [drag, setDrag] = useState(null);
  const [mode, setMode] = useState(loadMode);
  const slotRef = useRef(null);
  const dragRef = useRef(null);
  const attemptedRef = useRef(new Set());
  const paidRef = useRef(new Set());
  const xpRef = useRef(0);
  const alreadyDone = Boolean(progress?.completed?.includes(walkKey));
  const xpEach = preview || alreadyDone ? 0 : XP_CORRECT;
  const hard = mode === "hard";
  const firstHard = queue.findIndex((q) => q.level === "hard");
  const hasHardQs = firstHard >= 0;

  const question = queue[index];
  const meshCurrents = question?.quiz === "currents";
  const powerQuiz = question?.quiz === "mcq";
  const pickQuiz = meshCurrents || powerQuiz;
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
    const pass = meshCurrents
      ? placed === `${question.i1},${question.i2}`
      : powerQuiz
        ? placed === question.answer
        : placed === question.correctOhm;
    const checkId = question.id || `q-${index}`;
    const firstTry = !attemptedRef.current.has(checkId);
    attemptedRef.current.add(checkId);
    setOk(pass);
    setRevealed(true);
    if (pass) setScore((n) => n + 1);
    payGuidedCheck(setProgress, {
      preview,
      xpEach,
      ok: pass,
      firstTry,
      topicId,
      paidRef,
      xpRef,
      id: `lab-${checkId}`,
    });
  }

  function completeLab(okCount) {
    if (onFinished) {
      finishGuidedLesson({
        preview,
        progress,
        setProgress,
        key: walkKey,
        xpFromChecks: xpRef.current,
        correct: okCount,
        total: queue.length,
        topicName: walkthrough?.title || "R = V/I",
        difficultyName: "Lab",
        kind: "lab",
        onFinished,
      });
      return;
    }
    setDone(true);
  }

  function next() {
    if (index + 1 >= queue.length) {
      completeLab(score);
      return;
    }
    setIndex((n) => n + 1);
    resetPlace();
  }

  if (stage === "teach" && walkthrough) {
    return (
      <LabTeach
        title={walkthrough.title || "Lab"}
        steps={walkthrough.steps}
        Schematic={walkthrough.Schematic}
        practiceLabel="Try the lab"
        skipLabel="Skip walkthrough"
        onExit={onExit}
        onPractice={() => setStage("lab")}
        onCheck={(outcome) =>
          payGuidedCheck(setProgress, {
            preview,
            xpEach,
            topicId,
            paidRef,
            xpRef,
            ...outcome,
          })
        }
      />
    );
  }

  if (done) {
    return (
      <div className="page results">
        <header className="topbar">
          <h1>Lab complete</h1>
          <ThemeSwitch />
        </header>
        <p>
          You {pickQuiz ? "got" : "placed"} {score}/{queue.length}{" "}
          {meshCurrents ? "current pairs" : powerQuiz ? "answers" : "resistors"}{" "}
          correctly.
        </p>
        <button type="button" className="primary" onClick={onExit}>
          Back to Learn
        </button>
      </div>
    );
  }

  return (
    <div
      className="page drag-lab"
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <header className="lesson-bar">
        <button type="button" className="ghost" onClick={onExit}>
          Close
        </button>
        <p className="lesson-meta">
          {labKindLabel(question.kind)}
          {question.kind !== "nodal" && !pickQuiz
            ? question.level === "hard"
              ? " · hard"
              : " · easy"
            : ""}
          {" · "}
          {index + 1}/{queue.length}
          {preview
            ? " · staff preview · no XP"
            : xpEach
              ? ` · +${xpEach} XP`
              : " · practice"}
        </p>
        <ThemeSwitch compact />
      </header>
      {!pickQuiz ? (
      <div className="board-tabs" role="tablist" aria-label="Resistor labels">
        <button
          type="button"
          role="tab"
          aria-selected={!hard}
          className={hard ? "" : "on"}
          onClick={() => setLabMode("easy")}
        >
          Ohm values
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={hard}
          className={hard ? "on" : ""}
          onClick={() => setLabMode("hard")}
        >
          Colour bands
        </button>
      </div>
      ) : null}
      {hasHardQs && question.level !== "hard" ? (
        <p className="login-hint">
          {question.kind === "nodal" ? (
            <>
              These first {firstHard} match the walkthrough. Later ones add a
              current source or extra branches.{" "}
            </>
          ) : (
            <>
              These first {firstHard} are easy. Hard questions start at{" "}
              {firstHard + 1}/{queue.length}.{" "}
            </>
          )}
          <button
            type="button"
            className="ghost"
            onClick={() => {
              setIndex(firstHard);
              resetPlace();
            }}
          >
            {question.kind === "nodal"
              ? "Skip to later questions"
              : "Skip to hard questions"}
          </button>
        </p>
      ) : null}
      {question.kind !== "nodal" && question.level === "hard" ? (
        <p className="hard-lab-banner">Hard question</p>
      ) : null}
      <p className="focus-line">
        <MathText text={labPrompt(question, hard)} />
      </p>
      <div className="circuit-board">
        {question.kind === "power" ? (
          <PowerSchematic question={question} highlight="p" view={question.shape} />
        ) : question.kind === "mpt" ? (
          <MaxPowerSchematic
            question={question}
            highlight={
              question.shape === "pmax"
                ? "p"
                : question.shape === "match"
                  ? "load"
                  : "all"
            }
            view={question.shape}
          />
        ) : question.kind === "dep" ? (
          <DependentSchematic question={question} highlight="dep" view={question.shape} />
        ) : (
        <OhmLabSchematic
          question={question}
          placed={placed}
          drag={drag}
          revealed={revealed}
          ok={ok}
          hard={hard}
          slotRef={slotRef}
        />
        )}
        <p className="circuit-current">
          <MathText
            text={
              question.kind === "nodal"
                ? question.shape === "isrc"
                  ? `v = ${question.nodeVolts} V · ${formatAmps(question.amps)} A into the node`
                  : `v = ${question.nodeVolts} V · Is = ${formatAmps(question.amps)} A`
                : question.kind === "thev-rth"
                  ? `$V_{th} = ${question.vth}\\ \\mathrm{V}$ · drop $R_{th}$`
                  : question.kind === "thev-load"
                    ? `$I_L = ${formatAmps(question.amps)}\\ \\mathrm{A}$`
                    : question.kind === "norton-rn"
                      ? `$I_n = ${formatAmps(question.amps)}\\ \\mathrm{A}$ · drop $R_n$`
                      : question.kind === "norton-load"
                        ? `$I_L = ${formatAmps(question.loadAmps)}\\ \\mathrm{A}$`
                    : question.kind === "mesh"
                      ? meshCurrents
                        ? "Both currents clockwise"
                        : `$\\mathbf{I}_1 = ${formatAmps(question.i1)}\\ \\mathrm{A}$ · $\\mathbf{I}_2 = ${formatAmps(question.i2)}\\ \\mathrm{A}$`
                      : question.kind === "supermesh"
                        ? `$\\mathbf{I}_1 = ${formatAmps(question.i1)}\\ \\mathrm{A}$ · $\\mathbf{I}_2 = ${formatAmps(question.i2)}\\ \\mathrm{A}$ · $I_s = ${formatAmps(question.amps)}\\ \\mathrm{A}$`
                        : question.kind === "supernode"
                          ? `Va = ${question.nodeVolts} V · Vb = ${question.nodeVolts2} V · Vs = ${question.vs} V`
                          : question.kind === "superpos"
                            ? `v' = ${question.vLeft} V · v'' = ${question.vRight} V · I = ${formatAmps(question.amps)} A`
                            : question.kind === "vdiv"
                              ? `Vs = ${question.volts} V · Vo = ${question.nodeVolts} V`
                              : question.kind === "idiv"
                                ? `Is = ${formatAmps(question.amps)} A · I through R = ${formatAmps(question.branchAmps)} A`
                                : question.kind === "power"
                                  ? `V = ${question.volts} V · I = ${formatAmps(question.amps)} A · R = ${question.ohms} Ω`
                                : question.kind === "mpt"
                                  ? `$V = ${question.volts}\\ \\mathrm{V}$ · $R_s = ${question.rs}\\ \\Omega$`
                                : question.kind === "dep"
                                  ? question.shape === "solve"
                                    ? "VCVS · $2 v_x$ · 2 Ω"
                                    : question.shape === "vccs"
                                      ? "VCCS · $0.5 v_x$"
                                      : question.shape === "keep"
                                        ? "Independent off · diamond stays"
                                        : "Diamond = dependent"
                                : `I = ${formatAmps(question.amps)} A`
            }
          />
        </p>
        <p className="circuit-dot-key">Filled dots are joins — wires connected.</p>
      </div>
      {!pickQuiz ? (
      <p className="login-hint lab-drop-hint">
        Hold a resistor and drop it on the gap, or tap it.
      </p>
      ) : (
      <p className="login-hint lab-drop-hint">
        {meshCurrents
          ? "Tap the pair of currents that matches the sketch."
          : "Tap the answer that matches the sketch."}
      </p>
      )}
      {placed != null && !pickQuiz ? (
        <p className="lab-picked">Selected: {placed} Ω</p>
      ) : null}
      {pickQuiz ? (
      <div className="options">
        {choices.map((choice, i) => {
          const key = meshCurrents ? `${choice.i1},${choice.i2}` : choice;
          const isSelected = placed === key;
          const isCorrect = meshCurrents
            ? key === `${question.i1},${question.i2}`
            : key === question.answer;
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
              onClick={() => setPlaced(key)}
            >
              <span className="option-letter">{["A", "B", "C", "D"][i]}</span>
              {meshCurrents ? (
              <MathText
                text={`$\\mathbf{I}_1 = ${formatAmps(choice.i1)}\\ \\mathrm{A}$, $\\mathbf{I}_2 = ${formatAmps(choice.i2)}\\ \\mathrm{A}$`}
              />
              ) : (
              <MathText text={choice} />
              )}
            </button>
          );
        })}
      </div>
      ) : (
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
      )}
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
            <MathText
              text={`${ok ? "Correct. " : pickQuiz ? "Not that one. " : "Not that value. "}${question.why}`}
            />
          </p>
          <button type="button" className="primary" onClick={next}>
            {index + 1 >= queue.length ? "See score" : "Next"}
          </button>
        </div>
      )}
      {!pickQuiz ? <ColourCodeKey /> : null}
      {drag ? (
        <div
          className="resistor-ghost"
          style={{ left: drag.x, top: drag.y }}
        >
          <ResistorBody ohms={drag.ohms} showValue ghost />
        </div>
      ) : null}
    </div>
  );
}
