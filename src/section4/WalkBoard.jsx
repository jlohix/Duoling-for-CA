import MathText from "../components/MathText";

const UNIT_STEP_EQ = String.raw`$$u(t)=\begin{cases}0,& t<0\\1,& t\ge 0\end{cases}$$`;

function Wire({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} />;
}

function Node({ x, y }) {
  return <circle cx={x} cy={y} r="3.2" className="walk-node" />;
}

function BatteryV({ x, y1, y2 }) {
  const mid = (y1 + y2) / 2;
  const gap = 8;
  const plateTop = mid - gap;
  const plateBot = mid + gap;
  return (
    <g>
      <Wire x1={x} y1={y1} x2={x} y2={plateTop} />
      <line x1={x - 16} y1={plateTop} x2={x + 16} y2={plateTop} />
      <line x1={x - 9} y1={plateBot} x2={x + 9} y2={plateBot} />
      <Wire x1={x} y1={plateBot} x2={x} y2={y2} />
      <text x={x - 28} y={plateTop + 5} className="walk-tiny">
        +
      </text>
      <text x={x - 28} y={plateBot + 5} className="walk-tiny">
        −
      </text>
    </g>
  );
}

function ResistorH({ x1, x2, y }) {
  const lead = 10;
  const a = x1 + lead;
  const b = x2 - lead;
  const w = (b - a) / 6;
  const h = 11;
  const d = [
    `M${x1} ${y} H${a}`,
    `L${a + w} ${y - h}`,
    `L${a + 2 * w} ${y + h}`,
    `L${a + 3 * w} ${y - h}`,
    `L${a + 4 * w} ${y + h}`,
    `L${a + 5 * w} ${y - h}`,
    `L${b} ${y}`,
    `H${x2}`,
  ].join(" ");
  return <path d={d} />;
}

function CapacitorH({ x1, x2, y }) {
  const mid = (x1 + x2) / 2;
  const gap = 7;
  const left = mid - gap;
  const right = mid + gap;
  return (
    <g>
      <Wire x1={x1} y1={y} x2={left} y2={y} />
      <line x1={left} y1={y - 16} x2={left} y2={y + 16} />
      <line x1={right} y1={y - 16} x2={right} y2={y + 16} />
      <Wire x1={right} y1={y} x2={x2} y2={y} />
    </g>
  );
}

function InductorH({ x1, x2, y }) {
  const lead = 10;
  const a = x1 + lead;
  const span = x2 - lead - a;
  const r = span / 8;
  let d = `M${x1} ${y} H${a}`;
  for (let i = 0; i < 4; i += 1) {
    const x0 = a + i * 2 * r;
    d += ` A${r} ${r} 0 0 1 ${x0 + 2 * r} ${y}`;
  }
  d += ` H${x2}`;
  return <path d={d} />;
}

function SwitchH({ x1, x2, y, open }) {
  return (
    <g>
      <Node x={x1} y={y} />
      <Node x={x2} y={y} />
      {open ? (
        <Wire x1={x1} y1={y} x2={x2 - 2} y2={y - 20} />
      ) : (
        <Wire x1={x1} y1={y} x2={x2} y2={y} />
      )}
    </g>
  );
}

function CurrentArrow({ x, y, label, weak }) {
  return (
    <g className={`walk-current ${weak ? "is-weak" : ""}`}>
      <path d={`M${x} ${y} H${x + 28}`} />
      <path d={`M${x + 20} ${y - 6} L${x + 32} ${y} L${x + 20} ${y + 6}`} />
      <text x={x + 38} y={y + 4} className="walk-i-label">
        {label}
      </text>
    </g>
  );
}

function LoopCircuit({
  mode,
  store = "L",
  arrow = "i(t)",
  sourceLabel = "Battery",
  storeLabel,
  loadLabel = "R (resistor)",
}) {
  const open = mode === "after";
  const storeName = storeLabel || (store === "C" ? "C (capacitor)" : "L (inductor)");
  const T = 56;
  const B = 152;
  const Xb = 58;
  const Xs1 = 94;
  const Xs2 = 126;
  const Xl = 146;
  const Xr = 226;
  const Xright = 338;
  const R1 = 146;
  const R2 = 222;
  const batTop = 82;
  const batBot = 126;
  const Store = store === "C" ? CapacitorH : InductorH;

  return (
    <svg
      className="walk-circuit"
      viewBox="-12 -10 424 228"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={open ? "After switching" : "Before switching"}
    >
      <g className={open ? "walk-dim" : undefined}>
        <BatteryV x={Xb} y1={batTop} y2={batBot} />
        <Wire x1={Xb} y1={T} x2={Xb} y2={batTop} />
        <Wire x1={Xb} y1={batBot} x2={Xb} y2={B} />
        <Wire x1={Xb} y1={T} x2={Xs1} y2={T} />
        <Node x={Xb} y={T} />
        <Node x={Xb} y={B} />
        <text x={Xb} y={198} textAnchor="middle" className="walk-part">
          {open ? "Battery out" : sourceLabel}
        </text>
      </g>
      <SwitchH x1={Xs1} x2={Xs2} y={T} open={open} />
      <text x={(Xs1 + Xs2) / 2} y={18} textAnchor="middle" className="walk-part">
        {open ? "switch open" : "switch closed"}
      </text>
      <Wire x1={Xs2} y1={T} x2={Xl} y2={T} />
      <Store x1={Xl} x2={Xr} y={T} />
      <Wire x1={Xr} y1={T} x2={Xright} y2={T} />
      <Wire x1={Xright} y1={T} x2={Xright} y2={B} />
      <Wire x1={Xright} y1={B} x2={R2} y2={B} />
      <ResistorH x1={R1} x2={R2} y={B} />
      {open ? (
        <>
          <Wire x1={R1} y1={B} x2={Xs2} y2={B} />
          <Wire x1={Xs2} y1={B} x2={Xs2} y2={T} />
          <Wire x1={Xb} y1={B} x2={Xs2} y2={B} />
          <Node x={Xs2} y={B} />
        </>
      ) : (
        <Wire x1={R1} y1={B} x2={Xb} y2={B} />
      )}
      <Node x={Xright} y={T} />
      <Node x={Xright} y={B} />
      <CurrentArrow x={Xr + 18} y={T - 16} label={arrow} weak={open} />
      <text x={(Xl + Xr) / 2} y={T - 18} textAnchor="middle" className="walk-part">
        {storeName}
      </text>
      <text x={(R1 + R2) / 2} y={B + 28} textAnchor="middle" className="walk-part">
        {loadLabel}
      </text>
    </svg>
  );
}

function plotPath(kind) {
  const compact = kind === "step";
  const x0 = compact ? 70 : 96;
  const y0 = compact ? 22 : 36;
  const w = compact ? 280 : 292;
  const h = compact ? 92 : 128;
  if (kind === "step") {
    const t0 = x0 + w * 0.34;
    const baseY = y0 + h;
    return {
      d: `M${x0} ${baseY} H${t0} V${y0} H${x0 + w}`,
      x0,
      y0,
      w,
      h,
      t0,
      compact,
    };
  }
  const pts = [];
  for (let i = 0; i <= 48; i += 1) {
    const t = i / 48;
    const x = x0 + t * w;
    const frac = kind === "decay" ? Math.exp(-t * 4) : 1 - Math.exp(-t * 4);
    const y = y0 + h * (1 - frac);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return { d: `M${pts.join(" L")}`, x0, y0, w, h, t0: null, compact };
}

function ResponseGraph({ kind, yTop, yBot, yLabel }) {
  const { d, x0, y0, w, h, t0, compact } = plotPath(kind);
  const tauX = x0 + w / 4;
  const endX = x0 + w;
  const baseY = y0 + h;
  const startY = kind === "decay" ? y0 : baseY;
  const tauY =
    kind === "decay"
      ? y0 + h * (1 - Math.exp(-1))
      : kind === "rise"
        ? y0 + h * Math.exp(-1)
        : y0;
  const showTau = kind !== "step";
  const tickY = baseY + 20;
  const timeY = compact ? baseY + 20 : baseY + 42;
  const axisY = y0 + h / 2;
  const viewW = compact ? 390 : 440;
  const viewH = compact ? 156 : 270;
  const axisTop = Math.max(12, y0 - 10);
  return (
    <svg
      className={`walk-graph${compact ? " is-compact" : ""}`}
      viewBox={`0 0 ${viewW} ${viewH}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`${yLabel} versus time`}
    >
      <line x1={x0} y1={baseY} x2={endX} y2={baseY} />
      <line x1={x0} y1={baseY} x2={x0} y2={axisTop} />
      <path d={`M${x0 - 5} ${axisTop + 8} L${x0} ${axisTop} L${x0 + 5} ${axisTop + 8}`} />
      <path d={`M${endX - 8} ${baseY - 5} L${endX} ${baseY} L${endX - 8} ${baseY + 5}`} />
      <text
        x="16"
        y={axisY}
        textAnchor="middle"
        className="walk-axis"
        transform={`rotate(-90 16 ${axisY})`}
      >
        {yLabel}
      </text>
      <text x={endX} y={timeY} textAnchor="end" className="walk-axis">
        Time, t
      </text>
      {showTau ? (
        <>
          <line x1={tauX} y1={startY} x2={tauX} y2={tauY} className="walk-tau-line" />
          <line x1={x0} y1={tauY} x2={tauX} y2={tauY} className="walk-tau-line" />
          <circle cx={tauX} cy={tauY} r="3.5" className="walk-dot walk-tau-dot" />
          <text x={tauX} y={tickY} textAnchor="middle" className="walk-tau-text">
            τ
          </text>
          <text x={x0 + w / 2} y={tickY} textAnchor="middle" className="walk-mark">
            2τ
          </text>
          <text x={x0 + (3 * w) / 4} y={tickY} textAnchor="middle" className="walk-mark">
            3τ
          </text>
        </>
      ) : (
        <text x={t0} y={tickY} textAnchor="middle" className="walk-mark">
          t = 0
        </text>
      )}
      <path d={d} className="walk-curve" />
      {kind === "step" ? (
        <>
          <circle cx={t0} cy={baseY} r="4" className="walk-dot-open" />
          <circle cx={t0} cy={y0} r="3.5" className="walk-dot" />
        </>
      ) : (
        <circle cx={x0} cy={startY} r="3.5" className="walk-dot" />
      )}
      <text x={x0 - 12} y={y0} textAnchor="end" dominantBaseline="middle" className="walk-mark">
        {yTop}
      </text>
      {yBot ? (
        <text x={x0 - 12} y={baseY} textAnchor="end" dominantBaseline="middle" className="walk-mark">
          {yBot}
        </text>
      ) : null}
    </svg>
  );
}

export function WalkBoard({
  className = "",
  focus = false,
  states,
  equation,
  graph,
  caption,
  note,
  tau,
  cues,
}) {
  return (
    <div className={`walk-board ${focus ? "is-focus" : ""} ${className}`.trim()}>
      {states ? <div className="walk-board-states">{states}</div> : null}
      <div className="walk-board-graph">
        {equation ? (
          <p className="walk-eq">
            <MathText text={equation} />
          </p>
        ) : null}
        {graph}
        {caption ? <p className="walk-caption">{caption}</p> : null}
      </div>
      {note ? <p className="walk-note">{note}</p> : null}
      {tau || cues ? (
        <div className="walk-tau-row">
          {tau ? (
            <p className="walk-eq">
              <MathText text={tau} />
            </p>
          ) : null}
          {cues ? <p className="walk-cue">{cues}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function StateCard({ title, children }) {
  return (
    <figure className="walk-state">
      <figcaption className="walk-state-label">{title}</figcaption>
      {children}
    </figure>
  );
}

export function RlDecayBoard({ highlight = "all" }) {
  return (
    <WalkBoard
      focus={highlight === "curve"}
      states={
        <>
          <StateCard title="Before t = 0: current has reached i(0)">
            <LoopCircuit mode="before" store="L" arrow="i(t)" />
          </StateCard>
          <StateCard title="After t = 0: inductor releases stored energy">
            <LoopCircuit mode="after" store="L" arrow="i(t)" />
          </StateCard>
        </>
      }
      equation="$$i(t)=i(0)e^{-t/\\tau}$$"
      graph={<ResponseGraph kind="decay" yTop="i(0)" yBot="0" yLabel="Current, i(t)" />}
      caption="At t = τ the current is i(0)/e ≈ 0.37 i(0). That is one time constant."
      note="The inductor resists sudden changes in current. Stored magnetic energy drives current through R, then that current falls."
      tau="$$\\tau=L/R$$"
      cues={
        <>
          <span className="walk-cue-a">larger L → slower decay</span>
          <span className="walk-cue-b">larger R → faster decay</span>
        </>
      }
    />
  );
}

export function RcDecayBoard({ highlight = "all" }) {
  return (
    <WalkBoard
      focus={highlight === "curve"}
      states={
        <>
          <StateCard title="Before t = 0: capacitor has voltage v(0)">
            <LoopCircuit mode="before" store="C" arrow="v" />
          </StateCard>
          <StateCard title="After t = 0: capacitor dumps into R">
            <LoopCircuit mode="after" store="C" arrow="v" />
          </StateCard>
        </>
      }
      equation="$$v(t)=v(0)e^{-t/\\tau}$$"
      graph={<ResponseGraph kind="decay" yTop="v(0)" yBot="0" yLabel="Voltage, v(t)" />}
      caption="At t = τ the voltage is v(0)/e ≈ 0.37 v(0). That is one time constant."
      note="The capacitor resists sudden changes in voltage. Stored electric energy drives current through R, then the voltage falls."
      tau="$$\\tau=RC$$"
      cues={
        <>
          <span className="walk-cue-a">larger C → slower decay</span>
          <span className="walk-cue-b">larger R → slower decay</span>
        </>
      }
    />
  );
}

export function UnitStepBoard() {
  return (
    <WalkBoard
      className="walk-board-single"
      equation={UNIT_STEP_EQ}
      graph={<ResponseGraph kind="step" yTop="1" yBot="0" yLabel="u(t)" />}
      caption="The step is 0, then 1 at t = 0. That is how we write a switch throw."
      note="Use a step when a source turns on, or when a switch changes the circuit at t = 0."
    />
  );
}

export function RcStepBoard({ highlight = "all" }) {
  return (
    <WalkBoard
      focus={highlight === "curve"}
      states={
        <>
          <StateCard title="Before t = 0: switch open, v(0) = V0">
            <LoopCircuit mode="after" store="C" arrow="v" />
          </StateCard>
          <StateCard title="After t = 0: battery on, C charges toward Vs">
            <LoopCircuit mode="before" store="C" arrow="v" />
          </StateCard>
        </>
      }
      equation="$$v(t)=V_s+(V_0-V_s)e^{-t/\\tau}$$"
      graph={<ResponseGraph kind="rise" yTop="Vs" yBot="V0" yLabel="Voltage, v(t)" />}
      caption="At t = τ the gap to Vs has fallen to about 37%. Forced value is Vs."
      note="Capacitor voltage cannot jump. Natural piece from stored energy, forced piece from Vs."
      tau="$$\\tau=RC$$"
      cues={
        <>
          <span className="walk-cue-a">larger C → slower rise</span>
          <span className="walk-cue-b">larger R → slower rise</span>
        </>
      }
    />
  );
}

export function RlStepBoard({ highlight = "all" }) {
  return (
    <WalkBoard
      focus={highlight === "curve"}
      states={
        <>
          <StateCard title="Before t = 0: switch open, i(0) = I0">
            <LoopCircuit mode="after" store="L" arrow="i(t)" />
          </StateCard>
          <StateCard title="After t = 0: battery on, current builds toward Vs/R">
            <LoopCircuit mode="before" store="L" arrow="i(t)" />
          </StateCard>
        </>
      }
      equation="$$i(t)=V_s/R+(I_0-V_s/R)e^{-t/\\tau}$$"
      graph={<ResponseGraph kind="rise" yTop="Vs/R" yBot="I0" yLabel="Current, i(t)" />}
      caption="At t = τ the gap to Vs/R has fallen to about 37%. Forced value is Vs/R."
      note="Inductor current cannot jump. Same first-order story as the RC step, with current instead of voltage."
      tau="$$\\tau=L/R$$"
      cues={
        <>
          <span className="walk-cue-a">larger L → slower rise</span>
          <span className="walk-cue-b">larger R → faster rise</span>
        </>
      }
    />
  );
}
