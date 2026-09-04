import { Capacitor, Frame, PlotAxes, Resistor, samplePath } from "../components/LabDraw";
import { freeCDragLabel } from "../data/freeCLab";

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

function DecayPlot() {
  const points = samplePath((t) => ({
    x: 56 + t * 300,
    y: 210 - 130 * Math.exp(-3 * t),
  }));
  return (
    <>
      <PlotAxes x0={56} y0={210} x1={370} y1={68} xLabel="t" yLabel="v(t)" />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </>
  );
}

export default function FreeCDragBoard({
  question,
  placed,
  drag,
  revealed,
  ok,
  slotRef,
}) {
  const filled = freeCDragLabel(question, placed);
  const empty =
    question.kind === "tau" ? "drop τ" : question.kind === "vtau" ? "drop v(τ)" : "drop v(∞)";

  if (question.kind === "tau") {
    return (
      <Frame label="Find τ = RC">
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M48 200 V110 H80" />
          <Capacitor x={80} y={110} />
          <path d="M154 110 H200" />
          <Resistor x={200} y={110} />
          <path d="M312 110 H372 V200 H48" />
        </g>
        <text x={117} y={154} textAnchor="middle" className="circuit-part">
          {question.cLabel}
        </text>
        <text x={256} y={154} textAnchor="middle" className="circuit-part">
          {question.rLabel}
        </text>
        <text x={456} y={80} textAnchor="middle" className="board-step">
          τ
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
    <Frame label="Source-free RC decay">
      <DecayPlot />
      <text x={70} y={88} className="circuit-part">
        {question.v0} V
      </text>
      <text x={456} y={80} textAnchor="middle" className="board-step">
        {question.kind === "vtau" ? "v(τ)" : "v(∞)"}
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
