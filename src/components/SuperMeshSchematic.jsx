import MeshLoop from "./MeshLoop";

function hot(highlight, id) {
  if (highlight === "all") return "hot";
  if (highlight === "supermesh" && (id === "supermesh" || id === "kvl" || id === "r")) {
    return "hot";
  }
  return highlight === id ? "hot" : "";
}

function resH(cx, y, xLeft, xRight) {
  const w = 24;
  const h = 8;
  return `M${xLeft} ${y} H${cx - w / 2} M${cx - w / 2} ${y - h / 2} H${cx + w / 2} V${y + h / 2} H${cx - w / 2} V${y - h / 2} M${cx + w / 2} ${y} H${xRight}`;
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

function CurrentSource({ x, y1, y2, cls, amps }) {
  const mid = (y1 + y2) / 2;
  return (
    <>
      <path className={cls} d={`M${x} ${y1} V${mid - 22}`} />
      <circle className={cls} cx={x} cy={mid} r="20" />
      <path className={cls} d={`M${x} ${mid + 12} V${mid - 12}`} />
      <polygon
        className={cls}
        points={`${x},${mid - 14} ${x - 7},${mid - 2} ${x + 7},${mid - 2}`}
        fill="currentColor"
        stroke="none"
      />
      <path className={cls} d={`M${x} ${mid + 22} V${y2}`} />
      <text
        x={x}
        y={y2 + 18}
        textAnchor="middle"
        className={`circuit-label thev-tag ${cls}`}
        fill="currentColor"
        stroke="none"
      >
        {amps} A down
      </text>
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
const LEFT = 90;
const SHARED = 280;
const RIGHT = 470;
const R1_MID = (LEFT + 40 + SHARED) / 2;
const R2_MID = (SHARED + RIGHT) / 2;

export default function SuperMeshSchematic({ highlight = "all" }) {
  const showOuter =
    highlight === "supermesh" || highlight === "kvl" || highlight === "r";
  const showInner = !showOuter;

  return (
    <svg
      className="circuit-svg lab-teach"
      viewBox="0 0 560 300"
      role="img"
      aria-label="Supermesh circuit: 12 volt source, two 4 ohm resistors, 1 amp current source in the shared branch"
    >
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
        <Battery x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "i1")} />
        <path className={hot(highlight, "i1")} d={`M${LEFT} ${TOP} H${LEFT + 40}`} />
        <path
          className={`${hot(highlight, "i1")} ${hot(highlight, "r")}`}
          d={resH(R1_MID, TOP, LEFT + 40, SHARED)}
        />
        <path
          className={`${hot(highlight, "i2")} ${hot(highlight, "r")}`}
          d={resH(R2_MID, TOP, SHARED, RIGHT)}
        />
        <path className={hot(highlight, "supermesh")} d={`M${LEFT} ${BOT} H${RIGHT}`} />
        <CurrentSource
          x={SHARED}
          y1={TOP}
          y2={BOT}
          cls={hot(highlight, "isrc")}
          amps={1}
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
      {showOuter ? (
        <MeshLoop
          x1={LEFT + 18}
          y1={TOP + 18}
          x2={RIGHT - 18}
          y2={BOT - 18}
          cls={hot(highlight, "supermesh")}
          label="supermesh"
          caption="skip the source"
          labelOffsetY={-62}
        />
      ) : null}
      {showInner ? (
        <>
          <MeshLoop
            x1={LEFT + 36}
            y1={TOP + 36}
            x2={SHARED - 32}
            y2={BOT - 32}
            cls={hot(highlight, "i1")}
            label="I1"
            caption="clockwise"
          />
          <MeshLoop
            x1={SHARED + 32}
            y1={TOP + 36}
            x2={RIGHT - 32}
            y2={BOT - 32}
            cls={hot(highlight, "i2")}
            label="I2"
            caption="clockwise"
          />
        </>
      ) : null}
      <Dot x={LEFT} y={TOP} cls="" />
      <Dot x={LEFT} y={BOT} cls="" />
      <Dot x={SHARED} y={TOP} cls={hot(highlight, "isrc")} big />
      <Dot x={SHARED} y={BOT} cls="" />
      <Dot x={RIGHT} y={TOP} cls="" />
      <Dot x={RIGHT} y={BOT} cls="" />
    </svg>
  );
}
