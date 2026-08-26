import katex from "katex";

function mathRegex() {
  return /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;
}

function renderChunk(tex, display) {
  try {
    return katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      strict: "ignore",
    });
  } catch {
    return tex;
  }
}

export default function MathText({ text, className = "" }) {
  if (!text) return null;
  const html = [];
  let last = 0;
  const source = String(text);
  source.replace(mathRegex(), (match, dd, inline, paren, bracket, offset) => {
    html.push(escapeHtml(source.slice(last, offset)));
    const tex = dd || inline || paren || bracket;
    html.push(renderChunk(tex, Boolean(dd || bracket)));
    last = offset + match.length;
    return match;
  });
  html.push(escapeHtml(source.slice(last)));
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html.join("") }}
    />
  );
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
