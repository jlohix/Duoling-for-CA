function Sub({ base, sub, rest = "" }) {
  return (
    <>
      {base}
      <tspan dy="5" fontSize="10">
        {sub}
      </tspan>
      {rest ? <tspan dy="-5">{rest}</tspan> : null}
    </>
  );
}

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
const JOIN = 290;
const LOAD = 360;
const RS_MID = (LEFT + JOIN) / 2;

export default function MaxPowerSchematic({
  highlight = "all",
  view = "loop",
  question = null,
}) {
  const volts = question?.volts ?? 12;
  const rs = question?.rs ?? 4;
  const matched = view === "match" || view === "pmax" || question?.shape === "match";
  const rl = question?.rl ?? (matched ? rs : null);

  return (
    <svg
      className="circuit-svg lab-teach"
      viewBox="0 0 560 280"
      role="img"
      aria-label="Source, series Rs, and load for maximum power"
    >
      <g transform="translate(80 0)">
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
          <Battery x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "src")} />
          <path
            className={hot(highlight, "rs")}
            d={resH(RS_MID, TOP, LEFT, JOIN)}
          />
          <path className={hot(highlight, "load")} d={`M${JOIN} ${TOP} H${LOAD}`} />
          <path className={hot(highlight, "src")} d={`M${LEFT} ${BOT} H${LOAD}`} />
          <path
            className={hot(highlight, "load")}
            d={resV(LOAD, MID, TOP, BOT)}
          />
        </g>
        <text
          x="24"
          y="150"
          className={`circuit-label ${hot(highlight, "src")}`}
        >
          {volts} V
        </text>
        <text
          x={RS_MID}
          y={TOP - 32}
          textAnchor="middle"
          className={`circuit-label thev-tag ${hot(highlight, "rs")}`}
        >
          <Sub base="R" sub="s" rest={` ${rs} Ω`} />
        </text>
        <text
          x={LOAD + 22}
          y={MID + 5}
          className={`circuit-label thev-tag ${hot(highlight, "load")}`}
        >
          {rl != null ? (
            <Sub base="R" sub="L" rest={` ${rl} Ω`} />
          ) : (
            <Sub base="R" sub="L" />
          )}
        </text>
        {view === "pmax" || question?.shape === "pmax" ? (
          <text
            x={(JOIN + LOAD) / 2}
            y={MID + 8}
            textAnchor="middle"
            className={`circuit-label ${hot(highlight, "p")}`}
          >
            Pmax
          </text>
        ) : (
          <text
            x={(JOIN + LOAD) / 2}
            y={MID + 8}
            textAnchor="middle"
            className={`circuit-label ${hot(highlight, "p")}`}
          >
            PL
          </text>
        )}
        <Dot x={LEFT} y={TOP} cls={hot(highlight, "src")} />
        <Dot x={LEFT} y={BOT} cls={hot(highlight, "src")} />
        <Dot x={LOAD} y={TOP} cls={hot(highlight, "load")} big />
        <Dot x={LOAD} y={BOT} cls={hot(highlight, "load")} big />
      </g>
    </svg>
  );
}
