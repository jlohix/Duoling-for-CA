import {
  Arrow,
  Box,
  Capacitor,
  Frame,
  Inductor,
  OpAmp,
  OpenGap,
  Resistor,
  Battery,
  hot,
  samplePath,
  MathLabel,
  PlotAxes,
} from "../components/LabDraw";

function MapView() {
  return (
    <Frame label="C and L map">
      <Box x={40} y={90} w={140} h={100} cls="hot" title="$C$" titleSize={22} />
      <Arrow x1={192} y={140} x2={228} cls="hot" />
      <Box x={236} y={90} w={140} h={100} cls="hot" title="$L$" titleSize={22} />
      <Arrow x1={388} y={140} x2={424} cls="hot" />
      <Box x={432} y={90} w={110} h={100} cls="hot" title="1st" titleSize={16} />
    </Frame>
  );
}

function OprealView() {
  return (
    <Frame label="Op-amp as a VCVS">
      <OpAmp x={148} y={140} cls="hot" />
      <MathLabel
        x={252}
        y={100}
        w={300}
        h={80}
        tex="$v_o=A(v_p-v_n)$"
        cls="board-formula board-formula-near"
      />
    </Frame>
  );
}

function OpidealView() {
  const limitCls = "hot board-formula box-math-lg";
  return (
    <Frame label="Ideal op-amp limits">
      <Box
        x={18}
        y={44}
        w={170}
        h={132}
        cls="hot"
        title={String.raw`$A \to ∞$`}
        titleCls={limitCls}
      />
      <Box
        x={196}
        y={44}
        w={170}
        h={132}
        cls="hot"
        title={String.raw`$R_i \to ∞$`}
        titleCls={limitCls}
      />
      <Box
        x={374}
        y={44}
        w={168}
        h={132}
        cls="hot"
        title={String.raw`$R_o = 0$`}
        titleCls={limitCls}
      />
      <MathLabel
        x={40}
        y={188}
        w={480}
        h={72}
        tex={String.raw`$i_p = i_n = 0,\quad v_p = v_n$`}
        cls="board-formula box-math-lg"
      />
    </Frame>
  );
}

function FeedbackView({ highlight }) {
  const labelCls = "board-formula box-math-lg";
  return (
    <Frame label="Negative feedback loop">
      <Box
        x={24}
        y={70}
        w={150}
        h={120}
        cls={hot(highlight, "a")}
        title={String.raw`$A$`}
        titleCls={labelCls}
      />
      <Arrow x1={182} y={130} x2={228} cls="hot" />
      <Box
        x={236}
        y={70}
        w={150}
        h={120}
        cls={hot(highlight, "beta")}
        title={String.raw`$-β$`}
        titleCls={labelCls}
      />
      <Arrow x1={394} y={130} x2={438} cls="hot" />
      <Box
        x={446}
        y={70}
        w={96}
        h={120}
        cls="hot"
        title={String.raw`$v_o$`}
        titleCls={labelCls}
      />
    </Frame>
  );
}

function Ground({ x, y, cls }) {
  return (
    <g
      className={cls}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <path d={`M${x} ${y} V${y + 22}`} />
      <path d={`M${x - 16} ${y + 22} H${x + 16}`} />
      <path d={`M${x - 10} ${y + 30} H${x + 10}`} />
      <path d={`M${x - 5} ${y + 38} H${x + 5}`} />
    </g>
  );
}

function InvView({ highlight }) {
  const ampX = 280;
  const midY = 136;
  const minusY = 108;
  const plusY = 164;
  const outX = ampX + 96;
  const sumX = 208;
  const r1x = 56;
  const r1End = r1x + 112;
  const r2y = 40;
  const r2End = sumX + 112;
  const railX = 430;
  const voX = 500;
  const gndX = ampX - 24;
  return (
    <Frame label="Inverting op-amp">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          className={hot(highlight, "all")}
          d={`M${ampX} ${midY - 48} L${outX} ${midY} L${ampX} ${midY + 48} Z`}
        />
        <path className={hot(highlight, "kcl")} d={`M24 ${minusY} H${r1x}`} />
        <Resistor x={r1x} y={minusY} cls={hot(highlight, "kcl")} />
        <path
          className={hot(highlight, "kcl")}
          d={`M${r1End} ${minusY} H${sumX} H${ampX}`}
        />
        <path className={hot(highlight, "fb")} d={`M${sumX} ${minusY} V${r2y}`} />
        <Resistor x={sumX} y={r2y} cls={hot(highlight, "fb")} />
        <path
          className={hot(highlight, "fb")}
          d={`M${r2End} ${r2y} H${railX} V${midY} H${outX}`}
        />
        <path className={hot(highlight, "all")} d={`M${outX} ${midY} H${voX}`} />
        <path
          className={hot(highlight, "all")}
          d={`M${ampX} ${plusY} H${gndX}`}
        />
      </g>
      <Ground x={gndX} y={plusY} cls={hot(highlight, "all")} />
      <circle cx="24" cy={minusY} r="3.5" fill="currentColor" />
      <circle cx={sumX} cy={minusY} r="4" fill="currentColor" />
      <circle cx={outX} cy={midY} r="3.5" fill="currentColor" />
      <circle cx={voX} cy={midY} r="3.5" fill="currentColor" />
      <text x={ampX + 14} y={minusY + 6} className="circuit-label">
        −
      </text>
      <text x={ampX + 16} y={plusY + 6} className="circuit-label">
        +
      </text>
      <MathLabel x={4} y={minusY + 12} w={88} h={36} tex="$v_{in}$" />
      <MathLabel x={r1x + 6} y={minusY + 16} w={100} h={36} tex="$R_1$" cls={hot(highlight, "kcl")} />
      <MathLabel x={sumX + 16} y={4} w={100} h={36} tex="$R_2$" cls={hot(highlight, "fb")} />
      <MathLabel x={voX - 8} y={midY - 40} w={72} h={36} tex="$v_o$" />
    </Frame>
  );
}

function NinvView({ highlight }) {
  const ampX = 300;
  const midY = 136;
  const minusY = 108;
  const plusY = 164;
  const outX = ampX + 96;
  const tapX = 228;
  const r2y = 40;
  const r2End = tapX + 112;
  const railX = 450;
  const voX = 520;
  const r1y = 220;
  const r1x = tapX - 112;
  return (
    <Frame label="Non-inverting op-amp">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          className={hot(highlight, "all")}
          d={`M${ampX} ${midY - 48} L${outX} ${midY} L${ampX} ${midY + 48} Z`}
        />
        <path className={hot(highlight, "all")} d={`M24 ${plusY} H${ampX}`} />
        <path
          className={hot(highlight, "div")}
          d={`M${tapX} ${minusY} H${ampX}`}
        />
        <path className={hot(highlight, "div")} d={`M${tapX} ${minusY} V${r1y}`} />
        <Resistor x={r1x} y={r1y} cls={hot(highlight, "div")} />
        <path className={hot(highlight, "div")} d={`M${tapX} ${minusY} V${r2y}`} />
        <Resistor x={tapX} y={r2y} cls={hot(highlight, "div")} />
        <path
          className={hot(highlight, "div")}
          d={`M${r2End} ${r2y} H${railX} V${midY} H${outX}`}
        />
        <path className={hot(highlight, "all")} d={`M${outX} ${midY} H${voX}`} />
      </g>
      <Ground x={r1x} y={r1y} cls={hot(highlight, "div")} />
      <circle cx="24" cy={plusY} r="3.5" fill="currentColor" />
      <circle cx={tapX} cy={minusY} r="4" fill="currentColor" />
      <circle cx={outX} cy={midY} r="3.5" fill="currentColor" />
      <circle cx={voX} cy={midY} r="3.5" fill="currentColor" />
      <text x={ampX + 14} y={minusY + 6} className="circuit-label">
        −
      </text>
      <text x={ampX + 16} y={plusY + 6} className="circuit-label">
        +
      </text>
      <MathLabel x={4} y={plusY + 12} w={88} h={36} tex="$v_{in}$" />
      <MathLabel x={r1x + 8} y={r1y - 40} w={100} h={36} tex="$R_1$" cls={hot(highlight, "div")} />
      <MathLabel x={tapX + 16} y={4} w={100} h={36} tex="$R_2$" cls={hot(highlight, "div")} />
      <MathLabel x={voX - 8} y={midY - 40} w={72} h={36} tex="$v_o$" />
    </Frame>
  );
}

function SeriesRcLoop({ y, open, showIv = false, showFormula = true }) {
  const top = y;
  const bot = y + 90;
  const left = 48;
  const right = 500;
  return (
    <g className="hot">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={`M${left} ${bot} V${top}`} />
        <Battery x={left} y={top} />
        <path d={`M${left + 72} ${top} H128`} />
        <Resistor x={128} y={top} />
        <path d={`M${240} ${top} H256`} />
        {open ? <OpenGap x={256} y={top} /> : <Capacitor x={256} y={top} />}
        <path d={`M${330} ${top} H${right} V${bot} H${left}`} />
      </g>
      <text x={76} y={top + 44} textAnchor="middle" className="circuit-part">
        Vs
      </text>
      <text x={184} y={top + 44} textAnchor="middle" className="circuit-part">
        R
      </text>
      <text x={293} y={top + 44} textAnchor="middle" className="circuit-part">
        {open ? "open" : "C"}
      </text>
      {showIv && !open ? (
        <>
          <Arrow x1={348} y={top} x2={430} />
          <text x={389} y={top - 16} textAnchor="middle" className="circuit-part">
            i
          </text>
          <text x={293} y={top - 32} textAnchor="middle" className="circuit-part">
            v
          </text>
        </>
      ) : null}
      {showFormula ? (
        <text x={open ? 340 : 336} y={top - 6} className="board-formula">
          {open ? "i = 0" : "i = C dv/dt"}
        </text>
      ) : null}
    </g>
  );
}

function SeriesRlLoop({ y, short, showIv = false, showFormula = true }) {
  const top = y;
  const bot = y + 90;
  const left = 48;
  const right = 500;
  const lX = 248;
  const lEnd = lX + 120;
  return (
    <g>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={`M${left} ${bot} V${top}`} />
        <Battery x={left} y={top} />
        <path d={`M${left + 72} ${top} H128`} />
        <Resistor x={128} y={top} />
        <path d={`M${240} ${top} H${lX}`} />
        {short ? <path d={`M${lX} ${top} H${lEnd}`} /> : <Inductor x={lX} y={top} />}
        <path d={`M${lEnd} ${top} H${right} V${bot} H${left}`} />
      </g>
      <text x={76} y={top + 44} textAnchor="middle" className="circuit-part">
        Vs
      </text>
      <text x={184} y={top + 44} textAnchor="middle" className="circuit-part">
        R
      </text>
      <text x={lX + 60} y={top + 44} textAnchor="middle" className="circuit-part">
        {short ? "short" : "L"}
      </text>
      {showIv && !short ? (
        <>
          <Arrow x1={lEnd + 12} y={top} x2={lEnd + 90} />
          <text x={lEnd + 51} y={top - 16} textAnchor="middle" className="circuit-part">
            i
          </text>
          <text x={lX + 60} y={top - 32} textAnchor="middle" className="circuit-part">
            v
          </text>
        </>
      ) : null}
      {showFormula ? (
        <text x={lEnd + 8} y={top - 6} className="board-formula">
          {short ? "v = 0" : "v = L di/dt"}
        </text>
      ) : null}
    </g>
  );
}

function CapView({ highlight }) {
  if (highlight === "eq") {
    const sL = 36;
    const sR = 244;
    const sT = 96;
    const sB = 186;
    const pL = 316;
    const pR = 524;
    const pT = 86;
    const pB = 196;
    const pCap = 383;
    return (
      <Frame label="Series and parallel capacitors">
        <text x={140} y={32} textAnchor="middle" className="board-title">
          Series
        </text>
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={`M${sL} ${sB} V${sT} H52`} />
          <Capacitor x={52} y={sT} />
          <Capacitor x={126} y={sT} />
          <path d={`M200 ${sT} H${sR} V${sB} H${sL}`} />
        </g>
        <text x={89} y={sT + 44} textAnchor="middle" className="circuit-part">
          C1
        </text>
        <text x={163} y={sT + 44} textAnchor="middle" className="circuit-part">
          C2
        </text>
        <MathLabel x={8} y={228} w={264} h={48} tex="$1/C_{eq}=1/C_1+1/C_2$" cls="board-formula" />

        <text x={420} y={32} textAnchor="middle" className="board-title">
          Parallel
        </text>
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={`M${pL} ${pT} H${pCap}`} />
          <Capacitor x={pCap} y={pT} />
          <path d={`M${pCap + 74} ${pT} H${pR} V${pB} H${pCap + 74}`} />
          <Capacitor x={pCap} y={pB} />
          <path d={`M${pCap} ${pB} H${pL} V${pT}`} />
        </g>
        <circle cx={pL} cy={pT} r="4" fill="currentColor" />
        <circle cx={pL} cy={pB} r="4" fill="currentColor" />
        <circle cx={pR} cy={pT} r="4" fill="currentColor" />
        <circle cx={pR} cy={pB} r="4" fill="currentColor" />
        <text x={pCap + 37} y={pT + 44} textAnchor="middle" className="circuit-part">
          C1
        </text>
        <text x={pCap + 37} y={pB - 28} textAnchor="middle" className="circuit-part">
          C2
        </text>
        <MathLabel x={288} y={228} w={264} h={48} tex="$C_{eq}=C_1+C_2$" cls="board-formula" />
      </Frame>
    );
  }
  if (highlight === "w") {
    return (
      <Frame label="Energy in a capacitor">
        <Capacitor x={200} y={130} />
        <text x={280} y={36} textAnchor="middle" className="board-formula">
          w = ½ C v²
        </text>
      </Frame>
    );
  }
  if (highlight === "c") {
    return (
      <Frame label="Capacitor law">
        <text x={280} y={36} textAnchor="middle" className="board-formula">
          i = C dv/dt
        </text>
        <SeriesRcLoop y={90} open={false} showIv showFormula={false} />
      </Frame>
    );
  }
  return (
    <Frame label="Capacitor in a DC loop">
      <SeriesRcLoop y={90} open={false} />
      <text x={280} y={36} textAnchor="middle" className="board-title">
        Battery, resistor, and capacitor
      </text>
    </Frame>
  );
}

function CapOpenView() {
  return (
    <Frame label="Replace the capacitor with an open circuit" height={440}>
      <text x={280} y={20} textAnchor="middle" className="board-step">
        1. Capacitor still in the loop
      </text>
      <SeriesRcLoop y={50} open={false} />
      <text x={280} y={176} textAnchor="middle" className="board-title">
        Same Vs and R — only C changes
      </text>
      <path
        d="M280 190 V224 M268 212 L280 228 L292 212"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <text x={280} y={258} textAnchor="middle" className="board-step">
        2. For t &gt; 0, draw C as an open
      </text>
      <SeriesRcLoop y={292} open={true} />
      <text x={280} y={426} textAnchor="middle" className="board-title">
        Voltage has stopped changing, so i = 0
      </text>
    </Frame>
  );
}

function IndView({ highlight }) {
  if (highlight === "eq") {
    const sT = 96;
    const pT = 80;
    const pB = 196;
    return (
      <Frame label="Series and parallel inductors">
        <text x={140} y={32} textAnchor="middle" className="board-title">
          Series
        </text>
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={`M20 186 V${sT} H16`} />
          <Inductor x={16} y={sT} />
          <Inductor x={136} y={sT} />
          <path d={`M256 ${sT} H268 V186 H20`} />
        </g>
        <text x={76} y={sT + 44} textAnchor="middle" className="circuit-part">
          L1
        </text>
        <text x={196} y={sT + 44} textAnchor="middle" className="circuit-part">
          L2
        </text>
        <MathLabel x={8} y={228} w={264} h={48} tex="$L_{eq}=L_1+L_2$" cls="board-formula" />

        <text x={420} y={32} textAnchor="middle" className="board-title">
          Parallel
        </text>
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={`M316 ${pT} H330`} />
          <Inductor x={330} y={pT} />
          <path d={`M450 ${pT} H540 V${pB} H450`} />
          <Inductor x={330} y={pB} />
          <path d={`M330 ${pB} H316 V${pT}`} />
        </g>
        <circle cx={316} cy={pT} r="4" fill="currentColor" />
        <circle cx={316} cy={pB} r="4" fill="currentColor" />
        <circle cx={540} cy={pT} r="4" fill="currentColor" />
        <circle cx={540} cy={pB} r="4" fill="currentColor" />
        <text x={390} y={pT + 44} textAnchor="middle" className="circuit-part">
          L1
        </text>
        <text x={390} y={pB - 28} textAnchor="middle" className="circuit-part">
          L2
        </text>
        <MathLabel x={288} y={228} w={264} h={48} tex="$1/L_{eq}=1/L_1+1/L_2$" cls="board-formula" />
      </Frame>
    );
  }
  if (highlight === "w") {
    return (
      <Frame label="Energy in an inductor">
        <text x={280} y={36} textAnchor="middle" className="board-formula">
          w = ½ L i²
        </text>
        <SeriesRlLoop y={90} short={false} showFormula={false} />
      </Frame>
    );
  }
  return (
    <Frame label="Inductor law">
      <text x={280} y={36} textAnchor="middle" className="board-formula">
        v = L di/dt
      </text>
      <SeriesRlLoop y={90} short={false} showIv showFormula={false} />
    </Frame>
  );
}

function IndShortView() {
  return (
    <Frame label="Replace the inductor with a short circuit" height={440}>
      <text x={280} y={20} textAnchor="middle" className="board-step">
        1. Inductor still in the loop
      </text>
      <SeriesRlLoop y={50} short={false} />
      <text x={280} y={176} textAnchor="middle" className="board-title">
        Same Vs and R — only L changes
      </text>
      <path
        d="M280 190 V224 M268 212 L280 228 L292 212"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <text x={280} y={258} textAnchor="middle" className="board-step">
        2. For t &gt; 0, draw L as a short
      </text>
      <SeriesRlLoop y={292} short={true} />
      <text x={280} y={426} textAnchor="middle" className="board-title">
        Current has stopped changing, so v = 0
      </text>
    </Frame>
  );
}

function FreeRcView() {
  const top = 110;
  const bot = 210;
  return (
    <Frame label="Charged capacitor dumping into R">
      <text x={280} y={32} textAnchor="middle" className="board-title">
        Source-free: no battery
      </text>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={`M80 ${bot} V${top} H120`} />
        <Capacitor x={120} y={top} />
        <path d={`M194 ${top} H250`} />
        <Resistor x={250} y={top} />
        <path d={`M362 ${top} H480 V${bot} H80`} />
      </g>
      <text x={157} y={top + 44} textAnchor="middle" className="circuit-part">
        C
      </text>
      <text x={306} y={top + 44} textAnchor="middle" className="circuit-part">
        R
      </text>
      <MathLabel
        x={140}
        y={bot + 12}
        w={280}
        h={44}
        tex="$v(t)=v(0)e^{-t/\\tau}$"
        cls="board-formula"
      />
    </Frame>
  );
}

function DecayCView({ highlight }) {
  const points = samplePath((t) => ({
    x: 56 + t * 460,
    y: 220 - 155 * Math.exp(-3 * t),
  }));
  return (
    <Frame label="Source-free RC decay">
      <PlotAxes x0={56} y0={220} x1={528} y1={52} xLabel="t" yLabel="v(t)" />
      <polyline
        className={hot(highlight, "curve")}
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <g transform="translate(78 26) scale(0.48)">
        <Capacitor x={0} y={0} cls={hot(highlight, "all")} />
      </g>
      <g transform="translate(128 26) scale(0.48)">
        <Resistor x={0} y={0} cls={hot(highlight, "all")} />
      </g>
      <text x={196} y={36} className="board-formula-lg">
        τ = RC
      </text>
    </Frame>
  );
}

function RlLoopView() {
  return (
    <Frame label="RL with a source">
      <text x={280} y={32} textAnchor="middle" className="board-title">
        Source stays on
      </text>
      <SeriesRlLoop y={110} short={false} showIv showFormula={false} />
      <MathLabel
        x={120}
        y={222}
        w={320}
        h={44}
        tex="$V_s=Ri+L\\,di/dt$"
        cls="board-formula"
      />
    </Frame>
  );
}

function RlstepView({ highlight }) {
  const points = samplePath((t) => ({
    x: 56 + t * 460,
    y: 220 - 130 * (1 - Math.exp(-3 * t)),
  }));
  return (
    <Frame label="RL with a source">
      <PlotAxes x0={56} y0={220} x1={528} y1={52} xLabel="t" yLabel="i(t)" />
      <polyline
        className={hot(highlight, "curve")}
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <g transform="translate(40 26) scale(0.42)">
        <Battery x={0} y={0} cls={hot(highlight, "all")} />
      </g>
      <g transform="translate(82 26) scale(0.42)">
        <Resistor x={0} y={0} cls={hot(highlight, "all")} />
      </g>
      <g transform="translate(138 26) scale(0.42)">
        <Inductor x={0} y={0} cls={hot(highlight, "all")} />
      </g>
      <text x={216} y={36} className="board-formula-lg">
        τ = L/R
      </text>
    </Frame>
  );
}

const VIEWS = {
  map: MapView,
  opreal: OprealView,
  opideal: OpidealView,
  feedback: FeedbackView,
  inv: InvView,
  ninv: NinvView,
  cap: CapView,
  capopen: CapOpenView,
  ind: IndView,
  indshort: IndShortView,
  decayc: DecayCView,
  freerc: FreeRcView,
  rlloop: RlLoopView,
  rlstep: RlstepView,
};

export default function Section3Schematic({ view = "map", highlight = "all" }) {
  const View = VIEWS[view] || MapView;
  return <View highlight={highlight} />;
}
