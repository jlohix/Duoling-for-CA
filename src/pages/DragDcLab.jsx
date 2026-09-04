import { useMemo, useRef, useState } from "react";
import { DC_LAB_QUESTIONS, DC_PARTS } from "../data/dcLab";
import PartSymbol from "../components/PartSymbol";
import ThemeSwitch from "../components/ThemeSwitch";
import {
  XP_CORRECT,
  finishGuidedLesson,
  payGuidedCheck,
} from "../state/progress";

const MODE_KEY = "circuito-dc-lab-mode-v1";

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

function PartChip({ part, hard, onPointerDown, onPick, disabled }) {
  return (
    <button
      type="button"
      className="resistor-chip part-chip"
      disabled={disabled}
      aria-label={part.label}
      onClick={() => onPick(part.id)}
      onPointerDown={(event) => onPointerDown(event, part.id)}
    >
      <PartSymbol id={part.id} />
      {hard ? null : <span className="resistor-ohms">{part.label}</span>}
    </button>
  );
}

export default function DragDcLab({
  onExit,
  onFinished,
  progress,
  setProgress,
  preview = false,
  walkKey = "walk-lab-dc",
  topicId = 3,
}) {
  const queue = useMemo(() => shuffle(DC_LAB_QUESTIONS), []);
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
  const question = queue[index];
  const choices = useMemo(() => shuffle(DC_PARTS), [question?.id]);
  const placedPart = DC_PARTS.find((row) => row.id === placed);

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

  function startDrag(event, partId) {
    if (revealed) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const next = {
      partId,
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
    if (overSlot(event.clientX, event.clientY)) setPlaced(cur.partId);
    dragRef.current = null;
    setDrag(null);
  }

  function check() {
    if (!placed || revealed) return;
    const pass = placed === question.correct;
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
        topicName: "C and L",
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

  if (done) {
    return (
      <div className="page results">
        <header className="topbar">
          <h1>Lab complete</h1>
          <ThemeSwitch />
        </header>
        <p>
          You placed {score}/{queue.length} equivalents correctly.
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
          DC lab · {index + 1}/{queue.length}
          {preview
            ? " · staff preview · no XP"
            : xpEach
              ? ` · +${xpEach} XP`
              : " · practice"}
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
        {`The source has been on for a long time (DC steady state). The ${
          question.partName
        } is in series with the battery${
          question.rOhm ? ` and a ${question.rOhm} Ω resistor` : ""
        }. Drag what that ${question.partName} becomes${
          hard ? " (Hard: symbols only)" : ""
        }.`}
      </p>
      <div className="circuit-board">
        <svg
          className="circuit-svg"
          viewBox="0 0 560 216"
          role="img"
          aria-label={`Series battery and ${question.partName} under DC`}
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
          >
            <path d="M90 70 V96" />
            <path d="M90 148 V200 H470 V70 H358" />
            <path d="M90 70 H202" />
            <line x1="68" y1="104" x2="112" y2="104" strokeWidth="4" />
            <line x1="78" y1="140" x2="102" y2="140" strokeWidth="3" />
          </g>
          <text x="122" y="118" className="circuit-label">
            +
          </text>
          <text x="122" y="148" className="circuit-label">
            −
          </text>
          <text x="28" y="128" className="circuit-label">
            {question.volts} V
          </text>
          <text x="268" y="28" className="circuit-label">
            {question.part}
          </text>
          <circle cx="90" cy="70" r="3.5" fill="currentColor" />
          <circle cx="90" cy="200" r="3.5" fill="currentColor" />
          <circle cx="470" cy="70" r="3.5" fill="currentColor" />
          <circle cx="470" cy="200" r="3.5" fill="currentColor" />
          {placed === "short" ? (
            <path
              d="M202 70 H358"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          ) : null}
          {placed === "cap" ? (
            <g fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M202 70 H268 M292 70 H358" />
              <path d="M272 48 V92 M288 48 V92" />
            </g>
          ) : null}
          {placed === "ind" ? (
            <path
              d="M202 70 H220 C226 70 226 48 234 48 C242 48 242 92 250 92 C258 92 258 48 266 48 C274 48 274 92 282 92 C290 92 290 70 298 70 H358"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          ) : null}
          {placed === "open" ? (
            <g fill="currentColor">
              <circle cx="236" cy="70" r="3.5" />
              <circle cx="324" cy="70" r="3.5" />
            </g>
          ) : null}
          <polygon points="232,200 246,191 246,209" fill="currentColor" />
          <foreignObject x="222" y="40" width="116" height="52">
            <div
              ref={slotRef}
              className={`resistor-slot ${drag?.over ? "hot" : ""} ${
                placed ? "filled" : ""
              } ${revealed ? (ok ? "ok" : "bad") : ""}`}
            >
              {placedPart ? (
                <span className="slot-part">
                  <PartSymbol id={placedPart.id} />
                  {!hard || revealed ? (
                    <span className="resistor-ohms">{placedPart.label}</span>
                  ) : null}
                </span>
              ) : (
                "DC eq."
              )}
            </div>
          </foreignObject>
        </svg>
        {revealed ? (
          <p className="circuit-current">{question.currentText}</p>
        ) : (
          <p className="circuit-current muted-current">I = ?</p>
        )}
      </div>
      <p className="login-hint">
        Hold a symbol and drop it on the gap, or tap it.
      </p>
      <div className="resistor-tray">
        {choices.map((part) => (
          <PartChip
            key={part.id}
            part={part}
            hard={hard}
            disabled={revealed}
            onPick={(id) => {
              if (!revealed) setPlaced(id);
            }}
            onPointerDown={startDrag}
          />
        ))}
      </div>
      {!revealed ? (
        <button
          type="button"
          className="primary check"
          disabled={!placed}
          onClick={check}
        >
          Check
        </button>
      ) : (
        <div className="feedback-row">
          <p className={ok ? "ok-text" : "bad-text"}>{question.why}</p>
          <button type="button" className="primary" onClick={next}>
            {index + 1 >= queue.length ? "See score" : "Next"}
          </button>
        </div>
      )}
      {drag ? (
        <div
          className="resistor-ghost"
          style={{ left: drag.x, top: drag.y }}
        >
          <PartSymbol id={drag.partId} />
          {hard ? null : (
            <span className="resistor-ohms">
              {DC_PARTS.find((row) => row.id === drag.partId)?.label}
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}
