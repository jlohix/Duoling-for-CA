import { Arrow, Battery, Frame, Inductor, Resistor } from "../components/LabDraw";
import { indDragLabel } from "../data/inductorLab";

function DropSlot({ slotRef, drag, placed, revealed, ok, empty, filled, x = 360, y = 108 }) {
  return (
    <foreignObject x={x} y={y} width={160} height={56}>
      <div
        ref={slotRef}
        xmlns="http://www.w3.org/1999/xhtml"
        className={`resistor-slot ${drag?.over ? "hot" : ""} ${
          placed != null ? "filled" : ""
        } ${revealed ? (ok ? "ok" : "bad") : ""}`}
      >
        {placed != null ? filled : empty}
      </div>
    </foreignObject>
  );
}

function WireGroup({ children }) {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </g>
  );
}

export default function IndDragBoard({
  question,
  placed,
  drag,
  revealed,
  ok,
  slotRef,
}) {
  const filled = indDragLabel(question, placed);
  if (question.kind === "tpos") {
    const top = 110;
    return (
      <Frame label="Current after t>0">
        <text x={280} y={32} textAnchor="middle" className="board-title">
          t &gt; 0
        </text>
        <WireGroup>
          <path d="M48 200 V110" />
          <Battery x={48} y={top} />
          <path d="M120 110 H128" />
          <Resistor x={128} y={top} />
          <path d="M240 110 H248" />
          <Inductor x={248} y={top} />
          <path d="M368 110 H500 V200 H48" />
        </WireGroup>
        <text x={76} y={154} textAnchor="middle" className="circuit-part">
          {question.volts} V
        </text>
        <text x={184} y={154} textAnchor="middle" className="circuit-part">
          {question.rOhm} Ω
        </text>
        <text x={308} y={154} textAnchor="middle" className="circuit-part">
          L
        </text>
        <DropSlot
          slotRef={slotRef}
          drag={drag}
          placed={placed}
          revealed={revealed}
          ok={ok}
          empty="drop i"
          filled={filled}
          x={200}
          y={226}
        />
      </Frame>
    );
  }

  const series = question.kind === "series";
  return (
    <Frame label={series ? "Series inductors" : "Parallel inductors"}>
      <text x={140} y={32} textAnchor="middle" className="board-title">
        {series ? "Series" : "Parallel"}
      </text>
      {series ? (
        <WireGroup>
          <path d="M16 186 V100 H16" />
          <Inductor x={16} y={100} />
          <Inductor x={136} y={100} />
          <path d="M256 100 H268 V186 H16" />
        </WireGroup>
      ) : (
        <WireGroup>
          <path d="M36 80 H48" />
          <Inductor x={48} y={80} />
          <path d="M168 80 H244 V196 H168" />
          <Inductor x={48} y={196} />
          <path d="M48 196 H36 V80" />
        </WireGroup>
      )}
      <text
        x={series ? 76 : 108}
        y={series ? 144 : 124}
        textAnchor="middle"
        className="circuit-part"
      >
        {question.l1} mH
      </text>
      <text
        x={series ? 196 : 108}
        y={series ? 144 : 168}
        textAnchor="middle"
        className="circuit-part"
      >
        {question.l2} mH
      </text>
      <Arrow x1={278} y={140} x2={340} />
      <text x={440} y={92} textAnchor="middle" className="board-step">
        Leq
      </text>
      <DropSlot
        slotRef={slotRef}
        drag={drag}
        placed={placed}
        revealed={revealed}
        ok={ok}
        empty="drop Leq"
        filled={filled}
      />
    </Frame>
  );
}
