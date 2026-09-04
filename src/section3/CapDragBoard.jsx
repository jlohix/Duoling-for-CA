import { Arrow, Battery, Capacitor, Frame, Resistor } from "../components/LabDraw";
import { capDragLabel } from "../data/capacitorLab";

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

export default function CapDragBoard({
  question,
  placed,
  drag,
  revealed,
  ok,
  slotRef,
}) {
  const filled = capDragLabel(question, placed);
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
          <path d="M240 110 H256" />
          <Capacitor x={256} y={top} />
          <path d="M330 110 H500 V200 H48" />
        </WireGroup>
        <text x={76} y={154} textAnchor="middle" className="circuit-part">
          {question.volts} V
        </text>
        <text x={184} y={154} textAnchor="middle" className="circuit-part">
          {question.rOhm} Ω
        </text>
        <text x={293} y={154} textAnchor="middle" className="circuit-part">
          C
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
    <Frame label={series ? "Series capacitors" : "Parallel capacitors"}>
      <text x={140} y={32} textAnchor="middle" className="board-title">
        {series ? "Series" : "Parallel"}
      </text>
      {series ? (
        <WireGroup>
          <path d="M36 186 V100 H40" />
          <Capacitor x={40} y={100} />
          <Capacitor x={114} y={100} />
          <path d="M188 100 H244 V186 H36" />
        </WireGroup>
      ) : (
        <WireGroup>
          <path d="M36 80 H93" />
          <Capacitor x={93} y={80} />
          <path d="M167 80 H244 V196 H167" />
          <Capacitor x={93} y={196} />
          <path d="M93 196 H36 V80" />
        </WireGroup>
      )}
      <text
        x={series ? 77 : 130}
        y={series ? 144 : 124}
        textAnchor="middle"
        className="circuit-part"
      >
        {question.c1} μF
      </text>
      <text
        x={series ? 151 : 130}
        y={series ? 144 : 168}
        textAnchor="middle"
        className="circuit-part"
      >
        {question.c2} μF
      </text>
      <Arrow x1={258} y={140} x2={332} />
      <text x={440} y={92} textAnchor="middle" className="board-step">
        Ceq
      </text>
      <DropSlot
        slotRef={slotRef}
        drag={drag}
        placed={placed}
        revealed={revealed}
        ok={ok}
        empty="drop Ceq"
        filled={filled}
      />
    </Frame>
  );
}
