import {
  Arrow,
  Battery,
  Box,
  Capacitor,
  Frame,
  Inductor,
  Resistor,
  hot,
  samplePath,
  MathLabel,
} from "../components/LabDraw";

function MapView({ highlight }) {
  return (
    <Frame label="Time domain maps to frequency domain">
      <Box
        x={24}
        y={78}
        w={200}
        h={110}
        cls={hot(highlight, "time")}
        title="$f(t)$"
        sub="Time Domain"
      />
      <Arrow x1={236} y={133} x2={292} cls={hot(highlight, "map")} />
      <text
        x={264}
        y={118}
        textAnchor="middle"
        className={`circuit-label ${hot(highlight, "map")}`}
        fontSize="13"
        fontWeight="800"
      >
        LT
      </text>
      <Box
        x={304}
        y={78}
        w={232}
        h={110}
        cls={hot(highlight, "s")}
        title="$F(s)$"
        sub="Frequency Domain"
      />
    </Frame>
  );
}

function GuideView({ highlight }) {
  return (
    <Frame label="Laplace circuit method in three steps">
      <Box x={16} y={78} w={152} h={110} cls={hot(highlight, "time")} title="circuit" sub="time" titleSize={18} />
      <Arrow x1={176} y={133} x2={208} cls={hot(highlight, "map")} />
      <Box x={216} y={78} w={152} h={110} cls={hot(highlight, "s")} title="algebra" sub="in s" titleSize={18} />
      <Arrow x1={376} y={133} x2={408} cls={hot(highlight, "inv")} />
      <Box x={416} y={78} w={128} h={110} cls={hot(highlight, "inv")} title="$f(t)$" sub="inverse" titleSize={18} />
    </Frame>
  );
}

function DerivView({ highlight }) {
  return (
    <Frame label="A time derivative becomes sF minus f of 0 minus">
      <Box
        x={20}
        y={78}
        w={176}
        h={110}
        cls={hot(highlight, "dt")}
        title="$\\dfrac{df}{dt}$"
        sub="Time Domain"
      />
      <Arrow x1={206} y={133} x2={256} cls={hot(highlight, "map")} />
      <Box
        x={264}
        y={78}
        w={272}
        h={110}
        cls={hot(highlight, "s")}
        title="$sF-f(0^-)$"
        sub="algebra in s"
        titleSize={20}
      />
    </Frame>
  );
}

function IntegView({ highlight }) {
  return (
    <Frame label="Time integration becomes divide by s">
      <Box
        x={20}
        y={78}
        w={196}
        h={110}
        cls={hot(highlight, "dt")}
        title="$\\int f\\,d\\tau$"
        sub="0 to t"
      />
      <Arrow x1={226} y={133} x2={278} cls={hot(highlight, "map")} />
      <Box
        x={286}
        y={78}
        w={250}
        h={110}
        cls={hot(highlight, "s")}
        title="$F(s)/s$"
        sub="Time Integration"
      />
    </Frame>
  );
}

function DelayView({ highlight }) {
  return (
    <Frame label="Time shift multiplies by e to the minus a s">
      <Box
        x={20}
        y={78}
        w={230}
        h={110}
        cls={hot(highlight, "time")}
        title="$f(t-a)u(t-a)$"
        sub="Time Shift"
        titleSize={18}
      />
      <Arrow x1={260} y={133} x2={308} cls={hot(highlight, "map")} />
      <Box
        x={316}
        y={78}
        w={220}
        h={110}
        cls={hot(highlight, "s")}
        title="$e^{-as}F(s)$"
        sub="wait, then start"
        titleSize={18}
      />
    </Frame>
  );
}

function ScaleView({ highlight }) {
  return (
    <Frame label="Time scaling">
      <Box x={28} y={78} w={200} h={110} cls={hot(highlight, "time")} title="$f(at)$" sub="squeeze time" />
      <Arrow x1={238} y={133} x2={292} cls={hot(highlight, "map")} />
      <Box
        x={300}
        y={78}
        w={236}
        h={110}
        cls={hot(highlight, "s")}
        title="$\\dfrac{1}{a}F(s/a)$"
        sub="$a>0$"
        titleSize={18}
      />
    </Frame>
  );
}

function FreqDiffView({ highlight }) {
  return (
    <Frame label="Multiply by t is minus dF/ds">
      <Box x={28} y={78} w={196} h={110} cls={hot(highlight, "time")} title="$t f(t)$" sub="Time Domain" />
      <Arrow x1={234} y={133} x2={286} cls={hot(highlight, "map")} />
      <Box x={294} y={78} w={236} h={110} cls={hot(highlight, "s")} title="$-\\dfrac{dF}{ds}$" sub="Frequency Domain" titleSize={22} />
    </Frame>
  );
}

function InitFinalView({ highlight }) {
  return (
    <Frame label="Initial and final value theorems">
      <Box x={24} y={78} w={246} h={110} cls={hot(highlight, "init")} title="$f(0)$" sub="$\\lim_{s\\to\\infty} sF(s)$" titleSize={22} />
      <Box x={290} y={78} w={246} h={110} cls={hot(highlight, "fin")} title="$f(\\infty)$" sub="$\\lim_{s\\to 0} sF(s)$" titleSize={22} />
    </Frame>
  );
}

function ElementsView({ highlight }) {
  return (
    <Frame label="R, L, and C impedances in the s-domain">
      <Resistor x={28} y={118} cls={hot(highlight, "r")} />
      <Inductor x={198} y={118} cls={hot(highlight, "l")} />
      <Capacitor x={390} y={118} cls={hot(highlight, "c")} />
      <MathLabel x={24} y={168} w={120} h={40} tex="$V=RI$" cls={hot(highlight, "r")} />
      <MathLabel x={194} y={168} w={140} h={40} tex="$V=sL\\,I$" cls={hot(highlight, "l")} />
      <MathLabel x={368} y={168} w={150} h={40} tex="$V=I/(sC)$" cls={hot(highlight, "c")} />
      <text x="280" y="248" textAnchor="middle" className="circuit-label" fontSize="14" fontWeight="700">
        Zero initial conditions
      </text>
    </Frame>
  );
}

function LinearView({ highlight }) {
  return (
    <Frame label="Linearity: scale and add">
      <Box x={16} y={86} w={150} h={96} cls={hot(highlight, "f")} title="$a_1 F_1$" titleSize={18} />
      <text
        x={178}
        y={144}
        className={`circuit-label ${hot(highlight, "sum")}`}
        fontSize="26"
        fontWeight="800"
      >
        +
      </text>
      <Box x={204} y={86} w={150} h={96} cls={hot(highlight, "g")} title="$a_2 F_2$" titleSize={18} />
      <text
        x={366}
        y={144}
        className={`circuit-label ${hot(highlight, "sum")}`}
        fontSize="26"
        fontWeight="800"
      >
        =
      </text>
      <Box x={392} y={86} w={148} h={96} cls={hot(highlight, "sum")} title="sum" />
    </Frame>
  );
}

function ShiftView({ highlight }) {
  return (
    <Frame label="Multiply by e to the minus a t shifts F(s)">
      <Box
        x={24}
        y={78}
        w={220}
        h={110}
        cls={hot(highlight, "time")}
        title="$e^{-at}f(t)$"
        sub="Frequency Shift"
        titleSize={18}
      />
      <Arrow x1={254} y={133} x2={308} cls={hot(highlight, "map")} />
      <Box
        x={316}
        y={78}
        w={220}
        h={110}
        cls={hot(highlight, "s")}
        title="$F(s+a)$"
        sub="replace s by s+a"
      />
    </Frame>
  );
}

function IcView({ highlight }) {
  return (
    <Frame label="Non-zero initial conditions as extra sources">
      <text x="150" y="32" textAnchor="middle" className={`circuit-label ${hot(highlight, "l")}`} fontSize="15" fontWeight="800">
        Inductor
      </text>
      <Inductor x={80} y={70} cls={hot(highlight, "l")} />
      <MathLabel x={90} y={88} w={120} h={36} tex="$sL$" cls={hot(highlight, "l")} />
      <Battery x={80} y={148} cls={hot(highlight, "src")} />
      <MathLabel x={70} y={178} w={160} h={36} tex="$Li(0^-)$" cls={hot(highlight, "src")} />
      <text x="410" y="32" textAnchor="middle" className={`circuit-label ${hot(highlight, "c")}`} fontSize="15" fontWeight="800">
        Capacitor
      </text>
      <Capacitor x={360} y={70} cls={hot(highlight, "c")} />
      <MathLabel x={350} y={88} w={120} h={36} tex="$1/(sC)$" cls={hot(highlight, "c")} />
      <Battery x={360} y={148} cls={hot(highlight, "src")} />
      <MathLabel x={330} y={178} w={160} h={36} tex="$v(0^-)/s$" cls={hot(highlight, "src")} />
      <text x="280" y="248" textAnchor="middle" className="circuit-label" fontSize="13" fontWeight="700">
        Parallel: L uses i(0⁻)/s · C uses C v(0⁻)
      </text>
    </Frame>
  );
}

function TableView({ highlight }) {
  const rows = [
    { id: "imp", left: "$\\delta(t)$", right: "$1$" },
    { id: "step", left: "$u(t)$", right: "$1/s$" },
    { id: "exp", left: "$e^{-at}u(t)$", right: "$1/(s+a)$" },
  ];
  return (
    <Frame label="Common Laplace pairs">
      {rows.map((row, i) => (
        <g key={row.id} className={hot(highlight, row.id)}>
          <rect
            x="50"
            y={48 + i * 70}
            width="460"
            height="58"
            rx="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className={hot(highlight, row.id)}
          />
          <MathLabel x={60} y={52 + i * 70} w={180} h={50} tex={row.left} cls={hot(highlight, row.id)} />
          <MathLabel x={240} y={52 + i * 70} w={80} h={50} tex="$\\leftrightarrow$" cls={hot(highlight, row.id)} />
          <MathLabel x={320} y={52 + i * 70} w={180} h={50} tex={row.right} cls={hot(highlight, row.id)} />
        </g>
      ))}
    </Frame>
  );
}

function Axes() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M80 140 H500" />
      <path d="M280 40 V240" />
      <path d="M492 132 L500 140 L492 148" />
      <path d="M272 48 L280 40 L288 48" />
    </g>
  );
}

function PlaneView({ highlight }) {
  return (
    <Frame label="Poles and zeros on the s-plane">
      <Axes />
      <MathLabel x={500} y={124} w={50} h={36} tex="$\\sigma$" />
      <MathLabel x={268} y={8} w={50} h={36} tex="$j\\omega$" />
      <circle
        cx="218"
        cy="140"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className={hot(highlight, "zero")}
      />
      <text
        x="176"
        y="144"
        textAnchor="end"
        className={`circuit-label ${hot(highlight, "zero")}`}
        fontSize="13"
        fontWeight="800"
      >
        zero
      </text>
      <text
        x="150"
        y="78"
        className={`circuit-label ${hot(highlight, "pole")}`}
        fontSize="26"
        fontWeight="800"
      >
        ×
      </text>
      <text
        x="150"
        y="214"
        className={`circuit-label ${hot(highlight, "pole")}`}
        fontSize="26"
        fontWeight="800"
      >
        ×
      </text>
      <text
        x="128"
        y="236"
        className={`circuit-label ${hot(highlight, "pole")}`}
        fontSize="13"
        fontWeight="800"
      >
        poles
      </text>
      <text x="88" y="268" className={`circuit-label ${hot(highlight, "lhp")}`} fontSize="13" fontWeight="800">
        left: dies
      </text>
      <text x="400" y="268" className="circuit-label" fontSize="13" fontWeight="800">
        right: grows
      </text>
    </Frame>
  );
}

function DecayView({ highlight }) {
  const points = samplePath((t) => ({
    x: 50 + t * 470,
    y: 220 - 165 * Math.exp(-3 * t),
  }));
  return (
    <Frame label="A real pole makes a decaying exponential">
      <polyline
        className={hot(highlight, "curve")}
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text x={360} y={24} className={`circuit-label ${hot(highlight, "pole")}`} fontSize="14" fontWeight="800">
        pole at
      </text>
      <MathLabel x={430} y={4} w={90} h={40} tex="$-p$" cls={hot(highlight, "pole")} />
      <MathLabel x={40} y={236} w={220} h={44} tex="$k e^{-pt}$" cls={hot(highlight, "curve")} />
    </Frame>
  );
}

function BumpView({ highlight }) {
  const points = samplePath((t) => {
    const u = t * 6;
    return { x: 50 + t * 470, y: 230 - 280 * u * Math.exp(-u) };
  });
  return (
    <Frame label="A repeated pole makes t e to the minus a t">
      <polyline
        className={hot(highlight, "curve")}
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text
        x="300"
        y="32"
        textAnchor="middle"
        className={`circuit-label ${hot(highlight, "pole")}`}
        fontSize="16"
        fontWeight="800"
      >
        double pole
      </text>
      <text
        x="300"
        y="266"
        textAnchor="middle"
        className={`circuit-label ${hot(highlight, "curve")}`}
        fontSize="16"
        fontWeight="800"
      >
        rises, then dies
      </text>
    </Frame>
  );
}

function DampedView({ highlight }) {
  const points = samplePath((t) => ({
    x: 40 + t * 480,
    y: 140 + 92 * Math.exp(-2.1 * t) * Math.sin(t * Math.PI * 6),
  }));
  return (
    <Frame label="Complex poles make a damped sinusoid">
      <polyline
        className={hot(highlight, "curve")}
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <MathLabel x={80} y={8} w={400} h={40} tex="$-\\alpha\\pm j\\beta$" cls={hot(highlight, "pole")} />
    </Frame>
  );
}

function SplitView({ highlight }) {
  return (
    <Frame label="Partial fractions split F(s) into table terms">
      <Box x={24} y={90} w={140} h={90} cls={hot(highlight, "f")} title="$F(s)$" />
      <Arrow x1={174} y={135} x2={218} cls={hot(highlight, "split")} />
      <Box x={228} y={24} w={308} h={68} cls={hot(highlight, "a")} title="$k_1/(s+p_1)$" titleSize={18} />
      <Box x={228} y={104} w={308} h={68} cls={hot(highlight, "b")} title="$k_2/(s+p_2)$" titleSize={18} />
      <Box x={228} y={184} w={308} h={68} cls={hot(highlight, "c")} title="table terms" titleSize={18} />
    </Frame>
  );
}

function TrigTableView({ highlight }) {
  const rows = [
    { id: "sin", left: "$\\sin\\omega t\\,u(t)$", right: "$\\dfrac{\\omega}{s^2+\\omega^2}$" },
    { id: "cos", left: "$\\cos\\omega t\\,u(t)$", right: "$\\dfrac{s}{s^2+\\omega^2}$" },
    { id: "damp", left: "$e^{-at}\\sin\\omega t$", right: "$\\dfrac{\\omega}{(s+a)^2+\\omega^2}$" },
  ];
  return (
    <Frame label="Sine, cosine, and damped sine pairs">
      {rows.map((row, i) => (
        <g key={row.id} className={hot(highlight, row.id)}>
          <rect
            x="20"
            y={36 + i * 84}
            width="520"
            height="74"
            rx="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className={hot(highlight, row.id)}
          />
          <MathLabel x={28} y={40 + i * 84} w={210} h={66} tex={row.left} cls={hot(highlight, row.id)} />
          <MathLabel x={238} y={40 + i * 84} w={60} h={66} tex="$\\leftrightarrow$" cls={hot(highlight, row.id)} />
          <MathLabel x={298} y={40 + i * 84} w={230} h={66} tex={row.right} cls={hot(highlight, row.id)} />
        </g>
      ))}
    </Frame>
  );
}

const VIEWS = {
  map: MapView,
  guide: GuideView,
  deriv: DerivView,
  integ: IntegView,
  delay: DelayView,
  scale: ScaleView,
  freqdiff: FreqDiffView,
  initfinal: InitFinalView,
  elements: ElementsView,
  linear: LinearView,
  shift: ShiftView,
  ic: IcView,
  table: TableView,
  trigtable: TrigTableView,
  plane: PlaneView,
  decay: DecayView,
  bump: BumpView,
  damped: DampedView,
  split: SplitView,
};

export default function LaplaceSchematic({ view = "map", highlight = "all" }) {
  const View = VIEWS[view] || MapView;
  return <View highlight={highlight} />;
}
