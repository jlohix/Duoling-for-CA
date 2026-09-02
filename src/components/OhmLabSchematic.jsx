import { ResistorBody } from "../data/resistorBands";
import MeshLoop from "./MeshLoop";

const TOP = 50;
const BOT = 230;
const LEFT = 90;

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

function CurrentSource({ x, amps, labelAt = "left", tag = "Is" }) {
  const mid = (TOP + BOT) / 2;
  const label =
    labelAt === "bottom" ? (
      <text
        x={x}
        y={BOT + 20}
        textAnchor="middle"
        className="circuit-label thev-tag"
        fill="currentColor"
        stroke="none"
      >
        {amps} A down
      </text>
    ) : (
      <text
        x={labelAt === "right" ? x + 32 : x - 36}
        y={mid + 6}
        textAnchor={labelAt === "right" ? "start" : "end"}
        className="circuit-label thev-tag"
        fill="currentColor"
        stroke="none"
      >
        {tag} {amps} A
      </text>
    );
  return (
    <>
      <path d={`M${x} ${TOP} V${mid - 22}`} />
      <circle cx={x} cy={mid} r="20" />
      <path d={`M${x} ${mid + 12} V${mid - 12}`} />
      <polygon
        points={`${x},${mid - 16} ${x - 8},${mid} ${x + 8},${mid}`}
        fill="currentColor"
        stroke="none"
      />
      <path d={`M${x} ${mid + 22} V${BOT}`} />
      {label}
    </>
  );
}

function IsArrow({ fromX, toX, y, label = "Is", cls = "" }) {
  const goingRight = toX >= fromX;
  const tipX = toX;
  const head = goingRight
    ? `${tipX},${y} ${tipX - 12},${y - 6} ${tipX - 12},${y + 6}`
    : `${tipX},${y} ${tipX + 12},${y - 6} ${tipX + 12},${y + 6}`;
  const lineEnd = goingRight ? tipX - 10 : tipX + 10;
  return (
    <g fill="currentColor" stroke="currentColor" className={cls}>
      <line x1={fromX} y1={y} x2={lineEnd} y2={y} strokeWidth="2.5" />
      <polygon points={head} stroke="none" />
      {label ? (
        <text
          x={(fromX + toX) / 2}
          y={y - 8}
          textAnchor="middle"
          className={`circuit-label thev-tag ${cls}`}
          fill="currentColor"
          stroke="none"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

function DownCurrent({ x, y1, y2, label = "I", sub, labelSide = "right" }) {
  const head = `${x},${y2} ${x - 8},${y2 - 16} ${x + 8},${y2 - 16}`;
  const left = labelSide === "left";
  return (
    <g fill="currentColor" stroke="currentColor">
      <line x1={x} y1={y1} x2={x} y2={y2 - 14} strokeWidth="2.5" />
      <polygon points={head} stroke="none" />
      <text
        x={left ? x - 14 : x + 16}
        y={(y1 + y2) / 2 + 4}
        textAnchor={left ? "end" : "start"}
        className="circuit-label thev-tag"
        fill="currentColor"
        stroke="none"
      >
        <Sub base={label} sub={sub} />
      </text>
    </g>
  );
}

function HBattery({ x1, x2, y }) {
  const mid = (x1 + x2) / 2;
  return (
    <>
      <path d={`M${x1} ${y} H${mid - 18}`} />
      <line
        x1={mid - 8}
        y1={y - 16}
        x2={mid - 8}
        y2={y + 16}
        strokeWidth="4"
      />
      <line
        x1={mid + 8}
        y1={y - 10}
        x2={mid + 8}
        y2={y + 10}
        strokeWidth="3"
      />
      <path d={`M${mid + 18} ${y} H${x2}`} />
    </>
  );
}

function Battery({ x = LEFT }) {
  const mid = (TOP + BOT) / 2;
  return (
    <>
      <path d={`M${x} ${TOP} V${mid - 18}`} />
      <path d={`M${x} ${mid + 22} V${BOT}`} />
      <line
        x1={x - 22}
        y1={mid - 10}
        x2={x + 22}
        y2={mid - 10}
        strokeWidth="4"
      />
      <line
        x1={x - 12}
        y1={mid + 14}
        x2={x + 12}
        y2={mid + 14}
        strokeWidth="3"
      />
    </>
  );
}

function zigH(x1, y, x2) {
  const mid = (x1 + x2) / 2;
  return `M${x1} ${y} L${mid - 56} ${y} L${mid - 44} ${y - 16} L${mid - 30} ${y + 16} L${mid - 16} ${y - 16} L${mid - 2} ${y + 16} L${mid + 12} ${y - 16} L${mid + 26} ${y + 16} L${mid + 40} ${y - 16} L${mid + 56} ${y} L${x2} ${y}`;
}

function zigV(x, y1, y2) {
  const mid = (y1 + y2) / 2;
  return `M${x} ${y1} L${x} ${mid - 48} L${x - 16} ${mid - 34} L${x + 16} ${mid - 20} L${x - 16} ${mid - 6} L${x + 16} ${mid + 8} L${x - 16} ${mid + 22} L${x + 16} ${mid + 36} L${x} ${mid + 48} L${x} ${y2}`;
}

function zigHAt(cx, y, xLeft, xRight) {
  const w = 24;
  const h = 8;
  return `M${xLeft} ${y} H${cx - w / 2} M${cx - w / 2} ${y - h / 2} H${cx + w / 2} V${y + h / 2} H${cx - w / 2} V${y - h / 2} M${cx + w / 2} ${y} H${xRight}`;
}

function zigVAt(x, cy, yTop, yBot) {
  const w = 8;
  const h = 24;
  return `M${x} ${yTop} V${cy - h / 2} M${x - w / 2} ${cy - h / 2} H${x + w / 2} V${cy + h / 2} H${x - w / 2} V${cy - h / 2} M${x} ${cy + h / 2} V${yBot}`;
}

function rungGap(x) {
  return `M${x} ${TOP} V${TOP + 30} M${x} ${BOT - 30} V${BOT}`;
}

function rungGapAt(x, cy) {
  return `M${x} ${TOP} V${cy - 16} M${x} ${cy + 16} V${BOT}`;
}

function Dot({ x, y, big = false }) {
  return <circle cx={x} cy={y} r={big ? 5 : 3.5} fill="currentColor" />;
}

function Slot({ slotRef, drag, placed, revealed, ok, hard, hideBody, children }) {
  return (
    <div
      ref={slotRef}
      xmlns="http://www.w3.org/1999/xhtml"
      className={`resistor-slot ${hideBody ? "schematic-only" : ""} ${
        drag?.over ? "hot" : ""
      } ${placed != null ? "filled" : ""} ${
        revealed ? (ok ? "ok" : "bad") : ""
      }`}
    >
      {placed != null && !hideBody ? (
        <ResistorBody ohms={placed} showValue />
      ) : (
        children
      )}
    </div>
  );
}

function slotAt(x, y, horizontal, compact = false) {
  const w = compact ? (horizontal ? 32 : 24) : horizontal ? 100 : 70;
  const h = compact ? (horizontal ? 16 : 28) : horizontal ? 44 : 60;
  return { x: x - w / 2, y: y - h / 2, width: w, height: h };
}

export default function OhmLabSchematic({
  question,
  placed,
  drag,
  revealed,
  ok,
  hard,
  slotRef,
}) {
  const kind = question.kind;
  const dropSrc = kind === "nodal" && question.slot === "src";
  const isrc = kind === "nodal" && question.shape === "isrc";
  const four = kind === "nodal" && question.shape === "four";
  const compactNodal = isrc || four || (kind === "nodal" && question.level === "hard");
  const extraX = 318;
  const thevRth = kind === "thev-rth";
  const thevLoad = kind === "thev-load";
  const nortonRn = kind === "norton-rn";
  const nortonLoad = kind === "norton-load";
  const mesh = kind === "mesh";
  const meshQuiz = mesh && question.quiz === "currents";
  const supermesh = kind === "supermesh";
  const supernode = kind === "supernode";
  const superpos = kind === "superpos";
  const vdiv = kind === "vdiv";
  const idiv = kind === "idiv";
  const par = kind === "parallel" || idiv;
  const spNode = 290;
  const spRight = 470;
  const spR1Left = LEFT + 40;
  const spR1Mid = (spR1Left + spNode) / 2;
  const spR2Mid = (spNode + spRight) / 2;
  const dropSnR1 = supernode && question.slot === "r1";
  const dropSnRa = supernode && question.slot === "ra";
  const dropSnRb = supernode && question.slot === "rb";
  const snA = 210;
  const snB = 400;
  const snR1Left = LEFT + 40;
  const snR1Mid = (snR1Left + snA) / 2;
  const snVsMid = (snA + snB) / 2;
  const dropShared = mesh && question.slot === "shared";
  const dropRight = (mesh || supermesh) && question.slot === "right";
  const dropLeft = (mesh || supermesh) && question.slot === "leftTop";
  const meshShared = 280;
  const meshRight = 470;
  const meshR1Left = LEFT + 40;
  const meshR1Mid = (meshR1Left + meshShared) / 2;
  const meshR2Mid = (meshShared + meshRight) / 2;
  const seriesX = 320;
  const parSlotX = 260;
  const parKnownX = 410;
  const r1Left = four ? 128 : 150;
  const nodeX = isrc ? 210 : four ? 228 : 290;
  const nodalKnownX = isrc ? 355 : four ? 412 : 370;
  const nodalGapX = isrc || four ? 518 : 470;
  const midY = (TOP + BOT) / 2;
  const loadX = 360;
  const rthMid = 430;
  const eqX = 328;
  const origX = 78;
  const origNode = 188;
  const origAb = 248;
  const eqAb = 512;
  const railEnd =
    kind === "series"
      ? seriesX
      : par
        ? parKnownX
        : thevLoad || nortonLoad
          ? loadX
          : mesh || supermesh
            ? meshRight
            : supernode
              ? snB
              : superpos
                ? spRight
                : vdiv
                  ? 290
                  : nodalGapX;

  let slotBox = slotAt(seriesX, midY, false);
  if (kind === "parallel" || idiv) slotBox = slotAt(parSlotX, midY, false);
  if (vdiv) slotBox = slotAt(290, midY, false, true);
  if (kind === "nodal") {
    slotBox = dropSrc
      ? slotAt((r1Left + nodeX) / 2, TOP, true, compactNodal)
      : slotAt(nodalGapX, midY, false, compactNodal);
  }
  if (thevRth) slotBox = slotAt(rthMid, TOP, true, true);
  if (nortonRn) slotBox = slotAt(rthMid, midY, false, true);
  if (thevLoad || nortonLoad) slotBox = slotAt(loadX, midY, false, true);
  if (dropShared) slotBox = slotAt(meshShared, midY, false, true);
  if (dropRight) slotBox = slotAt(meshR2Mid, TOP, true, true);
  if (dropLeft) slotBox = slotAt(meshR1Mid, TOP, true, true);
  if (dropSnR1) slotBox = slotAt(snR1Mid, TOP, true, true);
  if (dropSnRa) slotBox = slotAt(snA, midY, false, true);
  if (dropSnRb) slotBox = slotAt(snB, midY, false, true);
  if (superpos) slotBox = slotAt(spNode, midY, false, true);
  const r1Mid = (origX + 40 + origNode) / 2;
  const rthKnownMid = (r1Left + nodeX) / 2;
  const loopShift =
    kind === "series"
      ? 100
      : vdiv
        ? 110
        : thevLoad || nortonLoad
          ? 80
          : kind === "parallel" || idiv
            ? 50
            : 0;

  return (
    <svg
      className="circuit-svg"
      viewBox={compactNodal || mesh || supermesh || supernode || superpos || vdiv ? "0 0 560 300" : "0 0 560 280"}
      role="img"
      aria-label={`${kind} circuit`}
    >
      <g transform={loopShift ? `translate(${loopShift} 0)` : undefined}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
      >
        {thevRth ? (
          <>
            <Battery x={origX} />
            <path
              d={zigHAt(r1Mid, TOP, origX, origNode)}
              strokeLinejoin="round"
            />
            <path d={`M${origNode} ${TOP} H${origAb}`} />
            <path
              d={zigVAt(origNode, midY, TOP, BOT)}
              strokeLinejoin="round"
            />
            <path d={`M${origX} ${BOT} H${origAb}`} />
            <Battery x={eqX} />
            {placed != null ? (
              <path
                d={zigHAt(rthMid, TOP, eqX, eqAb)}
                strokeLinejoin="round"
              />
            ) : (
              <path
                d={`M${eqX} ${TOP} H${rthMid - 14} M${rthMid + 14} ${TOP} H${eqAb}`}
              />
            )}
            <path d={`M${eqX} ${BOT} H${eqAb}`} />
          </>
        ) : thevLoad ? (
          <>
            <Battery />
            <path
              d={zigHAt(rthKnownMid, TOP, LEFT, nodeX)}
              strokeLinejoin="round"
            />
            <path d={`M${nodeX} ${TOP} H${loadX}`} />
            <path d={`M${LEFT} ${BOT} H${loadX}`} />
            {placed != null ? (
              <path
                d={zigVAt(loadX, midY, TOP, BOT)}
                strokeLinejoin="round"
              />
            ) : (
              <path d={rungGapAt(loadX, midY)} />
            )}
          </>
        ) : nortonRn ? (
          <>
            <Battery x={origX} />
            <path
              d={zigHAt(r1Mid, TOP, origX, origNode)}
              strokeLinejoin="round"
            />
            <path d={`M${origNode} ${TOP} H${origAb}`} />
            <path
              d={zigVAt(origNode, midY, TOP, BOT)}
              strokeLinejoin="round"
            />
            <path d={`M${origX} ${BOT} H${origAb}`} />
            <CurrentSource x={eqX} amps={question.amps} tag="In" labelAt="right" />
            <path d={`M${eqX} ${TOP} H${eqAb}`} />
            <path d={`M${eqX} ${BOT} H${eqAb}`} />
            {placed != null ? (
              <path
                d={zigVAt(rthMid, midY, TOP, BOT)}
                strokeLinejoin="round"
              />
            ) : (
              <path d={rungGapAt(rthMid, midY)} />
            )}
          </>
        ) : nortonLoad ? (
          <>
            <CurrentSource x={LEFT} amps={question.amps} tag="In" />
            <path d={`M${LEFT} ${TOP} H${loadX}`} />
            <path d={`M${LEFT} ${BOT} H${loadX}`} />
            <path
              d={zigVAt(nodeX, midY, TOP, BOT)}
              strokeLinejoin="round"
            />
            {placed != null ? (
              <path
                d={zigVAt(loadX, midY, TOP, BOT)}
                strokeLinejoin="round"
              />
            ) : (
              <path d={rungGapAt(loadX, midY)} />
            )}
          </>
        ) : mesh ? (
          <>
            <Battery />
            <path d={`M${LEFT} ${TOP} H${meshR1Left}`} />
            {dropLeft ? (
              placed != null ? (
                <path
                  d={zigHAt(meshR1Mid, TOP, meshR1Left, meshShared)}
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d={`M${meshR1Left} ${TOP} H${meshR1Mid - 16} M${meshR1Mid + 16} ${TOP} H${meshShared}`}
                />
              )
            ) : (
              <path
                d={zigHAt(meshR1Mid, TOP, meshR1Left, meshShared)}
                strokeLinejoin="round"
              />
            )}
            {dropRight ? (
              placed != null ? (
                <path
                  d={zigHAt(meshR2Mid, TOP, meshShared, meshRight)}
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d={`M${meshShared} ${TOP} H${meshR2Mid - 16} M${meshR2Mid + 16} ${TOP} H${meshRight}`}
                />
              )
            ) : (
              <path
                d={zigHAt(meshR2Mid, TOP, meshShared, meshRight)}
                strokeLinejoin="round"
              />
            )}
            <path d={`M${LEFT} ${BOT} H${meshRight}`} />
            {dropShared ? (
              placed != null ? (
                <path
                  d={zigVAt(meshShared, midY, TOP, BOT)}
                  strokeLinejoin="round"
                />
              ) : (
                <path d={rungGapAt(meshShared, midY)} />
              )
            ) : (
              <path
                d={zigVAt(meshShared, midY, TOP, BOT)}
                strokeLinejoin="round"
              />
            )}
            <path d={`M${meshRight} ${TOP} V${BOT}`} />
          </>
        ) : supermesh ? (
          <>
            <Battery />
            <path d={`M${LEFT} ${TOP} H${meshR1Left}`} />
            {dropLeft ? (
              placed != null ? (
                <path
                  d={zigHAt(meshR1Mid, TOP, meshR1Left, meshShared)}
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d={`M${meshR1Left} ${TOP} H${meshR1Mid - 16} M${meshR1Mid + 16} ${TOP} H${meshShared}`}
                />
              )
            ) : (
              <path
                d={zigHAt(meshR1Mid, TOP, meshR1Left, meshShared)}
                strokeLinejoin="round"
              />
            )}
            {dropRight ? (
              placed != null ? (
                <path
                  d={zigHAt(meshR2Mid, TOP, meshShared, meshRight)}
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d={`M${meshShared} ${TOP} H${meshR2Mid - 16} M${meshR2Mid + 16} ${TOP} H${meshRight}`}
                />
              )
            ) : (
              <path
                d={zigHAt(meshR2Mid, TOP, meshShared, meshRight)}
                strokeLinejoin="round"
              />
            )}
            <path d={`M${LEFT} ${BOT} H${meshRight}`} />
            <CurrentSource x={meshShared} amps={question.amps} labelAt="bottom" />
            <path d={`M${meshRight} ${TOP} V${BOT}`} />
          </>
        ) : supernode ? (
          <>
            <Battery />
            <path d={`M${LEFT} ${TOP} H${snR1Left}`} />
            {dropSnR1 ? (
              placed != null ? (
                <path
                  d={zigHAt(snR1Mid, TOP, snR1Left, snA)}
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d={`M${snR1Left} ${TOP} H${snR1Mid - 16} M${snR1Mid + 16} ${TOP} H${snA}`}
                />
              )
            ) : (
              <path
                d={zigHAt(snR1Mid, TOP, snR1Left, snA)}
                strokeLinejoin="round"
              />
            )}
            <HBattery x1={snA} x2={snB} y={TOP} />
            <path d={`M${LEFT} ${BOT} H${snB}`} />
            {dropSnRa ? (
              placed != null ? (
                <path d={zigVAt(snA, midY, TOP, BOT)} strokeLinejoin="round" />
              ) : (
                <path d={rungGapAt(snA, midY)} />
              )
            ) : (
              <path d={zigVAt(snA, midY, TOP, BOT)} strokeLinejoin="round" />
            )}
            {dropSnRb ? (
              placed != null ? (
                <path d={zigVAt(snB, midY, TOP, BOT)} strokeLinejoin="round" />
              ) : (
                <path d={rungGapAt(snB, midY)} />
              )
            ) : (
              <path d={zigVAt(snB, midY, TOP, BOT)} strokeLinejoin="round" />
            )}
          </>
        ) : superpos ? (
          <>
            <Battery />
            <Battery x={spRight} />
            <path d={`M${LEFT} ${TOP} H${spR1Left}`} />
            <path
              d={zigHAt(spR1Mid, TOP, spR1Left, spNode)}
              strokeLinejoin="round"
            />
            <path
              d={zigHAt(spR2Mid, TOP, spNode, spRight)}
              strokeLinejoin="round"
            />
            <path d={`M${LEFT} ${BOT} H${spRight}`} />
            {placed != null ? (
              <path d={zigVAt(spNode, midY, TOP, BOT)} strokeLinejoin="round" />
            ) : (
              <path d={rungGapAt(spNode, midY)} />
            )}
          </>
        ) : isrc ? (
          <>
            <CurrentSource x={LEFT} amps={question.amps} />
            <path d={`M${LEFT} ${TOP} H${nodalGapX}`} />
            <path d={`M${LEFT} ${BOT} H${nodalGapX}`} />
            <path d={zigVAt(nodalKnownX, midY, TOP, BOT)} strokeLinejoin="round" />
            {placed != null ? (
              <path d={zigVAt(nodalGapX, midY, TOP, BOT)} strokeLinejoin="round" />
            ) : (
              <path d={rungGapAt(nodalGapX, midY)} />
            )}
          </>
        ) : (
          <>
            <Battery />
            {vdiv ? (
              <>
                <path d={`M${LEFT} ${TOP} H${150}`} />
                <path
                  d={zigHAt((150 + 290) / 2, TOP, 150, 290)}
                  strokeLinejoin="round"
                />
                <path d={`M${LEFT} ${BOT} H${290}`} />
                {placed != null ? (
                  <path d={zigVAt(290, midY, TOP, BOT)} strokeLinejoin="round" />
                ) : (
                  <path d={rungGapAt(290, midY)} />
                )}
              </>
            ) : kind === "nodal" ? (
              <>
                <path d={`M${LEFT} ${TOP} H${r1Left}`} />
                {dropSrc ? (
                  placed != null ? (
                    <path
                      d={
                        compactNodal
                          ? zigHAt((r1Left + nodeX) / 2, TOP, r1Left, nodeX)
                          : zigH(r1Left, TOP, nodeX)
                      }
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d={`M${r1Left} ${TOP} H${r1Left + 24} M${nodeX - 24} ${TOP} H${nodeX}`}
                    />
                  )
                ) : (
                  <path
                    d={
                      compactNodal
                        ? zigHAt((r1Left + nodeX) / 2, TOP, r1Left, nodeX)
                        : zigH(r1Left, TOP, nodeX)
                    }
                    strokeLinejoin="round"
                  />
                )}
                <path d={`M${nodeX} ${TOP} H${railEnd}`} />
                <path d={`M${LEFT} ${BOT} H${railEnd}`} />
                {four ? (
                  <path
                    d={zigVAt(extraX, midY, TOP, BOT)}
                    strokeLinejoin="round"
                  />
                ) : null}
                <path
                  d={
                    compactNodal
                      ? zigVAt(nodalKnownX, midY, TOP, BOT)
                      : zigV(nodalKnownX, TOP, BOT)
                  }
                  strokeLinejoin="round"
                />
                {dropSrc || placed != null ? (
                  <path
                    d={
                      compactNodal
                        ? zigVAt(nodalGapX, midY, TOP, BOT)
                        : zigV(nodalGapX, TOP, BOT)
                    }
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d={compactNodal ? rungGapAt(nodalGapX, midY) : rungGap(nodalGapX)}
                  />
                )}
              </>
            ) : (
              <>
                <path d={`M${LEFT} ${TOP} H${railEnd}`} />
                <path d={`M${LEFT} ${BOT} H${railEnd}`} />
                {kind === "series" ? (
                  placed != null ? (
                    <path d={zigV(seriesX, TOP, BOT)} strokeLinejoin="round" />
                  ) : (
                    <path d={rungGap(seriesX)} />
                  )
                ) : (
                  <>
                    {placed != null ? (
                      <path d={zigV(parSlotX, TOP, BOT)} strokeLinejoin="round" />
                    ) : (
                      <path d={rungGap(parSlotX)} />
                    )}
                    <path d={zigV(parKnownX, TOP, BOT)} strokeLinejoin="round" />
                  </>
                )}
              </>
            )}
          </>
        )}
      </g>
      {thevRth ? (
        <>
          <text x="18" y="150" className="circuit-label">
            {question.volts} V
          </text>
          <text x={origX + 32} y="134" className="circuit-label">
            +
          </text>
          <text x={origX + 32} y="170" className="circuit-label">
            −
          </text>
          <text
            x={r1Mid}
            y={TOP - 32}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            {question.knownOhm} Ω
          </text>
          <text
            x={origNode - 28}
            y={midY + 5}
            textAnchor="end"
            className="circuit-label thev-tag"
          >
            {question.knownOhm2} Ω
          </text>
          <text x={origAb + 8} y={TOP + 6} className="circuit-label">
            a
          </text>
          <text x={origAb + 8} y={BOT + 6} className="circuit-label">
            b
          </text>
          <text x="278" y={midY + 6} className="circuit-label">
            ≡
          </text>
          <text
            x={eqX}
            y={TOP - 32}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            <Sub base="V" sub="th" rest={` ${question.vth} V`} />
          </text>
          <text
            x={rthMid}
            y={TOP - 32}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            {placed != null ? `${placed} Ω` : <Sub base="R" sub="th" />}
          </text>
          <text x={eqX + 32} y="134" className="circuit-label">
            +
          </text>
          <text x={eqX + 32} y="170" className="circuit-label">
            −
          </text>
          <text x={eqAb + 6} y={TOP + 6} className="circuit-label">
            a
          </text>
          <text x={eqAb + 6} y={BOT + 6} className="circuit-label">
            b
          </text>
          <Dot x={origX} y={TOP} />
          <Dot x={origX} y={BOT} />
          <Dot x={origNode} y={TOP} big />
          <Dot x={origAb} y={TOP} big />
          <Dot x={origAb} y={BOT} big />
          <Dot x={eqX} y={TOP} />
          <Dot x={eqX} y={BOT} />
          <Dot x={eqAb} y={TOP} big />
          <Dot x={eqAb} y={BOT} big />
        </>
      ) : isrc || nortonRn || nortonLoad ? null : (
        <>
          <text x={kind === "nodal" && question.level === "hard" ? "8" : "24"} y="150" className="circuit-label">
            {question.volts} V
          </text>
          <text x="122" y="134" className="circuit-label">
            +
          </text>
          <text x="122" y="170" className="circuit-label">
            −
          </text>
        </>
      )}
      {nortonRn ? (
        <>
          <text x="18" y="150" className="circuit-label">
            {question.volts} V
          </text>
          <text
            x={r1Mid}
            y={TOP - 32}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            {question.knownOhm} Ω
          </text>
          <text
            x={origNode - 28}
            y={midY + 5}
            textAnchor="end"
            className="circuit-label thev-tag"
          >
            {question.knownOhm2} Ω
          </text>
          <text x={origAb + 8} y={TOP + 6} className="circuit-label">
            a
          </text>
          <text x={origAb + 8} y={BOT + 6} className="circuit-label">
            b
          </text>
          <text x="278" y={midY + 6} className="circuit-label">
            ≡
          </text>
          <text
            x={rthMid + 22}
            y={midY + 5}
            className="circuit-label thev-tag"
          >
            {placed != null ? `${placed} Ω` : <Sub base="R" sub="n" />}
          </text>
          <text x={eqAb + 6} y={TOP + 6} className="circuit-label">
            a
          </text>
          <text x={eqAb + 6} y={BOT + 6} className="circuit-label">
            b
          </text>
          <Dot x={origX} y={TOP} />
          <Dot x={origX} y={BOT} />
          <Dot x={origNode} y={TOP} big />
          <Dot x={origAb} y={TOP} big />
          <Dot x={origAb} y={BOT} big />
          <Dot x={eqX} y={TOP} />
          <Dot x={eqX} y={BOT} />
          <Dot x={eqAb} y={TOP} big />
          <Dot x={eqAb} y={BOT} big />
        </>
      ) : null}
      {thevLoad ? (
        <>
          <text
            x={rthKnownMid}
            y={TOP - 32}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            <Sub base="R" sub="th" rest={` ${question.knownOhm} Ω`} />
          </text>
          <text x={loadX + 22} y={midY + 5} className="circuit-label thev-tag">
            {placed != null ? `${placed} Ω` : <Sub base="R" sub="L" />}
          </text>
        </>
      ) : null}
      {nortonLoad ? (
        <>
          <text
            x={nodeX + 22}
            y={midY + 5}
            className="circuit-label thev-tag"
          >
            <Sub base="R" sub="n" rest={` ${question.knownOhm} Ω`} />
          </text>
          <text x={loadX + 22} y={midY + 5} className="circuit-label thev-tag">
            {placed != null ? `${placed} Ω` : <Sub base="R" sub="L" />}
          </text>
        </>
      ) : null}
      {mesh ? (
        <>
          <text
            x={meshR1Mid}
            y={TOP - 14}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            {dropLeft
              ? placed != null
                ? `${placed} Ω`
                : "R"
              : `${question.knownOhm} Ω`}
          </text>
          <text
            x={meshR2Mid}
            y={TOP - 14}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            {dropRight
              ? placed != null
                ? `${placed} Ω`
                : "R"
              : `${question.knownOhm2} Ω`}
          </text>
          <text
            x={meshShared + 16}
            y={midY + 5}
            className="circuit-label thev-tag"
          >
            {dropShared
              ? placed != null
                ? `${placed} Ω`
                : "R"
              : `${question.knownOhm3 ?? question.knownOhm} Ω`}
          </text>
          <MeshLoop
            x1={LEFT + 36}
            y1={TOP + 34}
            x2={meshShared - 22}
            y2={BOT - 32}
            label="I1"
            caption={meshQuiz ? "" : `${question.i1} A`}
          />
          <MeshLoop
            x1={meshShared + 22}
            y1={TOP + 34}
            x2={meshRight - 32}
            y2={BOT - 32}
            label="I2"
            caption={meshQuiz ? "" : `${question.i2} A`}
          />
        </>
      ) : null}
      {supermesh ? (
        <>
          <text
            x={meshR1Mid}
            y={TOP - 14}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            {dropLeft
              ? placed != null
                ? `${placed} Ω`
                : "R"
              : `${question.knownOhm} Ω`}
          </text>
          <text
            x={meshR2Mid}
            y={TOP - 14}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            {dropRight
              ? placed != null
                ? `${placed} Ω`
                : "R"
              : `${question.knownOhm2} Ω`}
          </text>
          <MeshLoop
            x1={LEFT + 36}
            y1={TOP + 36}
            x2={meshShared - 32}
            y2={BOT - 32}
            label="I1"
            caption={`${question.i1} A`}
          />
          <MeshLoop
            x1={meshShared + 32}
            y1={TOP + 36}
            x2={meshRight - 32}
            y2={BOT - 32}
            label="I2"
            caption={`${question.i2} A`}
          />
        </>
      ) : null}
      {supernode ? (
        <>
          <text
            x={snR1Mid}
            y={TOP - 14}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            {dropSnR1
              ? placed != null
                ? `${placed} Ω`
                : "R"
              : `${question.knownOhm} Ω`}
          </text>
          <text
            x={snVsMid}
            y={TOP - 32}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            {question.vs} V
          </text>
          <text
            x={snVsMid - 42}
            y={TOP - 32}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            +
          </text>
          <text
            x={snVsMid + 42}
            y={TOP - 32}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            −
          </text>
          <text
            x={snA}
            y={TOP - 14}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            Va {question.nodeVolts} V
          </text>
          <text
            x={snB}
            y={TOP - 14}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            Vb {question.nodeVolts2} V
          </text>
          <text
            x={snA + 16}
            y={midY + 5}
            className="circuit-label thev-tag"
          >
            {dropSnRa
              ? placed != null
                ? `${placed} Ω`
                : "R"
              : `${question.knownOhm2} Ω`}
          </text>
          <text
            x={snB + 16}
            y={midY + 5}
            className="circuit-label thev-tag"
          >
            {dropSnRb
              ? placed != null
                ? `${placed} Ω`
                : "R"
              : `${question.knownOhm3} Ω`}
          </text>
        </>
      ) : null}
      {superpos ? (
        <>
          <text
            x={spR1Mid}
            y={TOP - 14}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            {question.knownOhm} Ω
          </text>
          <text
            x={spR2Mid}
            y={TOP - 14}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            {question.knownOhm2} Ω
          </text>
          <text
            x={spNode + 16}
            y={midY + 5}
            className="circuit-label thev-tag"
          >
            {placed != null ? `${placed} Ω` : "R"}
          </text>
          <text x="500" y="150" className="circuit-label">
            {question.volts2} V
          </text>
          <text x="438" y="134" className="circuit-label">
            +
          </text>
          <text x="438" y="170" className="circuit-label">
            −
          </text>
        </>
      ) : null}
      {kind === "parallel" || idiv ? (
        <text x={parKnownX + 18} y={midY + 6} className="circuit-label">
          {question.knownOhm} Ω
        </text>
      ) : null}
      {vdiv ? (
        <>
          <text
            x={(150 + 290) / 2}
            y={TOP - 14}
            textAnchor="middle"
            className="circuit-label thev-tag"
          >
            {question.knownOhm} Ω
          </text>
          <text
            x={290 + 22}
            y={midY + 5}
            className="circuit-label thev-tag"
          >
            {placed != null ? `${placed} Ω` : "R2"}
          </text>
          <text x={298} y={TOP - 14} className="circuit-label thev-tag">
            Vo {question.nodeVolts} V
          </text>
        </>
      ) : null}
      {kind === "nodal" ? (
        compactNodal ? (
          <>
            {isrc || dropSrc ? null : (
              <text
                x={(r1Left + nodeX) / 2}
                y={TOP - 28}
                textAnchor="middle"
                className="circuit-label thev-tag"
              >
                {question.knownOhm} Ω
              </text>
            )}
            {four ? (
              <text
                x={extraX + 22}
                y={midY + 5}
                className="circuit-label thev-tag"
              >
                {question.knownOhm3} Ω
              </text>
            ) : null}
            <text
              x={nodalKnownX + 22}
              y={midY + 5}
              className="circuit-label thev-tag"
            >
              {isrc || dropSrc ? question.knownOhm : question.knownOhm2} Ω
            </text>
            {dropSrc ? (
              <text
                x={(r1Left + nodeX) / 2}
                y={TOP - 28}
                textAnchor="middle"
                className="circuit-label thev-tag"
              >
                {placed != null ? `${placed} Ω` : "R"}
              </text>
            ) : (
              <text
                x={nodalGapX + 22}
                y={midY + 5}
                className="circuit-label thev-tag"
              >
                {placed != null ? `${placed} Ω` : "R"}
              </text>
            )}
            {dropSrc ? (
              <text
                x={nodalGapX + 22}
                y={midY + 5}
                className="circuit-label thev-tag"
              >
                {question.knownOhm2} Ω
              </text>
            ) : null}
            <text
              x={nodeX + 22}
              y={TOP - 14}
              className="circuit-label thev-tag"
            >
              {question.nodeVolts} V
            </text>
          </>
        ) : (
          <>
            {dropSrc ? null : (
              <text
                x={(r1Left + nodeX) / 2}
                y={TOP - 28}
                textAnchor="middle"
                className="circuit-label thev-tag"
              >
                {question.knownOhm} Ω
              </text>
            )}
            <text x={nodalKnownX - 52} y={midY + 6} className="circuit-label">
              {dropSrc ? question.knownOhm : question.knownOhm2} Ω
            </text>
            {dropSrc ? (
              <text x={nodalGapX + 22} y={midY + 6} className="circuit-label">
                {question.knownOhm2} Ω
              </text>
            ) : null}
            {dropSrc ? (
              <text
                x={(r1Left + nodeX) / 2}
                y={TOP - 28}
                textAnchor="middle"
                className="circuit-label thev-tag"
              >
                {placed != null ? `${placed} Ω` : "R"}
              </text>
            ) : (
              <text
                x={nodalGapX + 22}
                y={midY + 5}
                className="circuit-label thev-tag"
              >
                {placed != null ? `${placed} Ω` : "R"}
              </text>
            )}
            <text x={nodeX + 10} y={TOP - 14} className="circuit-label thev-tag">
              {question.nodeVolts} V
            </text>
          </>
        )
      ) : null}
      {!thevRth && !nortonRn ? (
        <>
          <Dot x={LEFT} y={TOP} />
          <Dot x={LEFT} y={BOT} />
          <Dot x={railEnd} y={TOP} />
          <Dot x={railEnd} y={BOT} />
        </>
      ) : null}
      {kind === "series" ? (
        <>
          <Dot x={seriesX} y={TOP} big />
          <Dot x={seriesX} y={BOT} big />
        </>
      ) : null}
      {kind === "parallel" || idiv ? (
        <>
          <Dot x={parSlotX} y={TOP} big />
          <Dot x={parSlotX} y={BOT} big />
          <Dot x={parKnownX} y={TOP} big />
          <Dot x={parKnownX} y={BOT} big />
        </>
      ) : null}
      {vdiv ? (
        <>
          <Dot x={290} y={TOP} big />
          <Dot x={290} y={BOT} big />
        </>
      ) : null}
      {kind === "nodal" ? (
        <>
          <Dot x={nodeX} y={TOP} big />
          {four ? (
            <>
              <Dot x={extraX} y={TOP} big />
              <Dot x={extraX} y={BOT} big />
            </>
          ) : null}
          <Dot x={nodalKnownX} y={TOP} big />
          <Dot x={nodalKnownX} y={BOT} big />
          <Dot x={nodalGapX} y={TOP} big />
          <Dot x={nodalGapX} y={BOT} big />
        </>
      ) : null}
      {kind === "nodal" && !isrc ? (
        <IsArrow
          fromX={LEFT + 28}
          toX={Math.min(r1Left - 2, nodeX - 16)}
          y={TOP - 18}
        />
      ) : null}
      {mesh || supermesh ? (
        <>
          <Dot x={meshShared} y={TOP} big />
          <Dot x={meshShared} y={BOT} big />
          <Dot x={meshRight} y={TOP} big />
          <Dot x={meshRight} y={BOT} big />
        </>
      ) : null}
      {supernode ? (
        <>
          <Dot x={snA} y={TOP} big />
          <Dot x={snA} y={BOT} big />
          <Dot x={snB} y={TOP} big />
          <Dot x={snB} y={BOT} big />
        </>
      ) : null}
      {superpos ? (
        <>
          <Dot x={spNode} y={TOP} big />
          <Dot x={spNode} y={BOT} big />
          <Dot x={spRight} y={TOP} big />
          <Dot x={spRight} y={BOT} big />
        </>
      ) : null}
      {thevLoad || nortonLoad ? (
        <>
          <Dot x={nodeX} y={TOP} big />
          <Dot x={loadX} y={TOP} big />
          <Dot x={loadX} y={BOT} big />
        </>
      ) : null}
      {kind === "series" || kind === "parallel" || idiv ? (
        <g fill="currentColor" stroke="currentColor">
          <line
            x1={LEFT + 48}
            y1={TOP}
            x2={LEFT + 82}
            y2={TOP}
            strokeWidth="2.5"
          />
          <polygon
            points={`${LEFT + 92},${TOP} ${LEFT + 80},${TOP - 6} ${LEFT + 80},${TOP + 6}`}
            stroke="none"
          />
        </g>
      ) : null}
      {thevLoad || nortonLoad ? (
        <DownCurrent
          x={loadX - 42}
          y1={TOP + 22}
          y2={BOT - 18}
          label="I"
          sub="L"
          labelSide="left"
        />
      ) : null}
      {!meshQuiz ? (
      <foreignObject
        x={slotBox.x}
        y={slotBox.y}
        width={slotBox.width}
        height={slotBox.height}
        overflow="hidden"
      >
        <Slot
          slotRef={slotRef}
          drag={drag}
          placed={placed}
          revealed={revealed}
          ok={ok}
          hard={hard}
          hideBody={thevRth || thevLoad || nortonRn || nortonLoad || compactNodal || kind === "nodal" || mesh || supermesh || supernode || superpos || vdiv}
        >
          {thevRth || thevLoad || nortonRn || nortonLoad || compactNodal || kind === "nodal" || mesh || supermesh || supernode || superpos || vdiv ? "" : "R"}
        </Slot>
      </foreignObject>
      ) : null}
      </g>
    </svg>
  );
}
