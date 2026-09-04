import MathText from "./MathText";

export function hot(highlight, id) {
  if (highlight === "all") return "hot";
  return highlight === id ? "hot" : "";
}

function looksMath(value) {
  return /\$|\\[a-zA-Z]/.test(String(value ?? ""));
}

function asDisplayMath(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return raw;
  if (raw.startsWith("$$") || raw.startsWith("\\[")) return raw;
  const inner = raw.startsWith("$") && raw.endsWith("$") ? raw.slice(1, -1) : null;
  if (inner != null && !inner.includes("$")) {
    return `$$${inner}$$`;
  }
  if ((raw.match(/\$/g) || []).length >= 2) {
    return raw.replace(/\$([^$]+)\$/g, (_, tex) => `$$${tex}$$`);
  }
  return `$$${raw}$$`;
}

export function MathLabel({ x, y, w, h, tex, cls = "", inline = false }) {
  if (!tex) return null;
  return (
    <foreignObject x={x} y={y} width={w} height={h} overflow="visible">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        className={`slide-math ${cls}`.trim()}
      >
        <MathText text={inline ? tex : asDisplayMath(tex)} />
      </div>
    </foreignObject>
  );
}

export function Frame({ label, children, height = 300 }) {
  return (
    <svg
      className="circuit-svg lab-teach"
      viewBox={`0 0 560 ${height}`}
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

export function PlotAxes({
  x0 = 48,
  y0 = 228,
  x1 = 530,
  y1 = 48,
  xLabel = "t",
  yLabel = "v(t)",
}) {
  return (
    <g>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={`M${x0} ${y1} V${y0} H${x1}`} />
        <path d={`M${x1 - 10} ${y0 - 7} L${x1} ${y0} L${x1 - 10} ${y0 + 7}`} />
        <path d={`M${x0 - 7} ${y1 + 10} L${x0} ${y1} L${x0 + 7} ${y1 + 10}`} />
      </g>
      <text
        x={x1}
        y={y0 + 22}
        textAnchor="middle"
        className="circuit-part"
      >
        {xLabel}
      </text>
      <text
        x={x0 - 12}
        y={(y0 + y1) / 2}
        textAnchor="end"
        className="circuit-part"
      >
        {yLabel}
      </text>
      <text x={x0 - 8} y={y0 + 18} textAnchor="end" className="circuit-label">
        0
      </text>
    </g>
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

export function Box({ x, y, w, h, cls, title, sub, titleSize = 20, subSize = 12, titleCls = "" }) {
  const mathTitle = looksMath(title);
  const mathSub = looksMath(sub);
  if (mathTitle || mathSub) {
    const pad = 8;
    const subBand = sub ? (mathSub ? 40 : 22) : 0;
    const mathCls = `${cls} ${titleCls}`.trim();
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
        {mathTitle ? (
          <MathLabel
            x={x + pad}
            y={y + pad}
            w={w - pad * 2}
            h={Math.max(28, h - subBand - pad * 2)}
            tex={title}
            cls={mathCls}
            inline
          />
        ) : (
          wrapLabel(title, w - 16, titleSize).map((line, i) => (
            <text
              key={`t-${line}`}
              x={x + w / 2}
              y={y + 28 + i * (titleSize + 2)}
              textAnchor="middle"
              className={`circuit-label ${cls}`}
              fontSize={titleSize}
              fontWeight="400"
            >
              {line}
            </text>
          ))
        )}
        {sub && mathSub ? (
          <MathLabel
            x={x + pad}
            y={y + h - subBand}
            w={w - pad * 2}
            h={subBand - 4}
            tex={sub}
            cls={cls}
          />
        ) : sub ? (
          <text
            x={x + w / 2}
            y={y + h - 14}
            textAnchor="middle"
            className={`circuit-label ${cls}`}
            fontSize={subSize}
            fontWeight="400"
          >
            {sub}
          </text>
        ) : null}
      </g>
    );
  }

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
            fontWeight="400"
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
            fontWeight="400"
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

export function Arrow({ x1, y, x2, cls }) {
  return (
    <g className={cls} fill="none" stroke="currentColor" strokeWidth="3">
      <path d={`M${x1} ${y} H${x2}`} />
      <path d={`M${x2 - 12} ${y - 8} L${x2} ${y} L${x2 - 12} ${y + 8}`} />
    </g>
  );
}

export function Resistor({ x, y, cls }) {
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

export function Inductor({ x, y, cls }) {
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

export function Capacitor({ x, y, cls }) {
  return (
    <g className={cls} fill="none" stroke="currentColor" strokeWidth="3">
      <path d={`M${x} ${y} H${x + 28}`} />
      <path d={`M${x + 30} ${y - 22} V${y + 22}`} />
      <path d={`M${x + 44} ${y - 22} V${y + 22}`} />
      <path d={`M${x + 46} ${y} H${x + 74}`} />
    </g>
  );
}

export function OpenGap({ x, y, cls }) {
  return (
    <g className={cls} stroke="currentColor" strokeWidth="3" fill="currentColor">
      <path d={`M${x} ${y} H${x + 20}`} fill="none" />
      <circle cx={x + 22} cy={y} r="5" />
      <circle cx={x + 52} cy={y} r="5" />
      <path d={`M${x + 54} ${y} H${x + 74}`} fill="none" />
    </g>
  );
}

export function Battery({ x, y, cls }) {
  return (
    <g className={cls} fill="none" stroke="currentColor" strokeWidth="3">
      <path d={`M${x} ${y} H${x + 28}`} />
      <path d={`M${x + 30} ${y - 22} V${y + 22}`} />
      <path d={`M${x + 42} ${y - 12} V${y + 12}`} />
      <path d={`M${x + 44} ${y} H${x + 72}`} />
    </g>
  );
}

export function CurrentSrc({ x, y, cls }) {
  return (
    <g className={cls} fill="none" stroke="currentColor" strokeWidth="3">
      <circle cx={x + 28} cy={y} r="22" />
      <path d={`M${x + 28} ${y + 12} V${y - 12}`} />
      <path d={`M${x + 20} ${y - 4} L${x + 28} ${y - 12} L${x + 36} ${y - 4}`} />
    </g>
  );
}

export function OpAmp({ x, y, cls }) {
  return (
    <g className={cls} fill="none" stroke="currentColor" strokeWidth="3">
      <path d={`M${x} ${y - 48} L${x + 96} ${y} L${x} ${y + 48} Z`} />
      <text x={x + 14} y={y - 14} className={`circuit-label ${cls}`} fontSize="12" fontWeight="400">
        +
      </text>
      <text x={x + 16} y={y + 28} className={`circuit-label ${cls}`} fontSize="16" fontWeight="400">
        −
      </text>
    </g>
  );
}

export function samplePath(pointAt, n = 56) {
  const pts = [];
  for (let i = 0; i <= n; i += 1) {
    const { x, y } = pointAt(i / n);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}
