import { textToReadableHtml } from "../data/readableMath";

export default function MathText({ text, className = "" }) {
  if (!text) return null;
  return (
    <span
      className={`math-text ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: textToReadableHtml(text) }}
    />
  );
}
