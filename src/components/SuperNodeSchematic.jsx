function hot(highlight, id) {
  if (highlight === "all") return "hot";
  if (highlight === "sn" && (id === "sn" || id === "nodes" || id === "vs")) {
    return "hot";
  }
  if (highlight === "kcl" && (id === "kcl" || id === "sn" || id === "r")) {
    return "hot";
  }
  if (highlight === "nodes" && (id === "nodes" || id === "va" || id === "vb")) {
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

function HBattery({ x1, x2, y, cls }) {
  const mid = (x1 + x2) / 2;
  return (
    <>
      <path className={cls} d={`M${x1} ${y} H${mid - 18}`} />
      <line
        className={cls}
        x1={mid - 8}
        y1={y - 16}
        x2={mid - 8}
        y2={y + 16}
        strokeWidth="4"
      />
      <line
        className={cls}
        x1={mid + 8}
        y1={y - 10}
        x2={mid + 8}
        y2={y + 10}
        strokeWidth="3"
      />
      <path className={cls} d={`M${mid + 18} ${y} H${x2}`} />
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
const NA = 210;
const NB = 400;
const R1_LEFT = LEFT + 40;
const R1_MID = (R1_LEFT + NA) / 2;
const VS_MID = (NA + NB) / 2;

export default function SuperNodeSchematic({ highlight = "all" }) {
  const showBlob =
    highlight === "sn" || highlight === "kcl" || highlight === "r";

  return (
    <svg
      className="circuit-svg lab-teach"
      viewBox="0 0 560 300"
      role="img"
      aria-label="Supernode circuit: 12 volt source, two nodes joined by a 4 volt source, resistors to ground"
    >
      {showBlob ? (
        <rect
          className={hot(highlight, "sn")}
          x={NA - 28}
          y={TOP - 22}
          width={NB - NA + 56}
          height="48"
          rx="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="7 5"
        />
      ) : null}
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
        <Battery x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "kcl")} />
        <path className={hot(highlight, "kcl")} d={`M${LEFT} ${TOP} H${R1_LEFT}`} />
        <path
          className={`${hot(highlight, "kcl")} ${hot(highlight, "r")}`}
          d={resH(R1_MID, TOP, R1_LEFT, NA)}
        />
        <HBattery x1={NA} x2={NB} y={TOP} cls={hot(highlight, "vs")} />
        <path className={hot(highlight, "all")} d={`M${LEFT} ${BOT} H${NB}`} />
        <path
          className={`${hot(highlight, "kcl")} ${hot(highlight, "r")}`}
          d={resV(NA, MID, TOP, BOT)}
        />
        <path
          className={`${hot(highlight, "kcl")} ${hot(highlight, "r")}`}
          d={resV(NB, MID, TOP, BOT)}
        />
      </g>
      <text x="18" y="150" className="circuit-label">
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
        className={`circuit-label thev-tag ${hot(highlight, "kcl")}`}
      >
        2 Ω
      </text>
      <text
        x={VS_MID}
        y={TOP - 32}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "vs")}`}
      >
        4 V
      </text>
      <text
        x={VS_MID - 42}
        y={TOP - 32}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "vs")}`}
      >
        +
      </text>
      <text
        x={VS_MID + 42}
        y={TOP - 32}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "vs")}`}
      >
        −
      </text>
      <text
        x={NA}
        y={TOP - 14}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "nodes")}`}
      >
        Va 6 V
      </text>
      <text
        x={NB}
        y={TOP - 14}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "nodes")}`}
      >
        Vb 2 V
      </text>
      <text
        x={NA + 16}
        y={MID + 5}
        className={`circuit-label thev-tag ${hot(highlight, "kcl")}`}
      >
        3 Ω
      </text>
      <text
        x={NB + 16}
        y={MID + 5}
        className={`circuit-label thev-tag ${hot(highlight, "r")}`}
      >
        2 Ω
      </text>
      {showBlob ? (
        <text
          x={(NA + NB) / 2}
          y={TOP + 38}
          textAnchor="middle"
          className={`circuit-label thev-tag ${hot(highlight, "sn")}`}
        >
          supernode
        </text>
      ) : null}
      <Dot x={LEFT} y={TOP} cls="" />
      <Dot x={LEFT} y={BOT} cls="" />
      <Dot x={NA} y={TOP} cls={hot(highlight, "nodes")} big />
      <Dot x={NA} y={BOT} cls="" />
      <Dot x={NB} y={TOP} cls={hot(highlight, "nodes")} big />
      <Dot x={NB} y={BOT} cls="" />
    </svg>
  );
}
