import { Battery, Frame, Inductor, PlotAxes, Resistor, samplePath } from "../components/LabDraw";
import { lSourceDragLabel } from "../data/lSourceLab";

function DropSlot({ slotRef, drag, placed, revealed, ok, empty, filled, x = 400, y = 94, w = 112, h = 40 }) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <div
        ref={slotRef}
        xmlns="http://www.w3.org/1999/xhtml"
        className={`resistor-slot compact ${drag?.over ? "hot" : ""} ${
          placed != null ? "filled" : ""
        } ${revealed ? (ok ? "ok" : "bad") : ""}`}
      >
        {placed != null ? filled : empty}
      </div>
    </foreignObject>
  );
}

function RisePlot() {
  const points = samplePath((t) => ({
    x: 56 + t * 300,
    y: 210 - 130 * (1 - Math.exp(-3 * t)),
  }));
  return (
    <>
      <PlotAxes x0={56} y0={210} x1={370} y1={68} xLabel="t" yLabel="i(t)" />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </>
  );
}

function SourceLoop({ vsLabel, rLabel, lLabel }) {
  const top = 110;
  return (
    <>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M48 200 V110" />
        <Battery x={48} y={top} />
        <path d="M120 110 H128" />
        <Resistor x={128} y={top} />
        <path d="M240 110 H248" />
        <Inductor x={248} y={top} />
        <path d="M368 110 H372 V200 H48" />
      </g>
      {vsLabel ? (
        <text x={84} y={154} textAnchor="middle" className="circuit-part">
          {vsLabel}
        </text>
      ) : null}
      <text x={184} y={154} textAnchor="middle" className="circuit-part">
        {rLabel}
      </text>
      <text x={308} y={154} textAnchor="middle" className="circuit-part">
        {lLabel}
      </text>
    </>
  );
}

export default function LSourceDragBoard({
  question,
  placed,
  drag,
  revealed,
  ok,
  slotRef,
}) {
  const filled = lSourceDragLabel(question, placed);
  const empty =
    question.kind === "tau" ? "drop τ" : question.kind === "itau" ? "drop i(τ)" : "drop i(∞)";

  if (question.kind === "itau") {
    return (
      <Frame label="RL current from rest">
        <RisePlot />
        <text x={70} y={88} className="circuit-part">
          0 A
        </text>
        <text x={300} y={78} className="circuit-part">
          {question.iInf} A
        </text>
        <text x={456} y={80} textAnchor="middle" className="board-step">
          i(τ)
        </text>
        <DropSlot
          slotRef={slotRef}
          drag={drag}
          placed={placed}
          revealed={revealed}
          ok={ok}
          empty={empty}
          filled={filled}
        />
      </Frame>
    );
  }

  return (
    <Frame label={question.kind === "tau" ? "Find τ = L/R" : "Find i(∞)"}>
      <SourceLoop
        vsLabel={question.kind === "iinf" ? `${question.vs} V` : "Vs"}
        rLabel={question.rLabel || `${question.rOhm} Ω`}
        lLabel={question.lLabel || "L"}
      />
      <text x={456} y={80} textAnchor="middle" className="board-step">
        {question.kind === "tau" ? "τ" : "i(∞)"}
      </text>
      <DropSlot
        slotRef={slotRef}
        drag={drag}
        placed={placed}
        revealed={revealed}
        ok={ok}
        empty={empty}
        filled={filled}
      />
    </Frame>
  );
}
