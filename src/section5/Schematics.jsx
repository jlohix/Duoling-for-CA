function hot(highlight, id) {
  if (highlight === "all") return "hot";
  return highlight === id ? "hot" : "";
}

function Frame({ label, children }) {
  return (
    <svg
      className="circuit-svg lab-teach"
      viewBox="0 0 560 300"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

function wrapLabel(text, width, size) {
  const maxChars = Math.max(8, Math.floor(width / (size * 0.62)));
  if (!text || text.length <= maxChars) return [text];
  const gap = text.lastIndexOf(" ", maxChars);
  const cut = gap >= 4 ? gap : maxChars;
  const first = text.slice(0, cut).trim();
  const rest = text.slice(cut).trim();
  if (!rest) return [first];
  return [first, rest];
}

function Box({ x, y, w, h, cls, title, sub, titleSize = 20, subSize = 12 }) {
  const titles = wrapLabel(title, w - 16, titleSize);
  const subs = sub ? wrapLabel(sub, w - 16, subSize) : [];
  const block = titles.length * (titleSize + 2) + (subs.length ? 8 + subs.length * (subSize + 2) : 0);
  let cursor = y + Math.max(28, (h - block) / 2 + titleSize);
  return (
    <g className={cls}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      {titles.map((line) => {
        const node = (
          <text
            key={`t-${line}`}
            x={x + w / 2}
            y={cursor}
            textAnchor="middle"
            className={`circuit-label ${cls}`}
            fontSize={titleSize}
            fontWeight="800"
          >
            {line}
          </text>
        );
        cursor += titleSize + 2;
        return node;
      })}
      {subs.map((line) => {
        cursor += 4;
        const node = (
          <text
            key={`s-${line}`}
            x={x + w / 2}
            y={cursor}
            textAnchor="middle"
            className={`circuit-label ${cls}`}
            fontSize={subSize}
            fontWeight="700"
          >
            {line}
          </text>
        );
        cursor += subSize + 2;
        return node;
      })}
    </g>
  );
}

function Arrow({ x1, y, x2, cls }) {
  return (
    <g className={cls} fill="none" stroke="currentColor" strokeWidth="3">
      <path d={`M${x1} ${y} H${x2}`} />
      <path d={`M${x2 - 12} ${y - 8} L${x2} ${y} L${x2 - 12} ${y + 8}`} />
    </g>
  );
}

function Resistor({ x, y, cls }) {
  return (
    <g
      className={cls}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path
        d={`M${x} ${y} H${x + 12} l7 -14 l14 28 l14 -28 l14 28 l14 -28 l7 14 H${x + 112}`}
      />
    </g>
  );
}

function Inductor({ x, y, cls }) {
  const start = x + 16;
  const bumps = [0, 1, 2, 3]
    .map((i) => {
      const x0 = start + i * 22;
      return `A11 11 0 0 0 ${x0 + 22} ${y}`;
    })
    .join(" ");
  const d = `M${x} ${y} H${start} ${bumps} H${start + 88 + 16}`;
  return (
    <path
      className={cls}
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Capacitor({ x, y, cls }) {
  return (
    <g className={cls} fill="none" stroke="currentColor" strokeWidth="3">
      <path d={`M${x} ${y} H${x + 28}`} />
      <path d={`M${x + 30} ${y - 22} V${y + 22}`} />
      <path d={`M${x + 44} ${y - 22} V${y + 22}`} />
      <path d={`M${x + 46} ${y} H${x + 74}`} />
    </g>
  );
}

function Battery({ x, y, cls }) {
  return (
    <g className={cls} fill="none" stroke="currentColor" strokeWidth="3">
      <path d={`M${x} ${y} H${x + 28}`} />
      <path d={`M${x + 30} ${y - 22} V${y + 22}`} />
      <path d={`M${x + 42} ${y - 12} V${y + 12}`} />
      <path d={`M${x + 44} ${y} H${x + 72}`} />
    </g>
  );
}

function samplePath(pointAt, n = 56) {
  const pts = [];
  for (let i = 0; i <= n; i += 1) {
    const { x, y } = pointAt(i / n);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

function MapView({ highlight }) {
  return (
    <Frame label="Time domain maps to frequency domain">
      <Box
        x={24}
        y={78}
        w={200}
        h={110}
        cls={hot(highlight, "time")}
        title="f(t)"
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
        title="F(s)"
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
      <Box x={416} y={78} w={128} h={110} cls={hot(highlight, "inv")} title="f(t)" sub="inverse" titleSize={18} />
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
        title="df/dt"
        sub="Time Domain"
      />
      <Arrow x1={206} y={133} x2={256} cls={hot(highlight, "map")} />
      <Box
        x={264}
        y={78}
        w={272}
        h={110}
        cls={hot(highlight, "s")}
        title="sF − f(0⁻)"
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
        title="∫ f dτ"
        sub="0 to t"
      />
      <Arrow x1={226} y={133} x2={278} cls={hot(highlight, "map")} />
      <Box
        x={286}
        y={78}
        w={250}
        h={110}
        cls={hot(highlight, "s")}
        title="F(s)/s"
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
        title="f(t−a) u(t−a)"
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
        title="e^{−as} F(s)"
        sub="wait, then start"
        titleSize={18}
      />
    </Frame>
  );
}

function ScaleView({ highlight }) {
  return (
    <Frame label="Time scaling">
      <Box x={28} y={78} w={200} h={110} cls={hot(highlight, "time")} title="f(at)" sub="squeeze time" />
      <Arrow x1={238} y={133} x2={292} cls={hot(highlight, "map")} />
      <Box
        x={300}
        y={78}
        w={236}
        h={110}
        cls={hot(highlight, "s")}
        title="(1/a) F(s/a)"
        sub="a > 0"
        titleSize={18}
      />
    </Frame>
  );
}

function FreqDiffView({ highlight }) {
  return (
    <Frame label="Multiply by t is minus dF/ds">
      <Box x={28} y={78} w={196} h={110} cls={hot(highlight, "time")} title="t f(t)" sub="Time Domain" />
      <Arrow x1={234} y={133} x2={286} cls={hot(highlight, "map")} />
      <Box x={294} y={78} w={236} h={110} cls={hot(highlight, "s")} title="−dF/ds" sub="Frequency Domain" titleSize={22} />
    </Frame>
  );
}

function InitFinalView({ highlight }) {
  return (
    <Frame label="Initial and final value theorems">
      <Box x={24} y={78} w={246} h={110} cls={hot(highlight, "init")} title="f(0)" sub="lim s→∞  sF(s)" titleSize={22} />
      <Box x={290} y={78} w={246} h={110} cls={hot(highlight, "fin")} title="f(∞)" sub="lim s→0  sF(s)" titleSize={22} />
    </Frame>
  );
}

function ElementsView({ highlight }) {
  return (
    <Frame label="R, L, and C impedances in the s-domain">
      <Resistor x={28} y={118} cls={hot(highlight, "r")} />
      <Inductor x={198} y={118} cls={hot(highlight, "l")} />
      <Capacitor x={390} y={118} cls={hot(highlight, "c")} />
      <text x="84" y="178" textAnchor="middle" className={`circuit-label ${hot(highlight, "r")}`} fontSize="16" fontWeight="800">
        V = R I
      </text>
      <text x="254" y="178" textAnchor="middle" className={`circuit-label ${hot(highlight, "l")}`} fontSize="16" fontWeight="800">
        V = sL I
      </text>
      <text x="428" y="178" textAnchor="middle" className={`circuit-label ${hot(highlight, "c")}`} fontSize="16" fontWeight="800">
        V = I / sC
      </text>
      <text x="280" y="248" textAnchor="middle" className="circuit-label" fontSize="14" fontWeight="700">
        Zero initial conditions
      </text>
    </Frame>
  );
}

function LinearView({ highlight }) {
  return (
    <Frame label="Linearity: scale and add">
      <Box x={16} y={86} w={150} h={96} cls={hot(highlight, "f")} title="a1 F1" titleSize={18} />
      <text
        x={178}
        y={144}
        className={`circuit-label ${hot(highlight, "sum")}`}
        fontSize="26"
        fontWeight="800"
      >
        +
      </text>
      <Box x={204} y={86} w={150} h={96} cls={hot(highlight, "g")} title="a2 F2" titleSize={18} />
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
        title="e^{−at} f(t)"
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
        title="F(s+a)"
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
      <text x="150" y="108" textAnchor="middle" className={`circuit-label ${hot(highlight, "l")}`} fontSize="14" fontWeight="800">
        sL
      </text>
      <Battery x={80} y={148} cls={hot(highlight, "src")} />
      <text x="150" y="198" textAnchor="middle" className={`circuit-label ${hot(highlight, "src")}`} fontSize="13" fontWeight="800">
        series L i(0⁻)
      </text>
      <text x="410" y="32" textAnchor="middle" className={`circuit-label ${hot(highlight, "c")}`} fontSize="15" fontWeight="800">
        Capacitor
      </text>
      <Capacitor x={360} y={70} cls={hot(highlight, "c")} />
      <text x="410" y="108" textAnchor="middle" className={`circuit-label ${hot(highlight, "c")}`} fontSize="14" fontWeight="800">
        1/sC
      </text>
      <Battery x={360} y={148} cls={hot(highlight, "src")} />
      <text x="410" y="198" textAnchor="middle" className={`circuit-label ${hot(highlight, "src")}`} fontSize="13" fontWeight="800">
        series v(0⁻)/s
      </text>
      <text x="280" y="248" textAnchor="middle" className="circuit-label" fontSize="13" fontWeight="700">
        Parallel forms
      </text>
      <text x="280" y="272" textAnchor="middle" className="circuit-label" fontSize="12" fontWeight="700">
        i(0⁻)/s with L · C v(0⁻) with C
      </text>
    </Frame>
  );
}

function TableView({ highlight }) {
  const rows = [
    { id: "imp", left: "δ(t)", right: "1" },
    { id: "step", left: "u(t)", right: "1/s" },
    { id: "exp", left: "e^{-at} u(t)", right: "1/(s+a)" },
  ];
  return (
    <Frame label="Common Laplace pairs">
      {rows.map((row, i) => (
        <g key={row.id}>
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
          <text
            x="160"
            y={86 + i * 70}
            textAnchor="middle"
            className={`circuit-label ${hot(highlight, row.id)}`}
            fontSize="20"
            fontWeight="800"
          >
            {row.left}
          </text>
          <text
            x="280"
            y={86 + i * 70}
            textAnchor="middle"
            className={`circuit-label ${hot(highlight, row.id)}`}
            fontSize="20"
            fontWeight="800"
          >
            ↔
          </text>
          <text
            x="400"
            y={86 + i * 70}
            textAnchor="middle"
            className={`circuit-label ${hot(highlight, row.id)}`}
            fontSize="20"
            fontWeight="800"
          >
            {row.right}
          </text>
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
      <text x="512" y="148" className="circuit-label" fontSize="14" fontWeight="800">
        σ
      </text>
      <text x="292" y="28" className="circuit-label" fontSize="14" fontWeight="800">
        jω
      </text>
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
      <text
        x="430"
        y="56"
        textAnchor="middle"
        className={`circuit-label ${hot(highlight, "pole")}`}
        fontSize="16"
        fontWeight="800"
      >
        pole at −p
      </text>
      <text
        x="140"
        y="262"
        className={`circuit-label ${hot(highlight, "curve")}`}
        fontSize="16"
        fontWeight="800"
      >
        {"k e^{-pt}"}
      </text>
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
      <text
        x="280"
        y="36"
        textAnchor="middle"
        className={`circuit-label ${hot(highlight, "pole")}`}
        fontSize="16"
        fontWeight="800"
      >
        ×* at −α ± jβ
      </text>
    </Frame>
  );
}

function SplitView({ highlight }) {
  return (
    <Frame label="Partial fractions split F(s) into table terms">
      <Box x={24} y={90} w={140} h={90} cls={hot(highlight, "f")} title="F(s)" />
      <Arrow x1={174} y={135} x2={218} cls={hot(highlight, "split")} />
      <Box x={228} y={24} w={308} h={68} cls={hot(highlight, "a")} title="k1 / (s+p1)" titleSize={18} />
      <Box x={228} y={104} w={308} h={68} cls={hot(highlight, "b")} title="k2 / (s+p2)" titleSize={18} />
      <Box x={228} y={184} w={308} h={68} cls={hot(highlight, "c")} title="table terms" titleSize={18} />
    </Frame>
  );
}

function TrigTableView({ highlight }) {
  const rows = [
    { id: "sin", left: "sin ωt u(t)", right: ["ω / (s² + ω²)"] },
    { id: "cos", left: "cos ωt u(t)", right: ["s / (s² + ω²)"] },
    { id: "damp", left: "e^{-at} sin ωt", right: ["ω", "((s+a)² + ω²)"] },
  ];
  return (
    <Frame label="Sine, cosine, and damped sine pairs">
      {rows.map((row, i) => (
        <g key={row.id}>
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
          <text
            x="148"
            y={78 + i * 84}
            textAnchor="middle"
            className={`circuit-label ${hot(highlight, row.id)}`}
            fontSize="16"
            fontWeight="800"
          >
            {row.left}
          </text>
          <text
            x="268"
            y={78 + i * 84}
            textAnchor="middle"
            className={`circuit-label ${hot(highlight, row.id)}`}
            fontSize="18"
            fontWeight="800"
          >
            ↔
          </text>
          {row.right.map((line, lineIndex) => (
            <text
              key={line}
              x="400"
              y={64 + i * 84 + lineIndex * 22 + (row.right.length === 1 ? 14 : 0)}
              textAnchor="middle"
              className={`circuit-label ${hot(highlight, row.id)}`}
              fontSize="15"
              fontWeight="800"
            >
              {line}
            </text>
          ))}
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
