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

export default function DividerSchematic({
  highlight = "all",
  view = "vdiv",
}) {
  if (view === "idiv") {
    const r1 = 260;
    const r2 = 410;
    const end = 470;
    return (
      <svg
        className="circuit-svg lab-teach"
        viewBox="0 0 560 280"
        role="img"
        aria-label="Current divider: 12 volt source, 4 ohm and 12 ohm in parallel"
      >
        <g transform="translate(40 0)">
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
          <Battery x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "is")} />
          <path className={hot(highlight, "is")} d={`M${LEFT} ${TOP} H${end}`} />
          <path d={`M${LEFT} ${BOT} H${end}`} />
          <path
            className={hot(highlight, "r1")}
            d={resV(r1, MID, TOP, BOT)}
          />
          <path
            className={hot(highlight, "r2")}
            d={resV(r2, MID, TOP, BOT)}
          />
        </g>
        <text x="24" y="150" className={`circuit-label ${hot(highlight, "is")}`}>
          12 V
        </text>
        <text x="122" y="134" className="circuit-label">
          +
        </text>
        <text x="122" y="170" className="circuit-label">
          −
        </text>
        <text
          x={r1 + 18}
          y={MID + 6}
          className={`circuit-label thev-tag ${hot(highlight, "r1")}`}
        >
          4 Ω
        </text>
        <text
          x={r2 + 18}
          y={MID + 6}
          className={`circuit-label thev-tag ${hot(highlight, "r2")}`}
        >
          12 Ω
        </text>
        <text
          x={r1}
          y={BOT + 20}
          textAnchor="middle"
          className={`circuit-label thev-tag ${hot(highlight, "r1")}`}
        >
          3 A
        </text>
        <text
          x={r2}
          y={BOT + 20}
          textAnchor="middle"
          className={`circuit-label thev-tag ${hot(highlight, "r2")}`}
        >
          1 A
        </text>
        <text
          x={LEFT + 70}
          y={BOT + 20}
          className={`circuit-label thev-tag ${hot(highlight, "is")}`}
        >
          Is = 4 A
        </text>
        <Dot x={LEFT} y={TOP} />
        <Dot x={LEFT} y={BOT} />
        <Dot x={r1} y={TOP} cls={hot(highlight, "r1")} big />
        <Dot x={r1} y={BOT} />
        <Dot x={r2} y={TOP} cls={hot(highlight, "r2")} big />
        <Dot x={r2} y={BOT} />
        <Dot x={end} y={TOP} />
        <Dot x={end} y={BOT} />
        </g>
      </svg>
    );
  }

  const r1Left = 150;
  const node = 290;
  const r1Mid = (r1Left + node) / 2;

  return (
    <svg
      className="circuit-svg lab-teach"
      viewBox="0 0 560 280"
      role="img"
      aria-label="Voltage divider: 12 volt source, 4 ohm then 8 ohm to ground"
    >
      <g transform="translate(110 0)">
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
        <Battery x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "vs")} />
        <path className={hot(highlight, "r1")} d={`M${LEFT} ${TOP} H${r1Left}`} />
        <path
          className={hot(highlight, "r1")}
          d={resH(r1Mid, TOP, r1Left, node)}
        />
        <path d={`M${LEFT} ${BOT} H${node}`} />
        <path
          className={hot(highlight, "r2") || hot(highlight, "vo")}
          d={resV(node, MID, TOP, BOT)}
        />
      </g>
      <text x="24" y="150" className={`circuit-label ${hot(highlight, "vs")}`}>
        12 V
      </text>
      <text x="122" y="134" className="circuit-label">
        +
      </text>
      <text x="122" y="170" className="circuit-label">
        −
      </text>
      <text
        x={r1Mid}
        y={TOP - 14}
        textAnchor="middle"
        className={`circuit-label thev-tag ${hot(highlight, "r1")}`}
      >
        R1 4 Ω
      </text>
      <text
        x={node + 18}
        y={MID + 6}
        className={`circuit-label thev-tag ${hot(highlight, "r2")}`}
      >
        R2 8 Ω
      </text>
      <text
        x={node + 12}
        y={TOP - 14}
        className={`circuit-label thev-tag ${hot(highlight, "vo")}`}
      >
        Vo 8 V
      </text>
      <Dot x={LEFT} y={TOP} />
      <Dot x={LEFT} y={BOT} />
      <Dot x={node} y={TOP} cls={hot(highlight, "vo")} big />
      <Dot x={node} y={BOT} />
      </g>
    </svg>
  );
}
