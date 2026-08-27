export default function TopicInsight({ insight, compact = false }) {
  return (
    <p className={`insight ${insight.kind} ${compact ? "compact" : ""}`}>
      <span className="insight-label">{insight.label}</span>
      {compact ? null : <span className="insight-detail">{insight.detail}</span>}
      {compact && insight.pct != null ? (
        <span className="insight-detail">{insight.pct}%</span>
      ) : null}
    </p>
  );
}
