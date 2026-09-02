export default function MeshLoop({
  x1,
  y1,
  x2,
  y2,
  label,
  caption,
  cls = "",
  labelOffsetY = 0,
}) {
  const pad = 28;
  const left = x1 + pad;
  const top = y1 + pad;
  const right = x2 - pad;
  const bot = y2 - pad;
  const r = 10;
  const gap = 16;
  const midTop = (left + right) / 2;
  const cx = (left + right) / 2;
  const cy = (top + bot) / 2 + labelOffsetY;
  const ax = midTop - gap;
  const ay = top;
  const bx = midTop;
  const by = bot;
  const head = 14;
  const half = 6;
  const d = [
    `M${midTop + gap} ${top}`,
    `H${right - r}`,
    `A${r} ${r} 0 0 1 ${right} ${top + r}`,
    `V${bot - r}`,
    `A${r} ${r} 0 0 1 ${right - r} ${bot}`,
    `H${left + r}`,
    `A${r} ${r} 0 0 1 ${left} ${bot - r}`,
    `V${top + r}`,
    `A${r} ${r} 0 0 1 ${left + r} ${top}`,
    `H${ax}`,
  ].join(" ");

  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        className={cls}
        d={d}
        stroke="currentColor"
        strokeWidth="2"
      />
      <polygon
        className={cls}
        points={`${ax},${ay - half} ${ax + head},${ay} ${ax},${ay + half}`}
        fill="currentColor"
        stroke="none"
      />
      <polygon
        className={cls}
        points={`${bx},${by - half} ${bx - head},${by} ${bx},${by + half}`}
        fill="currentColor"
        stroke="none"
      />
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        className={`circuit-label thev-tag ${cls}`}
        fill="currentColor"
        stroke="none"
        fontWeight="800"
      >
        {label}
      </text>
      {caption ? (
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          className={`circuit-label thev-tag ${cls}`}
          fill="currentColor"
          stroke="none"
        >
          {caption}
        </text>
      ) : null}
    </g>
  );
}
