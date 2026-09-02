export default function PartSymbol({ id, className = "part-svg" }) {
  if (id === "open") {
    return (
      <svg className={className} viewBox="0 0 72 28" aria-hidden="true">
        <path
          d="M4 14 H26 M46 14 H68"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx="26" cy="14" r="3" fill="currentColor" />
        <circle cx="46" cy="14" r="3" fill="currentColor" />
      </svg>
    );
  }
  if (id === "short") {
    return (
      <svg className={className} viewBox="0 0 72 28" aria-hidden="true">
        <path
          d="M4 14 H68"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>
    );
  }
  if (id === "cap") {
    return (
      <svg className={className} viewBox="0 0 72 28" aria-hidden="true">
        <path
          d="M4 14 H28 M44 14 H68"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path d="M30 4 V24 M42 4 V24" stroke="currentColor" strokeWidth="3" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 72 28" aria-hidden="true">
      <path
        d="M4 14 H16 C20 14 20 6 24 6 C28 6 28 22 32 22 C36 22 36 6 40 6 C44 6 44 22 48 22 C52 22 52 14 56 14 H68"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}
