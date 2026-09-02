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
  if (highlight === "rn" && (id === "rth" || id === "rn")) return "hot";
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

function CurrentSource({ x, y1, y2, cls }) {
  const mid = (y1 + y2) / 2;
  return (
    <>
      <path className={cls} d={`M${x} ${y1} V${mid - 22}`} />
      <circle className={cls} cx={x} cy={mid} r="20" />
      <path className={cls} d={`M${x} ${mid + 12} V${mid - 12}`} />
      <polygon
        className={cls}
        points={`${x},${mid - 16} ${x - 8},${mid} ${x + 8},${mid}`}
        fill="currentColor"
        stroke="none"
      />
      <path className={cls} d={`M${x} ${mid + 22} V${y2}`} />
    </>
  );
}

function Dot({ x, y, cls, big = false }) {
  return <circle className={cls} cx={x} cy={y} r={big ? 5 : 3.5} fill="currentColor" />;
}

const TOP = 50;
const BOT = 230;
const MID = (TOP + BOT) / 2;

export default function NortonSchematic({ highlight = "all", view = "open" }) {
  const killed = view === "killed";
  const load = view === "load";
  const isc = view === "isc";
  const showEq = view === "equiv" || view === "open" || view === "killed";
  const origX = 78;
  const origNode = 188;
  const origAb = 248;
  const eqX = 328;
  const rnX = 430;
  const eqAb = 512;
  const r1Mid = (origX + origNode) / 2;
  const loadX = 360;
  const rnKnown = 250;

  return (
    <svg
      className="circuit-svg thev-teach"
      viewBox="0 0 560 280"
      role="img"
      aria-label="Norton original circuit and equivalent"
    >
      <g transform={load ? "translate(80 0)" : undefined}>
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
          {load ? (
            <>
              <CurrentSource x={90} y1={TOP} y2={BOT} cls={hot(highlight, "eq")} />
              <path className={hot(highlight, "eq")} d={`M90 ${TOP} H${loadX}`} />
              <path className={hot(highlight, "eq")} d={`M90 ${BOT} H${loadX}`} />
              <path
                className={hot(highlight, "eq")}
                d={resV(rnKnown, MID, TOP, BOT)}
              />
              <path
                className={hot(highlight, "load")}
                d={resV(loadX, MID, TOP, BOT)}
              />
            </>
          ) : (
            <>
              {killed ? (
                <path className={hot(highlight, "kill")} d={`M${origX} ${TOP} V${BOT}`} />
              ) : (
                <Battery
                  x={origX}
                  y1={TOP}
                  y2={BOT}
                  cls={hot(highlight, isc ? "isc" : "all")}
                />
              )}
              <path
                className={hot(highlight, killed ? "rn" : isc ? "isc" : "voc")}
                d={resH(r1Mid, TOP, origX, origNode)}
              />
              <path
                className={hot(highlight, isc ? "isc" : "voc")}
                d={`M${origNode} ${TOP} H${origAb}`}
              />
              <path
                className={hot(highlight, killed ? "rn" : "voc")}
                d={resV(origNode, MID, TOP, BOT)}
              />
              <path
                className={hot(highlight, isc ? "isc" : "voc")}
                d={`M${origX} ${BOT} H${origAb}`}
              />
              {isc ? (
                <path className={hot(highlight, "isc")} d={`M${origAb} ${TOP} V${BOT}`} />
              ) : null}
              {showEq ? (
                <>
                  <CurrentSource
                    x={eqX}
                    y1={TOP}
                    y2={BOT}
                    cls={hot(highlight, "eq")}
                  />
                  <path className={hot(highlight, "eq")} d={`M${eqX} ${TOP} H${eqAb}`} />
                  <path className={hot(highlight, "eq")} d={`M${eqX} ${BOT} H${eqAb}`} />
                  <path
                    className={hot(highlight, "eq")}
                    d={resV(rnX, MID, TOP, BOT)}
                  />
                </>
              ) : null}
            </>
          )}
        </g>
        {load ? (
          <>
            <text x="24" y="150" className={`circuit-label ${hot(highlight, "eq")}`}>
              <Sub base="I" sub="n" rest=" 3 A" />
            </text>
            <text
              x={rnKnown + 22}
              y={MID + 5}
              className={`circuit-label thev-tag ${hot(highlight, "eq")}`}
            >
              <Sub base="R" sub="n" rest=" 3 Ω" />
            </text>
            <text
              x={loadX + 22}
              y={MID + 5}
              className={`circuit-label thev-tag ${hot(highlight, "load")}`}
            >
              <Sub base="R" sub="L" />
            </text>
            <Dot x={90} y={TOP} cls={hot(highlight, "eq")} />
            <Dot x={90} y={BOT} cls={hot(highlight, "eq")} />
            <Dot x={loadX} y={TOP} cls={hot(highlight, "load")} big />
            <Dot x={loadX} y={BOT} cls={hot(highlight, "load")} big />
          </>
        ) : (
          <>
            {killed ? (
              <text x="18" y="150" className={`circuit-label ${hot(highlight, "kill")}`}>
                short
              </text>
            ) : (
              <text x="18" y="150" className="circuit-label">
                12 V
              </text>
            )}
            <text
              x={r1Mid}
              y={TOP - 32}
              textAnchor="middle"
              className={`circuit-label thev-tag ${hot(highlight, killed ? "rn" : "voc")}`}
            >
              4 Ω
            </text>
            <text
              x={origNode - 28}
              y={MID + 5}
              textAnchor="end"
              className={`circuit-label thev-tag ${hot(highlight, killed ? "rn" : "voc")}`}
            >
              12 Ω
            </text>
            <text
              x={origAb + 8}
              y={TOP + 6}
              className={`circuit-label ${hot(highlight, isc ? "isc" : "voc")}`}
            >
              a
            </text>
            <text
              x={origAb + 8}
              y={BOT + 6}
              className={`circuit-label ${hot(highlight, isc ? "isc" : "voc")}`}
            >
              b
            </text>
            {isc ? (
              <text
                x={origAb + 18}
                y={MID + 5}
                className={`circuit-label thev-tag ${hot(highlight, "isc")}`}
              >
                <Sub base="I" sub="sc" rest=" 3 A" />
              </text>
            ) : null}
            {showEq ? (
              <>
                <text x="278" y={MID + 6} className="circuit-label">
                  ≡
                </text>
                <text
                  x={eqX}
                  y={TOP - 32}
                  textAnchor="middle"
                  className={`circuit-label thev-tag ${hot(highlight, "eq")}`}
                >
                  <Sub base="I" sub="n" rest=" 3 A" />
                </text>
                <text
                  x={rnX + 22}
                  y={MID + 5}
                  className={`circuit-label thev-tag ${hot(highlight, "eq")}`}
                >
                  <Sub base="R" sub="n" rest=" 3 Ω" />
                </text>
                <text x={eqAb + 6} y={TOP + 6} className="circuit-label">
                  a
                </text>
                <text x={eqAb + 6} y={BOT + 6} className="circuit-label">
                  b
                </text>
              </>
            ) : null}
            <Dot x={origX} y={TOP} cls="" />
            <Dot x={origX} y={BOT} cls="" />
            <Dot x={origNode} y={TOP} cls={hot(highlight, "voc")} big />
            <Dot x={origAb} y={TOP} cls={hot(highlight, isc ? "isc" : "voc")} big />
            <Dot x={origAb} y={BOT} cls={hot(highlight, isc ? "isc" : "voc")} big />
            {showEq ? (
              <>
                <Dot x={eqX} y={TOP} cls={hot(highlight, "eq")} />
                <Dot x={eqX} y={BOT} cls={hot(highlight, "eq")} />
                <Dot x={eqAb} y={TOP} cls={hot(highlight, "eq")} big />
                <Dot x={eqAb} y={BOT} cls={hot(highlight, "eq")} big />
              </>
            ) : null}
          </>
        )}
      </g>
    </svg>
  );
}
