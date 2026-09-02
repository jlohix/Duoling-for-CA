function hot(highlight, id) {
  if (highlight === "all") return "hot";
  return highlight === id ? "hot" : "";
}

function resH(cx, y, xLeft, xRight) {
  const w = 24;
  const h = 8;
  return `M${xLeft} ${y} H${cx - w / 2} M${cx - w / 2} ${y - h / 2} H${cx + w / 2} V${y + h / 2} H${cx - w / 2} V${y - h / 2} M${cx + w / 2} ${y} H${xRight}`;
}

function resV(x, cy, yTop, yBot) {
  const w = 8;
  const h = 24;
  return `M${x} ${yTop} V${cy - h / 2} M${x - w / 2} ${cy - h / 2} H${x + w / 2} V${cy + h / 2} H${x - w / 2} V${cy - h / 2} M${x} ${cy + h / 2} V${yBot}`;
}

function Battery({ x, y1, y2, cls }) {
  const mid = (y1 + y2) / 2;
  return (
    <>
      <path className={cls} d={`M${x} ${y1} V${mid - 18}`} />
      <path className={cls} d={`M${x} ${mid + 22} V${y2}`} />
      <line
        className={cls}
        x1={x - 22}
        y1={mid - 10}
        x2={x + 22}
        y2={mid - 10}
        strokeWidth="4"
      />
      <line
        className={cls}
        x1={x - 12}
        y1={mid + 14}
        x2={x + 12}
        y2={mid + 14}
        strokeWidth="3"
      />
    </>
  );
}

function Dot({ x, y, cls, big = false }) {
  return (
    <circle className={cls} cx={x} cy={y} r={big ? 5 : 3.5} fill="currentColor" />
  );
}

const TOP = 50;
const BOT = 230;
const MID = (TOP + BOT) / 2;
const LEFT = 90;
const R1_LEFT = 150;
const NODE = 290;
const KNOWN = 370;
const GAP = 470;
const R1_MID = (R1_LEFT + NODE) / 2;

export default function NodalSchematic({ highlight = "all" }) {
  return (
    <svg
      className="circuit-svg lab-teach"
      viewBox="0 0 560 280"
      role="img"
      aria-label="Nodal circuit: 18 volt source, 6 volt node, three resistors"
    >
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
        <Battery x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "ohm")} />
        <path className={hot(highlight, "ohm")} d={`M${LEFT} ${TOP} H${R1_LEFT}`} />
        <path
          className={hot(highlight, "ohm")}
          d={resH(R1_MID, TOP, R1_LEFT, NODE)}
        />
        <path className={hot(highlight, "node")} d={`M${NODE} ${TOP} H${GAP}`} />
        <path className={hot(highlight, "all")} d={`M${LEFT} ${BOT} H${GAP}`} />
        <path
          className={hot(highlight, "kcl")}
          d={resV(KNOWN, MID, TOP, BOT)}
        />
        <path
          className={`${hot(highlight, "kcl")} ${hot(highlight, "r")}`}
          d={resV(GAP, MID, TOP, BOT)}
        />
      </g>
      <text x="24" y="150" className={`circuit-label ${hot(highlight, "ohm")}`}>
        18 V
      </text>
      <text x="122" y="134" className="circuit-label">
        +
      </text>
      <text x="122" y="170" className="circuit-label">
        −
      </text>
      <text
        x={R1_MID}
        y={TOP - 28}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "ohm")}`}
      >
        4 Ω
      </text>
      <g fill="currentColor" stroke="currentColor">
        <line
          x1={LEFT + 28}
          y1={TOP - 18}
          x2={R1_LEFT - 12}
          y2={TOP - 18}
          strokeWidth="2.5"
        />
        <polygon
          points={`${R1_LEFT - 2},${TOP - 18} ${R1_LEFT - 14},${TOP - 24} ${R1_LEFT - 14},${TOP - 12}`}
          stroke="none"
        />
        <text
          x={(LEFT + 28 + R1_LEFT - 2) / 2}
          y={TOP - 26}
          textAnchor="middle"
          className={`circuit-label thev-tag ${hot(highlight, "ohm")}`}
          fill="currentColor"
          stroke="none"
        >
          Is
        </text>
      </g>
      <text
        x={NODE + 8}
        y="40"
        className={`circuit-label ${hot(highlight, "node")}`}
      >
        6 V
      </text>
      <text
        x={KNOWN - 52}
        y={MID + 6}
        className={`circuit-label thev-tag ${hot(highlight, "kcl")}`}
      >
        3 Ω
      </text>
      <text
        x={GAP + 18}
        y={MID + 6}
        className={`circuit-label thev-tag ${hot(highlight, "r")}`}
      >
        R 6 Ω
      </text>
      <Dot x={LEFT} y={TOP} cls="" />
      <Dot x={LEFT} y={BOT} cls="" />
      <Dot x={NODE} y={TOP} cls={hot(highlight, "node")} big />
      <Dot x={KNOWN} y={TOP} cls={hot(highlight, "kcl")} big />
      <Dot x={KNOWN} y={BOT} cls="" />
      <Dot x={GAP} y={TOP} cls={hot(highlight, "r")} big />
      <Dot x={GAP} y={BOT} cls="" />
    </svg>
  );
}
