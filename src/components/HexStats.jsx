import { topicInsight } from "../state/progress";

function shortName(topic) {
  return topic.short || String(topic.name).replace(/^Section\s+/i, "S");
}

function point(cx, cy, radius, index, count, angle0 = -Math.PI / 2) {
  const angle = angle0 + (index * 2 * Math.PI) / count;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

function ringPath(cx, cy, radius, count) {
  return Array.from({ length: count }, (_, i) => {
    const [x, y] = point(cx, cy, radius, i, count);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z";
}

export default function HexStats({ topics, progress }) {
  const axes = topics.map((topic) => {
    const insight = topicInsight(progress, topic.id);
    return {
      id: topic.id,
      name: topic.name,
      short: shortName(topic),
      kind: insight.kind,
      pct: insight.pct,
      value: insight.pct == null ? 0 : insight.pct,
    };
  });
  const n = axes.length || 1;
  const size = 360;
  const cx = size / 2;
  const cy = size / 2 + 6;
  const maxR = 112;
  const dataPts = axes.map((axis, i) =>
    point(cx, cy, (maxR * axis.value) / 100, i, n)
  );
  const dataPath =
    dataPts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ") +
    " Z";
  const label = axes
    .map((axis) =>
      axis.pct == null ? `${axis.name}: not measured` : `${axis.name}: ${axis.pct}%`
    )
    .join(". ");

  return (
    <figure className="hex-stats">
      <svg
        className="hex-stats-svg"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`First-try accuracy by topic. ${label}`}
      >
        {[20, 40, 60, 80, 100].map((pct) => (
          <path
            key={pct}
            className={`hex-ring${pct === 80 ? " strength-ring" : ""}${pct === 60 ? " solid-ring" : ""}`}
            d={ringPath(cx, cy, (maxR * pct) / 100, n)}
          />
        ))}
        {axes.map((axis, i) => {
          const [x, y] = point(cx, cy, maxR, i, n);
          return (
            <line
              key={`a${axis.id}`}
              className="hex-spoke"
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
            />
          );
        })}
        <path className="hex-fill" d={dataPath} />
        {dataPts.map(([x, y], i) => (
          <circle
            key={`d${axes[i].id}`}
            className={`hex-dot ${axes[i].kind}`}
            cx={x}
            cy={y}
            r="5"
          />
        ))}
        {axes.map((axis, i) => {
          const [x, y] = point(cx, cy, maxR + 28, i, n);
          const anchor =
            Math.abs(x - cx) < 12 ? "middle" : x > cx ? "start" : "end";
          return (
            <text
              key={`l${axis.id}`}
              className="hex-label"
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
            >
              {axis.short}
            </text>
          );
        })}
      </svg>
      <figcaption className="hex-stats-key">
        Outer ring is 100% first try on lessons and walkthroughs. Green dots
        are strengths (80%+). Red dots are weaknesses (under 60%). Empty
        topics sit at the centre.
      </figcaption>
    </figure>
  );
}
