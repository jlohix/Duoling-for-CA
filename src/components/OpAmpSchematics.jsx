const R1X = 153;
const RFX = 384;
const MID = 132;
const FEED = 48;
const RGX = 248;

export function hot(highlight, id) {
  if (highlight === "all") return "hot";
  return highlight === id ? "hot" : "";
}

export function resH(cx, y, xLeft, xRight) {
  const w = 24;
  const h = 8;
  return `M${xLeft} ${y} H${cx - w / 2} M${cx - w / 2} ${y - h / 2} H${cx + w / 2} V${y + h / 2} H${cx - w / 2} V${y - h / 2} M${cx + w / 2} ${y} H${xRight}`;
}

function resV(x, cy, yTop, yBot) {
  const w = 8;
  const h = 24;
  return `M${x} ${yTop} V${cy - h / 2} M${x - w / 2} ${cy - h / 2} H${x + w / 2} V${cy + h / 2} H${x - w / 2} V${cy - h / 2} M${x} ${cy + h / 2} V${yBot}`;
}

function Ground({ x, y, cls }) {
  const gy = y + 48;
  return (
    <>
      <path className={cls} d={`M${x} ${y} V${gy}`} />
      <path className={cls} d={`M${x - 18} ${gy} H${x + 18}`} />
      <path className={cls} d={`M${x - 12} ${gy + 8} H${x + 12}`} />
      <path className={cls} d={`M${x - 6} ${gy + 16} H${x + 6}`} />
    </>
  );
}

function RfWires({ highlight, showRf, fromY }) {
  return (
    <>
      <path className={hot(highlight, "rf")} d={`M${RGX} ${fromY} V${FEED}`} />
      {showRf ? (
        <path
          className={hot(highlight, "rf")}
          d={resH(RFX, FEED, RGX, 520)}
        />
      ) : (
        <path
          className={hot(highlight, "rf")}
          d={`M${RGX} ${FEED} H${RFX - 16} M${RFX + 16} ${FEED} H520`}
        />
      )}
      <path className={hot(highlight, "rf")} d="M520 48 V132" />
    </>
  );
}

function RfLabel({ practice, placed, highlight, drag, revealed, ok, slotRef }) {
  return (
    <>
      <text
        x={RFX}
        y={FEED - 16}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "rf")}`}
      >
        {practice && placed != null ? `${placed} kΩ` : "Rf"}
      </text>
      {practice ? (
        <foreignObject
          x={RFX - 16}
          y={FEED - 8}
          width="32"
          height="16"
          overflow="hidden"
        >
          <div
            ref={slotRef}
            xmlns="http://www.w3.org/1999/xhtml"
            className={`resistor-slot schematic-only ${
              drag?.over ? "hot" : ""
            } ${placed != null ? "filled" : ""} ${
              revealed ? (ok ? "ok" : "bad") : ""
            }`}
          />
        </foreignObject>
      ) : null}
    </>
  );
}

export function InvertingSchematic({
  highlight,
  question,
  placed,
  drag,
  revealed,
  ok,
  practice,
  slotRef,
}) {
  const showRf = !practice || placed != null;
  const r1Label = question ? `${question.r1} kΩ` : "R1";

  return (
    <svg
      className="circuit-svg opamp-svg"
      viewBox="0 0 560 280"
      role="img"
      aria-label="Inverting op-amp: R1 into the minus pin, Rf from output back to that pin, plus pin grounded"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path className={hot(highlight, "r1")} d={resH(R1X, MID, 70, 248)} />
        <path className={hot(highlight, "minus")} d="M248 132 V100 H300" />
        <path d="M300 72 L300 192 L436 132 Z" />
        <path className={hot(highlight, "out")} d="M436 132 H520" />
        <RfWires highlight={highlight} showRf={showRf} fromY={132} />
        <Ground x={300} y={176} cls={hot(highlight, "gnd")} />
      </g>
      <text x="308" y="108" className="circuit-label">
        −
      </text>
      <text x="308" y="178" className="circuit-label">
        +
      </text>
      <text x="24" y="126" className="circuit-label">
        vi
      </text>
      <text
        x={R1X}
        y={MID - 20}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "r1")}`}
      >
        {r1Label}
      </text>
      <RfLabel
        practice={practice}
        placed={placed}
        highlight={highlight}
        drag={drag}
        revealed={revealed}
        ok={ok}
        slotRef={slotRef}
      />
      <text x="528" y="126" className={`circuit-label ${hot(highlight, "out")}`}>
        vo
      </text>
      <text
        x="198"
        y="158"
        className={`circuit-label ${hot(highlight, "minus")}`}
      >
        v−
      </text>
      <circle
        cx="300"
        cy="176"
        r="4"
        fill="currentColor"
        className={hot(highlight, "gnd")}
      />
      <circle cx="70" cy="132" r="3.5" fill="currentColor" />
      <circle
        cx="248"
        cy="132"
        r="4"
        fill="currentColor"
        className={hot(highlight, "minus")}
      />
      <circle cx="520" cy="132" r="3.5" fill="currentColor" />
    </svg>
  );
}

export function NonInvertingSchematic({
  highlight,
  question,
  placed,
  drag,
  revealed,
  ok,
  practice,
  slotRef,
}) {
  const showRf = !practice || placed != null;
  const rgLabel = question ? `${question.rg} kΩ` : "Rg";

  return (
    <svg
      className="circuit-svg opamp-svg"
      viewBox="0 0 560 248"
      role="img"
      aria-label="Non-inverting op-amp: vi into the plus pin, Rg to ground, Rf from output to the minus pin"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path className={hot(highlight, "plus")} d="M70 176 H300" />
        <path d="M300 72 L300 192 L436 132 Z" />
        <path className={hot(highlight, "minus")} d="M248 100 H300" />
        <path
          className={hot(highlight, "rg")}
          d={resV(RGX, 126, 100, 148)}
        />
        <path className={hot(highlight, "gnd")} d={`M${RGX - 14} 148 H${RGX + 14}`} />
        <path className={hot(highlight, "gnd")} d={`M${RGX - 9} 156 H${RGX + 9}`} />
        <path className={hot(highlight, "gnd")} d={`M${RGX - 4} 164 H${RGX + 4}`} />
        <path className={hot(highlight, "out")} d="M436 132 H520" />
        <RfWires highlight={highlight} showRf={showRf} fromY={100} />
      </g>
      <text x="308" y="108" className="circuit-label">
        −
      </text>
      <text x="308" y="178" className="circuit-label">
        +
      </text>
      <text x="24" y="170" className="circuit-label">
        vi
      </text>
      <text
        x={RGX - 16}
        y="130"
        textAnchor="end"
        className={`circuit-label thev-tag ${hot(highlight, "rg")}`}
      >
        {rgLabel}
      </text>
      <RfLabel
        practice={practice}
        placed={placed}
        highlight={highlight}
        drag={drag}
        revealed={revealed}
        ok={ok}
        slotRef={slotRef}
      />
      <text x="528" y="126" className={`circuit-label ${hot(highlight, "out")}`}>
        vo
      </text>
      <text
        x="198"
        y="92"
        className={`circuit-label ${hot(highlight, "minus")}`}
      >
        v−
      </text>
      <circle cx="70" cy="176" r="3.5" fill="currentColor" />
      <circle
        cx="248"
        cy="100"
        r="4"
        fill="currentColor"
        className={hot(highlight, "minus")}
      />
      <circle
        cx="300"
        cy="176"
        r="4"
        fill="currentColor"
        className={hot(highlight, "plus")}
      />
      <circle cx="520" cy="132" r="3.5" fill="currentColor" />
    </svg>
  );
}
