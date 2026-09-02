function hot(highlight, id) {
  if (highlight === "all") return "hot";
  return highlight === id ? "hot" : "";
}

function Sub({ base, sub }) {
  return (
    <>
      {base}
      <tspan dy="6" fontSize="13">
        {sub}
      </tspan>
    </>
  );
}

function resH(cx, y, xLeft, xRight) {
  const w = 28;
  const h = 10;
  return `M${xLeft} ${y} H${cx - w / 2} M${cx - w / 2} ${y - h / 2} H${cx + w / 2} V${y + h / 2} H${cx - w / 2} V${y - h / 2} M${cx + w / 2} ${y} H${xRight}`;
}

function resV(x, cy, yTop, yBot) {
  const w = 10;
  const h = 28;
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

function Diamond({ x, y1, y2, kind, cls }) {
  const mid = (y1 + y2) / 2;
  const s = 28;
  const voltage = kind === "v";
  return (
    <>
      <path className={cls} d={`M${x} ${y1} V${mid - s}`} />
      <path
        className={cls}
        d={`M${x} ${mid - s} L${x + s} ${mid} L${x} ${mid + s} L${x - s} ${mid} Z`}
      />
      {voltage ? (
        <>
          <text
            x={x}
            y={mid - 8}
            textAnchor="middle"
            className="circuit-label"
            fill="currentColor"
            stroke="none"
          >
            +
          </text>
          <text
            x={x}
            y={mid + 18}
            textAnchor="middle"
            className="circuit-label"
            fill="currentColor"
            stroke="none"
          >
            −
          </text>
        </>
      ) : (
        <g fill="currentColor" stroke="currentColor" strokeWidth="0">
          <line
            x1={x}
            y1={mid + 12}
            x2={x}
            y2={mid - 8}
            strokeWidth="3"
          />
          <polygon
            points={`${x},${mid - 16} ${x - 9},${mid} ${x + 9},${mid}`}
          />
        </g>
      )}
      <path className={cls} d={`M${x} ${mid + s} V${y2}`} />
    </>
  );
}

function Dot({ x, y, cls }) {
  return (
    <circle className={cls} cx={x} cy={y} r="3.5" fill="currentColor" />
  );
}

function TypeCard({ x, y, kind, title, sense, makes, gain }) {
  const s = 26;
  const voltage = kind === "v";
  return (
    <g>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        d={`M${x} ${y - s} L${x + s} ${y} L${x} ${y + s} L${x - s} ${y} Z`}
      />
      {voltage ? (
        <>
          <text
            x={x}
            y={y - 6}
            textAnchor="middle"
            className="circuit-label"
            fill="currentColor"
          >
            +
          </text>
          <text
            x={x}
            y={y + 16}
            textAnchor="middle"
            className="circuit-label"
            fill="currentColor"
          >
            −
          </text>
        </>
      ) : (
        <g fill="currentColor">
          <line
            x1={x}
            y1={y + 10}
            x2={x}
            y2={y - 6}
            stroke="currentColor"
            strokeWidth="3"
          />
          <polygon points={`${x},${y - 14} ${x - 8},${y} ${x + 8},${y}`} />
        </g>
      )}
      <text
        x={x + 40}
        y={y - 12}
        className="circuit-label"
        fill="currentColor"
      >
        {title}
      </text>
      <text
        x={x + 40}
        y={y + 10}
        className="circuit-label"
        fill="currentColor"
      >
        {gain}
      </text>
      <text
        x={x + 40}
        y={y + 32}
        className="circuit-label"
        fill="currentColor"
        fontSize="14"
      >
        {sense} → {makes}
      </text>
    </g>
  );
}

const TOP = 48;
const BOT = 232;
const MID = (TOP + BOT) / 2;
const LEFT = 70;
const R_MID = 210;
const RIGHT = 340;

function VcvsLoop({ killed, highlight, showI }) {
  return (
    <g transform="translate(70 0)">
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
        {killed ? (
          <path className={hot(highlight, "kill")} d={`M${LEFT} ${TOP} V${BOT}`} />
        ) : (
          <Battery x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "src")} />
        )}
        <path
          className={hot(highlight, "r")}
          d={resH(R_MID, TOP, LEFT, RIGHT)}
        />
        <path d={`M${LEFT} ${BOT} H${RIGHT}`} />
        <Diamond
          x={RIGHT}
          y1={TOP}
          y2={BOT}
          kind="v"
          cls={hot(highlight, "dep")}
        />
      </g>
      {killed ? (
        <text
          x={LEFT - 8}
          y={MID + 6}
          textAnchor="end"
          className={`circuit-label ${hot(highlight, "kill")}`}
          fill="currentColor"
        >
          short
        </text>
      ) : (
        <text
          x={LEFT - 8}
          y={MID + 6}
          textAnchor="end"
          className={`circuit-label ${hot(highlight, "src")}`}
          fill="currentColor"
        >
          12 V
        </text>
      )}
      <text
        x={R_MID}
        y={TOP - 18}
        textAnchor="middle"
        className={`circuit-label ${hot(highlight, "r")}`}
        fill="currentColor"
      >
        2 Ω
      </text>
      <text
        x={R_MID}
        y={TOP + 36}
        textAnchor="middle"
        className={`circuit-label ${hot(highlight, "ctrl")}`}
        fill="currentColor"
      >
        <Sub base="v" sub="x" />
      </text>
      <text
        x={RIGHT - 44}
        y={MID + 8}
        textAnchor="end"
        className={`circuit-label ${hot(highlight, "dep")}`}
        fill="currentColor"
      >
        2
        <Sub base="v" sub="x" />
      </text>
      {showI ? (
        <text
          x={(LEFT + RIGHT) / 2}
          y={BOT - 18}
          textAnchor="middle"
          className="circuit-label"
          fill="currentColor"
        >
          I = 2 A
        </text>
      ) : null}
      <Dot x={LEFT} y={TOP} cls={hot(highlight, "src")} />
      <Dot x={LEFT} y={BOT} cls={hot(highlight, "src")} />
      <Dot x={RIGHT} y={TOP} cls={hot(highlight, "dep")} />
      <Dot x={RIGHT} y={BOT} cls={hot(highlight, "dep")} />
    </g>
  );
}

export default function DependentSchematic({
  highlight = "all",
  view = "types",
  question = null,
}) {
  const mode = question?.shape || view || "types";

  if (mode === "types") {
    return (
      <svg
        className="circuit-svg lab-teach"
        viewBox="0 0 560 300"
        role="img"
        aria-label="Four dependent source types as diamonds"
      >
        <TypeCard
          x={70}
          y={88}
          kind="v"
          title="VCVS"
          gain="μ vx"
          sense="senses V"
          makes="makes V"
        />
        <TypeCard
          x={320}
          y={88}
          kind="i"
          title="VCCS"
          gain="g vx"
          sense="senses V"
          makes="makes I"
        />
        <TypeCard
          x={70}
          y={210}
          kind="v"
          title="CCVS"
          gain="r ix"
          sense="senses I"
          makes="makes V"
        />
        <TypeCard
          x={320}
          y={210}
          kind="i"
          title="CCCS"
          gain="β ix"
          sense="senses I"
          makes="makes I"
        />
      </svg>
    );
  }

  if (mode === "vccs") {
    const node = 250;
    const gap = 400;
    return (
      <svg
        className="circuit-svg lab-teach"
        viewBox="0 0 560 280"
        role="img"
        aria-label="Voltage-controlled current source"
      >
        <g transform="translate(50 0)">
          <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
            <Battery x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "src")} />
            <path
              className={hot(highlight, "r")}
              d={resH((LEFT + node) / 2, TOP, LEFT, node)}
            />
            <path d={`M${node} ${TOP} H${gap}`} />
            <path d={`M${LEFT} ${BOT} H${gap}`} />
            <path
              className={hot(highlight, "r")}
              d={resV(gap, MID, TOP, BOT)}
            />
            <Diamond
              x={node}
              y1={TOP}
              y2={BOT}
              kind="i"
              cls={hot(highlight, "dep")}
            />
          </g>
          <text
            x={LEFT - 8}
            y={MID + 6}
            textAnchor="end"
            className={`circuit-label ${hot(highlight, "src")}`}
            fill="currentColor"
          >
            12 V
          </text>
          <text
            x={(LEFT + node) / 2}
            y={TOP - 18}
            textAnchor="middle"
            className={`circuit-label ${hot(highlight, "r")}`}
            fill="currentColor"
          >
            4 Ω
          </text>
          <text
            x={(LEFT + node) / 2}
            y={TOP + 36}
            textAnchor="middle"
            className={`circuit-label ${hot(highlight, "ctrl")}`}
            fill="currentColor"
          >
            <Sub base="v" sub="x" />
          </text>
          <text
            x={node - 40}
            y={MID + 8}
            textAnchor="end"
            className={`circuit-label ${hot(highlight, "dep")}`}
            fill="currentColor"
          >
            0.5
            <Sub base="v" sub="x" />
          </text>
          <text
            x={gap + 24}
            y={MID + 8}
            className={`circuit-label ${hot(highlight, "r")}`}
            fill="currentColor"
          >
            6 Ω
          </text>
          <Dot x={LEFT} y={TOP} cls="" />
          <Dot x={LEFT} y={BOT} cls="" />
          <Dot x={node} y={TOP} cls={hot(highlight, "dep")} />
          <Dot x={gap} y={TOP} cls="" />
          <Dot x={gap} y={BOT} cls="" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      className="circuit-svg lab-teach"
      viewBox="0 0 560 280"
      role="img"
      aria-label="Voltage-controlled voltage source in a loop"
    >
      <VcvsLoop
        killed={mode === "keep"}
        highlight={highlight}
        showI={mode === "solve" || question?.showI}
      />
    </svg>
  );
}
