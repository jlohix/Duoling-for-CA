import katex from "katex";

const MATH_RE =
  /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderMath(tex, display) {
  try {
    return katex.renderToString(String(tex ?? ""), {
      displayMode: display,
      throwOnError: false,
      output: "html",
    });
  } catch {
    return `<span class="math-fallback">${escapeHtml(tex)}</span>`;
  }
}

export function textToReadableHtml(source) {
  const raw = String(source ?? "");
  let last = 0;
  const html = [];
  raw.replace(MATH_RE, (match, dd, inline, paren, bracket, offset) => {
    html.push(escapeHtml(raw.slice(last, offset)).replaceAll("\n", "<br>"));
    html.push(renderMath(dd || inline || paren || bracket, Boolean(dd || bracket)));
    last = offset + match.length;
    return match;
  });
  html.push(escapeHtml(raw.slice(last)).replaceAll("\n", "<br>"));
  return html.join("");
}
