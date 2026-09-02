function hot(highlight, id) {
  if (highlight === "all") return "hot";
  if (highlight === "kill" && (id === "left" || id === "right" || id === "kill")) {
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
const NODE = 290;
const RIGHT = 470;
const R1_LEFT = LEFT + 40;
const R1_MID = (R1_LEFT + NODE) / 2;
const R2_MID = (NODE + RIGHT) / 2;

export default function SuperpositionSchematic({
  highlight = "all",
  view = "both",
}) {
  const showLeft = view !== "right";
  const showRight = view !== "left";
  const nodeV = view === "both" ? "8 V" : "4 V";

  return (
    <svg
      className="circuit-svg lab-teach"
      viewBox="0 0 560 280"
      role="img"
      aria-label="Superposition circuit: two 12 volt sources and three 4 ohm resistors"
    >
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
        {showLeft ? (
          <Battery x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "left")} />
        ) : (
          <path className={hot(highlight, "kill")} d={`M${LEFT} ${TOP} V${BOT}`} />
        )}
        <path className={hot(highlight, "left")} d={`M${LEFT} ${TOP} H${R1_LEFT}`} />
        <path
          className={hot(highlight, "left")}
          d={resH(R1_MID, TOP, R1_LEFT, NODE)}
        />
        <path
          className={hot(highlight, "right")}
          d={resH(R2_MID, TOP, NODE, RIGHT)}
        />
        {showRight ? (
          <Battery x={RIGHT} y1={TOP} y2={BOT} cls={hot(highlight, "right")} />
        ) : (
          <path className={hot(highlight, "kill")} d={`M${RIGHT} ${TOP} V${BOT}`} />
        )}
        <path d={`M${LEFT} ${BOT} H${RIGHT}`} />
        <path
          className={`${hot(highlight, "r")}`}
          d={resV(NODE, MID, TOP, BOT)}
        />
      </g>
      {showLeft ? (
        <>
          <text x="18" y="150" className={`circuit-label ${hot(highlight, "left")}`}>
            12 V
          </text>
          <text x="122" y="134" className="circuit-label">
            +
          </text>
          <text x="122" y="170" className="circuit-label">
            −
          </text>
        </>
      ) : (
        <text x="18" y="150" className={`circuit-label ${hot(highlight, "kill")}`}>
          short
        </text>
      )}
      {showRight ? (
        <>
          <text
            x="500"
            y="150"
            className={`circuit-label ${hot(highlight, "right")}`}
          >
            12 V
          </text>
          <text x="432" y="134" className="circuit-label">
            +
          </text>
          <text x="432" y="170" className="circuit-label">
            −
          </text>
        </>
      ) : (
        <text
          x="500"
          y="150"
          className={`circuit-label ${hot(highlight, "kill")}`}
        >
          short
        </text>
      )}
      <text
        x={R1_MID}
        y={TOP - 14}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "left")}`}
      >
        4 Ω
      </text>
      <text
        x={R2_MID}
        y={TOP - 14}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "right")}`}
      >
        4 Ω
      </text>
      <text
        x={NODE + 16}
        y={MID + 5}
        className={`circuit-label thev-tag ${hot(highlight, "r")}`}
      >
        4 Ω
      </text>
      <text
        x={NODE + 18}
        y={TOP - 14}
        className={`circuit-label thev-tag ${hot(highlight, "r")}`}
      >
        {nodeV}
      </text>
      <Dot x={LEFT} y={TOP} cls="" />
      <Dot x={LEFT} y={BOT} cls="" />
      <Dot x={NODE} y={TOP} cls={hot(highlight, "r")} big />
      <Dot x={NODE} y={BOT} cls="" />
      <Dot x={RIGHT} y={TOP} cls="" />
      <Dot x={RIGHT} y={BOT} cls="" />
    </svg>
  );
}
