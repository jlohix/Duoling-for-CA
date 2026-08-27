import { useEffect, useState } from "react";

export default function StreakCelebrate({ from, to, onTick }) {
  const start = Math.max(0, Number(from) || 0);
  const end = Math.max(start + 1, Number(to) || 0);
  const [shown, setShown] = useState(start);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    onTick?.(start);
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    if (reduce) {
      setShown(end);
      onTick?.(end);
      return undefined;
    }

    setShown(start);
    setPopping(false);
    const timers = [];
    let current = start;
    const bump = () => {
      current += 1;
      setShown(current);
      setPopping(true);
      onTick?.(current);
      timers.push(setTimeout(() => setPopping(false), 420));
      if (current < end) {
        timers.push(setTimeout(bump, 520));
      }
    };
    timers.push(setTimeout(bump, 550));
    return () => timers.forEach(clearTimeout);
  }, [start, end, onTick]);

  return (
    <div className="streak-celebrate" role="status">
      <span className="streak-flame" aria-hidden="true">
        🔥
      </span>
      <p className={`streak-count ${popping ? "up" : ""}`}>
        {shown}
        {popping ? <span className="streak-plus">+1</span> : null}
      </p>
      <p className="streak-caption">
        {start === 0 && end === 1 ? "Streak started" : "Streak extended"}
      </p>
    </div>
  );
}
