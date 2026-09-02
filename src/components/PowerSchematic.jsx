function hot(highlight, id) {
  if (highlight === "all") return "hot";
  return highlight === id ? "hot" : "";
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

function Dot({ x, y, cls }) {
  return (
    <circle className={cls} cx={x} cy={y} r="3.5" fill="currentColor" />
  );
}

const TOP = 50;
const BOT = 230;
const MID = (TOP + BOT) / 2;
const LEFT = 90;
const RIGHT = 380;

export default function PowerSchematic({
  highlight = "all",
  view = "dc",
  question = null,
}) {
  const mode = question?.shape || view || "dc";
  const volts = question?.volts ?? 12;
  const amps = question?.amps ?? 2;
  const ohms = question?.ohms ?? 6;

  return (
    <svg
      className="circuit-svg lab-teach"
      viewBox="0 0 560 280"
      role="img"
      aria-label="DC loop for power"
    >
      <g transform="translate(90 0)">
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
          <Battery x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "src")} />
          <path className={hot(highlight, "i")} d={`M${LEFT} ${TOP} H${RIGHT}`} />
          <path d={`M${LEFT} ${BOT} H${RIGHT}`} />
          <path
            className={hot(highlight, "r")}
            d={resV(RIGHT, MID, TOP, BOT)}
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
          x={(LEFT + RIGHT) / 2}
          y={TOP - 16}
          textAnchor="middle"
          className={`circuit-label ${hot(highlight, "i")}`}
        >
          {amps} A
        </text>
        <text
          x={RIGHT + 22}
          y={MID + 5}
          className={`circuit-label ${hot(highlight, "r")}`}
        >
          {ohms} Ω
        </text>
        {mode === "sign" ? (
          <>
            <text
              x={RIGHT - 28}
              y={TOP + 18}
              className="circuit-label"
              textAnchor="middle"
            >
              +
            </text>
            <text
              x={RIGHT - 28}
              y={BOT - 8}
              className="circuit-label"
              textAnchor="middle"
            >
              −
            </text>
          </>
        ) : null}
        <text
          x={(LEFT + RIGHT) / 2}
          y={MID + 8}
          textAnchor="middle"
          className={`circuit-label ${hot(highlight, "p")}`}
        >
          P
        </text>
        <Dot x={LEFT} y={TOP} cls={hot(highlight, "src")} />
        <Dot x={LEFT} y={BOT} cls={hot(highlight, "src")} />
        <Dot x={RIGHT} y={TOP} cls={hot(highlight, "r")} />
        <Dot x={RIGHT} y={BOT} cls={hot(highlight, "r")} />
      </g>
    </svg>
  );
}
