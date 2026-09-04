import { useMemo, useRef, useState } from "react";
import MathText from "./MathText";
import ThemeSwitch from "./ThemeSwitch";

function shuffle(list) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export default function ValueDragLab({
  title,
  progressLabel,
  questions,
  Board,
  promptFor,
  labelFor,
  hint = "Hold a chip and drop it on the gap, or tap it.",
  xpHint,
  onExit,
  onCheck,
  onDone,
}) {
  const queue = useMemo(() => shuffle(questions), [questions]);
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [ok, setOk] = useState(false);
  const [score, setScore] = useState(0);
  const [drag, setDrag] = useState(null);
  const slotRef = useRef(null);
  const dragRef = useRef(null);
  const attemptedRef = useRef(new Set());
  const question = queue[index];
  const last = index + 1 >= queue.length;
  const choices = useMemo(
    () => shuffle(question?.choices || []),
    [question?.id]
  );

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

  function startDrag(event, value) {
    if (revealed) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const next = {
      value,
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

  function endDrag() {
    const current = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!current || revealed) return;
    if (current.over) setPlaced(current.value);
  }

  function check() {
    if (placed == null || revealed || !question) return;
    const pass = placed === question.correct;
    const checkId = question.id || `d-${index}`;
    const firstTry = !attemptedRef.current.has(checkId);
    attemptedRef.current.add(checkId);
    setOk(pass);
    setRevealed(true);
    onCheck?.({ ok: pass, firstTry, id: `drag-${checkId}` });
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
    resetPlace();
  }

  if (!question) return null;

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
          {progressLabel ? `${progressLabel} · ` : ""}
          {title}, drag {index + 1} of {queue.length}
          {xpHint ? ` · ${xpHint}` : ""}
        </p>
        <ThemeSwitch compact />
      </header>
      <p className="focus-line">
        <MathText text={promptFor(question)} />
      </p>
      <div className="circuit-board">
        <Board
          question={question}
          placed={placed}
          drag={drag}
          revealed={revealed}
          ok={ok}
          slotRef={slotRef}
        />
      </div>
      <p className="login-hint lab-drop-hint">{hint}</p>
      {placed != null ? (
        <p className="lab-picked">Selected: {labelFor(question, placed)}</p>
      ) : null}
      <div className="resistor-tray">
        {choices.map((value) => (
          <button
            key={String(value)}
            type="button"
            className="resistor-chip"
            disabled={revealed}
            onClick={() => {
              if (!revealed) setPlaced(value);
            }}
            onPointerDown={(event) => startDrag(event, value)}
          >
            <span className="resistor-ohms">{labelFor(question, value)}</span>
          </button>
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
            <MathText
              text={`${ok ? "Correct. " : "Not that value. "}${question.why}`}
            />
          </p>
          <button type="button" className="primary" onClick={next}>
            {last ? "See score" : "Next"}
          </button>
        </div>
      )}
      {drag ? (
        <div
          className="resistor-ghost"
          style={{ left: drag.x, top: drag.y }}
        >
          <span className="resistor-ohms">
            {labelFor(question, drag.value)}
          </span>
        </div>
      ) : null}
    </div>
  );
}
