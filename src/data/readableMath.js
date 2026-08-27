import katex from "katex";

const MATH_RE =
  /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;

const ATOM =
  String.raw`(?:\\frac\{[^{}]+\}\{[^{}]+\}|\\[A-Za-z]+(?:\{[^{}]*\})?|[A-Za-z]+(?:_\{[^}]+\})?|[A-Za-z]+_[A-Za-z0-9]+|\d+(?:\.\d+)?|\([^()]*\))`;

const SLASH_FRAC = new RegExp(`(${ATOM})\\s*/\\s*(${ATOM})`);

export function stackSlashes(tex) {
  let s = String(tex ?? "");
  for (let i = 0; i < 6; i += 1) {
    const next = s.replace(SLASH_FRAC, "\\frac{$1}{$2}");
    if (next === s) break;
    s = next;
  }
  return s;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderMath(tex, display) {
  try {
    return katex.renderToString(stackSlashes(tex), {
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
    html.push(escapeHtml(raw.slice(last, offset)));
    html.push(renderMath(dd || inline || paren || bracket, Boolean(dd || bracket)));
    last = offset + match.length;
    return match;
  });
  html.push(escapeHtml(raw.slice(last)));
  return html.join("");
}
