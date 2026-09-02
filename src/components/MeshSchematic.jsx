import MeshLoop from "./MeshLoop";

function hot(highlight, id) {
  if (highlight === "all") return "hot";
  if (
    highlight === "kvl" &&
    (id === "i1" || id === "i2" || id === "shared" || id === "kvl")
  ) {
    return "hot";
  }
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
const SHARED = 280;
const RIGHT = 470;
const R1_MID = (LEFT + 40 + SHARED) / 2;
const R2_MID = (SHARED + RIGHT) / 2;

export default function MeshSchematic({ highlight = "all" }) {
  return (
    <svg
      className="circuit-svg lab-teach"
      viewBox="0 0 560 280"
      role="img"
      aria-label="Two-mesh circuit: 12 volt source, three 4 ohm resistors"
    >
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
        <Battery x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "i1")} />
        <path className={hot(highlight, "i1")} d={`M${LEFT} ${TOP} H${LEFT + 40}`} />
        <path
          className={`${hot(highlight, "i1")} ${hot(highlight, "kvl")}`}
          d={resH(R1_MID, TOP, LEFT + 40, SHARED)}
        />
        <path
          className={hot(highlight, "i2")}
          d={resH(R2_MID, TOP, SHARED, RIGHT)}
        />
        <path className={hot(highlight, "all")} d={`M${LEFT} ${BOT} H${RIGHT}`} />
        <path
          className={`${hot(highlight, "shared")} ${hot(highlight, "r")}`}
          d={resV(SHARED, MID, TOP, BOT)}
        />
        <path className={hot(highlight, "i2")} d={`M${RIGHT} ${TOP} V${BOT}`} />
      </g>
      <text x="18" y="150" className={`circuit-label ${hot(highlight, "i1")}`}>
        12 V
      </text>
      <text x="122" y="134" className="circuit-label">
        +
      </text>
      <text x="122" y="170" className="circuit-label">
        −
      </text>
      <text
        x={R1_MID}
        y={TOP - 14}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "i1")}`}
      >
        4 Ω
      </text>
      <text
        x={R2_MID}
        y={TOP - 14}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "i2")}`}
      >
        4 Ω
      </text>
      <text
        x={SHARED + 16}
        y={MID + 5}
        className={`circuit-label thev-tag ${hot(highlight, "shared")} ${hot(highlight, "r")}`}
      >
        4 Ω
      </text>
      <MeshLoop
        x1={LEFT + 36}
        y1={TOP + 34}
        x2={SHARED - 22}
        y2={BOT - 32}
        cls={hot(highlight, "i1")}
        label="I1"
        caption="clockwise"
      />
      <MeshLoop
        x1={SHARED + 22}
        y1={TOP + 34}
        x2={RIGHT - 32}
        y2={BOT - 32}
        cls={hot(highlight, "i2")}
        label="I2"
        caption="clockwise"
      />
      <Dot x={LEFT} y={TOP} cls="" />
      <Dot x={LEFT} y={BOT} cls="" />
      <Dot x={SHARED} y={TOP} cls={hot(highlight, "shared")} big />
      <Dot x={SHARED} y={BOT} cls="" />
      <Dot x={RIGHT} y={TOP} cls="" />
      <Dot x={RIGHT} y={BOT} cls="" />
    </svg>
  );
}
