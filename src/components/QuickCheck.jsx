import { useRef } from "react";
import MathText from "./MathText";
import QuizMascot from "./QuizMascot";

const LABELS = ["A", "B", "C", "D"];
const KEYS = ["a", "b", "c", "d"];
const LAYOUT_CACHE = new Map();

function choiceEntries(options) {
  return KEYS.map((key) => [key, options?.[key]]).filter(([, text]) => text);
}

function hashKey(value) {
  const text = String(value ?? "");
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle(entries, seed) {
  let state = seed || 1;
  const rng = () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...entries];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function arrangeChoices(entries, originalAnswer, lockKey) {
  const correct = entries.find(([key]) => key === originalAnswer);
  const rest = seededShuffle(
    entries.filter(([key]) => key !== originalAnswer),
    hashKey(`${lockKey}-rest`)
  );
  if (!correct) return seededShuffle(entries, hashKey(lockKey));
  const slot = rest.length === 0 ? 0 : hashKey(lockKey) % (rest.length + 1);
  const out = [...rest];
  out.splice(slot, 0, correct);
  return out;
}

function layoutFromEntries(entries, originalAnswer) {
  const options = {};
  const toOriginal = {};
  const toDisplay = {};
  entries.forEach(([orig, text], i) => {
    const letter = KEYS[i];
    options[letter] = text;
    toOriginal[letter] = orig;
    toDisplay[orig] = letter;
  });
  return {
    options,
    answer: toDisplay[originalAnswer] || originalAnswer,
    toOriginal,
    toDisplay,
  };
}

function useLockedChoiceLayout(check, lockKey) {
  const cache = useRef(LAYOUT_CACHE);
  if (!check) {
    return { options: {}, answer: "", toOriginal: {}, toDisplay: {} };
  }
  const key = `${lockKey || check.prompt}::${check.answer}::${choiceEntries(check.options)
    .map(([, text]) => text)
    .join("|")}`;
  if (!cache.current.has(key)) {
    cache.current.set(
      key,
      layoutFromEntries(arrangeChoices(choiceEntries(check.options), check.answer, key), check.answer)
    );
  }
  return cache.current.get(key);
}

export function QuickCheckOption({
  letter,
  text,
  state,
  disabled,
  onSelect,
}) {
  return (
    <button
      type="button"
      className={`qc-option ${state}`.trim()}
      disabled={disabled}
      onClick={onSelect}
    >
      <span className="qc-letter">{letter}</span>
      <span className="qc-option-copy">
        <MathText text={text} />
      </span>
    </button>
  );
}

export function QuickCheckCard({
  prompt,
  options,
  answer,
  why,
  selected,
  revealed,
  ok,
  onSelect,
  onCheck,
  onRetry,
  afterReveal,
  badge = "Quick check",
  progressLabel,
  willRepeat = false,
}) {
  return (
    <div className={`qc-card ${revealed ? (ok ? "is-ok" : "is-bad") : ""}`.trim()}>
      <div className="qc-head">
        <p className="qc-badge">
          <i className="fa fa-bolt" aria-hidden="true" />
          {badge}
        </p>
        {progressLabel ? <p className="qc-progress">{progressLabel}</p> : null}
      </div>
      <p className="qc-prompt">
        <MathText text={prompt} />
      </p>
      <div className="qc-options">
        {LABELS.map((letter) => {
          const key = letter.toLowerCase();
          const text = options?.[key];
          if (!text) return null;
          const isSelected = selected === key;
          const isCorrect = answer === key;
          let state = "";
          if (revealed && isCorrect) state = "correct";
          else if (revealed && isSelected && !isCorrect) state = "wrong";
          else if (!revealed && isSelected) state = "picked";
          return (
            <QuickCheckOption
              key={key}
              letter={letter}
              text={text}
              state={state}
              disabled={revealed}
              onSelect={() => onSelect(key)}
            />
          );
        })}
      </div>
      {!revealed ? (
        <button
          type="button"
          className="qc-check"
          disabled={!selected}
          onClick={onCheck}
        >
          Check
        </button>
      ) : (
        <div className={`qc-feedback ${ok ? "ok" : "bad"}`}>
          <QuizMascot mood={ok ? "happy" : "scary"} playKey={ok ? "ok" : "bad"} />
          <p className={ok ? "ok-text" : "bad-text"}>
            <span className="qc-result">{ok ? "Nice!" : "Not quite"}</span>
            <MathText text={why} />
          </p>
          {!ok && willRepeat ? (
            <p className="login-hint">This question will come back at the end.</p>
          ) : null}
          <div className="qc-feedback-actions">
            {!ok && onRetry ? (
              <button type="button" className="ghost" onClick={onRetry}>
                Try again
              </button>
            ) : null}
            {afterReveal}
          </div>
        </div>
      )}
    </div>
  );
}

export function InlineKnowledgeCheck({
  check,
  selected,
  revealed,
  ok,
  onSelect,
  onCheck,
  onRetry,
  afterReveal,
  badge,
  progressLabel,
  lockKey,
  willRepeat = false,
}) {
  const layout = useLockedChoiceLayout(check, lockKey);
  if (!check) return null;
  return (
    <QuickCheckCard
      prompt={check.prompt}
      options={layout.options}
      answer={layout.answer}
      why={check.why}
      selected={layout.toDisplay[selected] || ""}
      revealed={revealed}
      ok={ok}
      onSelect={(displayKey) => onSelect(layout.toOriginal[displayKey])}
      onCheck={onCheck}
      onRetry={onRetry}
      afterReveal={afterReveal}
      badge={badge}
      progressLabel={progressLabel}
      willRepeat={willRepeat}
    />
  );
}
