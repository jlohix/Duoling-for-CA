import { dividerBranchDragLabel } from "../data/dividerBranchesLab";

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

function CurrentSource({ x, y1, y2, cls }) {
  const mid = (y1 + y2) / 2;
  return (
    <>
      <path className={cls} d={`M${x} ${y1} V${mid - 22}`} />
      <circle className={cls} cx={x} cy={mid} r={22} />
      <path className={cls} d={`M${x} ${mid + 10} V${mid - 10}`} />
      <path className={cls} d={`M${x - 7} ${mid - 2} L${x} ${mid - 10} L${x + 7} ${mid - 2}`} />
      <path className={cls} d={`M${x} ${mid + 22} V${y2}`} />
    </>
  );
}

function Dot({ x, y, cls, big = false }) {
  return (
    <circle className={cls} cx={x} cy={y} r={big ? 5 : 3.5} fill="currentColor" />
  );
}

function DropSlot({ slotRef, drag, placed, revealed, ok, empty, filled, x, y, w = 120, h = 44 }) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <div
        ref={slotRef}
        xmlns="http://www.w3.org/1999/xhtml"
        className={`resistor-slot compact ${drag?.over ? "hot" : ""} ${
          placed != null ? "filled" : ""
        } ${revealed ? (ok ? "ok" : "bad") : ""}`}
      >
        {placed != null ? filled : empty}
      </div>
    </foreignObject>
  );
}

const TOP = 50;
const BOT = 230;
const MID = (TOP + BOT) / 2;
const LEFT = 80;

function branchXs(count, start) {
  if (count <= 2) return [start, start + 130];
  return [start, start + 110, start + 220];
}

export const BRANCH_VIEWS = {
  "teach-vload": {
    kind: "vdiv",
    vs: 12,
    series: 4,
    branches: [{ ohm: 8 }, { ohm: 8 }],
    vo: 6,
  },
  "teach-idiv3": {
    kind: "idiv",
    is: 12,
    branches: [
      { ohm: 2, amps: 6 },
      { ohm: 3, amps: 4 },
      { ohm: 6, amps: 2 },
    ],
  },
  "q-vload2": {
    kind: "vdiv",
    vs: 12,
    series: 4,
    branches: [{ ohm: 8 }, { ohm: 8 }],
  },
  "q-idiv3": {
    kind: "idiv",
    is: 12,
    branches: [{ ohm: 2 }, { ohm: 3 }, { ohm: 6 }],
  },
  "q-idiv3most": {
    kind: "idiv",
    is: 12,
    branches: [{ ohm: 2 }, { ohm: 4 }, { ohm: 4 }],
  },
  "q-vload3": {
    kind: "vdiv",
    vs: 12,
    series: 6,
    branches: [{ ohm: 6 }, { ohm: 6 }, { ohm: 6 }],
  },
  "q-idiv2": {
    kind: "idiv",
    is: 6,
    branches: [{ ohm: 2 }, { ohm: 4 }],
  },
};

export function BranchNet({
  kind = "vdiv",
  vs,
  is,
  series,
  branches = [],
  vo,
  highlight = "all",
  drop,
  dropIndex = 0,
  placed,
  drag,
  revealed,
  ok,
  slotRef,
  filled,
}) {
  const vdiv = kind === "vdiv";
  const xs = branchXs(branches.length, vdiv ? 250 : 230);
  const first = xs[0];
  const last = xs[xs.length - 1];
  const end = last + 36;
  const r1Left = LEFT + 36;
  const r1Mid = (r1Left + first) / 2;
  const dropOhm = drop === "ohm";
  const dropAmp = drop === "amp";
  const dropVo = drop === "vo";

  return (
    <svg
      className="circuit-svg lab-teach"
      viewBox="0 0 560 300"
      role="img"
      aria-label={
        vdiv
          ? "Voltage divider with parallel load branches"
          : "Current divider with parallel branches"
      }
    >
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
        {vdiv ? (
          <Battery x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "vs")} />
        ) : (
          <CurrentSource x={LEFT} y1={TOP} y2={BOT} cls={hot(highlight, "is")} />
        )}
        {vdiv ? (
          <>
            <path className={hot(highlight, "r1")} d={`M${LEFT} ${TOP} H${r1Left}`} />
            <path
              className={hot(highlight, "r1")}
              d={resH(r1Mid, TOP, r1Left, first)}
            />
          </>
        ) : (
          <path className={hot(highlight, "is")} d={`M${LEFT} ${TOP} H${end}`} />
        )}
        <path d={`M${LEFT} ${BOT} H${end}`} />
        <path d={`M${last} ${TOP} H${end}`} />
        {branches.map((_, i) => (
          <path
            key={`b${i}`}
            className={hot(highlight, `r${i + 1}`) || (vdiv ? hot(highlight, "vo") : "")}
            d={resV(xs[i], MID, TOP, BOT)}
          />
        ))}
      </g>
      {vdiv ? (
        <>
          <text x="28" y="148" className={`circuit-label ${hot(highlight, "vs")}`}>
            {vs} V
          </text>
          <text x="108" y="134" className="circuit-label">
            +
          </text>
          <text x="108" y="170" className="circuit-label">
            −
          </text>
          <text
            x={r1Mid}
            y={TOP - 14}
            textAnchor="middle"
            className={`circuit-label thev-tag ${hot(highlight, "r1")}`}
          >
            R1 {series} Ω
          </text>
        </>
      ) : (
        <>
          <text x="28" y="148" className={`circuit-label ${hot(highlight, "is")}`}>
            Is
          </text>
          <text
            x={LEFT}
            y={BOT + 22}
            textAnchor="middle"
            className={`circuit-label thev-tag ${hot(highlight, "is")}`}
          >
            {is} A
          </text>
        </>
      )}
      {branches.map((branch, i) => (
        <g key={`lab${i}`}>
          {!(dropOhm && dropIndex === i) && branch.ohm != null ? (
            <text
              x={xs[i] + 18}
              y={MID + 6}
              className={`circuit-label thev-tag ${hot(highlight, `r${i + 1}`)}`}
            >
              {branch.ohm} Ω
            </text>
          ) : null}
          {!(dropAmp && dropIndex === i) && branch.amps != null ? (
            <text
              x={xs[i]}
              y={BOT + 22}
              textAnchor="middle"
              className={`circuit-label thev-tag ${hot(highlight, `r${i + 1}`)}`}
            >
              {branch.amps} A
            </text>
          ) : null}
        </g>
      ))}
      {vdiv && !dropVo && vo != null ? (
        <text
          x={first + 12}
          y={TOP - 14}
          className={`circuit-label thev-tag ${hot(highlight, "vo")}`}
        >
          Vo {vo} V
        </text>
      ) : null}
      <Dot x={LEFT} y={TOP} />
      <Dot x={LEFT} y={BOT} />
      {xs.map((x, i) => (
        <g key={`d${i}`}>
          <Dot x={x} y={TOP} cls={hot(highlight, vdiv ? "vo" : `r${i + 1}`)} big />
          <Dot x={x} y={BOT} />
        </g>
      ))}
      <Dot x={end} y={TOP} />
      <Dot x={end} y={BOT} />
      {dropVo ? (
        <DropSlot
          slotRef={slotRef}
          drag={drag}
          placed={placed}
          revealed={revealed}
          ok={ok}
          empty="drop Vo"
          filled={filled}
          x={first + 8}
          y={8}
        />
      ) : null}
      {dropAmp ? (
        <DropSlot
          slotRef={slotRef}
          drag={drag}
          placed={placed}
          revealed={revealed}
          ok={ok}
          empty="drop I"
          filled={filled}
          x={xs[dropIndex] - 56}
          y={BOT + 4}
        />
      ) : null}
      {dropOhm ? (
        <DropSlot
          slotRef={slotRef}
          drag={drag}
          placed={placed}
          revealed={revealed}
          ok={ok}
          empty="drop R"
          filled={filled}
          x={xs[dropIndex] + 10}
          y={MID - 20}
        />
      ) : null}
    </svg>
  );
}

export default function DividerBranchesSchematic({
  highlight = "all",
  view = "teach-vload",
}) {
  const circuit = BRANCH_VIEWS[view] || BRANCH_VIEWS["teach-vload"];
  return <BranchNet {...circuit} highlight={highlight} />;
}

export function DividerBranchesDragBoard({
  question,
  placed,
  drag,
  revealed,
  ok,
  slotRef,
}) {
  return (
    <BranchNet
      kind={question.kind}
      vs={question.vs}
      is={question.is}
      series={question.series}
      branches={question.branches}
      vo={question.vo}
      highlight="all"
      drop={question.drop}
      dropIndex={question.dropIndex}
      placed={placed}
      drag={drag}
      revealed={revealed}
      ok={ok}
      slotRef={slotRef}
      filled={dividerBranchDragLabel(question, placed)}
    />
  );
}
