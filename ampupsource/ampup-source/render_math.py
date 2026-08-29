import re, html, json

GREEK = {
    'Omega': 'Ω', 'omega': 'ω', 'mu': 'μ', 'tau': 'τ', 'theta': 'θ', 'phi': 'φ',
    'Delta': 'Δ', 'delta': 'δ', 'pi': 'π', 'alpha': 'α', 'beta': 'β', 'gamma': 'γ',
    'lambda': 'λ', 'sigma': 'σ', 'Sigma': 'Σ', 'infty': '∞', 'circ': '°',
    'cdot': '·', 'times': '×', 'angle': '∠', 'pm': '±', 'approx': '≈',
    'leq': '≤', 'geq': '≥', 'neq': '≠', 'rightarrow': '→', 'to': '→',
}
SPACERS = {'\\,': ' ', '\\;': ' ', '\\!': '', '\\ ': ' ', '\\quad': '  '}


def esc(s):
    return html.escape(s, quote=False)


def strip_braces(s):
    s = s.strip()
    if s.startswith('{') and s.endswith('}'):
        return s[1:-1]
    return s


def find_matching_brace(s, start):
    """s[start] == '{'; return index of matching '}'."""
    depth = 0
    for i in range(start, len(s)):
        if s[i] == '{':
            depth += 1
        elif s[i] == '}':
            depth -= 1
            if depth == 0:
                return i
    return len(s) - 1


def render_inline(s):
    """Render the inside of a math span (already stripped of $/\\( \\) delimiters)."""
    out = []
    i = 0
    n = len(s)
    while i < n:
        ch = s[i]
        # spacing commands
        matched_spacer = False
        for sp, rep in SPACERS.items():
            if s.startswith(sp, i):
                out.append(rep)
                i += len(sp)
                matched_spacer = True
                break
        if matched_spacer:
            continue

        if ch == '\\':
            m = re.match(r'\\([a-zA-Z]+)', s[i:])
            if m:
                cmd = m.group(1)
                i += len(m.group(0))
                if cmd == 'text':
                    # \text{...}
                    if i < n and s[i] == '{':
                        end = find_matching_brace(s, i)
                        inner = s[i + 1:end]
                        out.append(f'<span class="mtext">{esc(inner)}</span>')
                        i = end + 1
                    continue
                if cmd == 'frac':
                    # \frac{a}{b}
                    if i < n and s[i] == '{':
                        end1 = find_matching_brace(s, i)
                        num = s[i + 1:end1]
                        j = end1 + 1
                        if j < n and s[j] == '{':
                            end2 = find_matching_brace(s, j)
                            den = s[j + 1:end2]
                            i = end2 + 1
                        else:
                            den = ''
                        out.append(
                            f'<span class="frac"><span class="num">{render_inline(num)}</span>'
                            f'<span class="den">{render_inline(den)}</span></span>'
                        )
                    continue
                if cmd == 'sqrt':
                    if i < n and s[i] == '{':
                        end = find_matching_brace(s, i)
                        inner = s[i + 1:end]
                        out.append(f'<span class="sqrt">√<span class="sqrt-inner">{render_inline(inner)}</span></span>')
                        i = end + 1
                    continue
                if cmd in GREEK:
                    out.append(GREEK[cmd])
                    continue
                if cmd == 'left' or cmd == 'right':
                    continue
                # unknown command: drop the backslash, keep text
                out.append(esc(cmd))
                continue
        if ch in '^_':
            tag = 'sup' if ch == '^' else 'sub'
            i += 1
            if i < n and s[i] == '{':
                end = find_matching_brace(s, i)
                inner = s[i + 1:end]
                i = end + 1
            elif i < n and s[i] == '\\':
                m2 = re.match(r'\\[a-zA-Z]+', s[i:])
                if m2:
                    inner = m2.group(0)
                    i += len(m2.group(0))
                else:
                    inner = s[i]
                    i += 1
            else:
                inner = s[i] if i < n else ''
                i += 1
            out.append(f'<{tag}>{render_inline(inner)}</{tag}>')
            continue
        if ch in '{}':
            i += 1
            continue
        out.append(esc(ch))
        i += 1
    return ''.join(out)


MATH_SPAN_RE = re.compile(r'\\\((.*?)\\\)|\$\$(.*?)\$\$|\$(.*?)\$', re.DOTALL)


STRAY_SPACER_RE = re.compile(r'\\[,;!]|\\ ')


def latex_to_html(text):
    if not text:
        return ''
    # strip stray spacing commands that sometimes sit outside math delimiters
    text = STRAY_SPACER_RE.sub(' ', text)
    out = []
    last = 0
    for m in MATH_SPAN_RE.finditer(text):
        out.append(esc(text[last:m.start()]))
        inner = next(g for g in m.groups() if g is not None)
        out.append(f'<span class="math">{render_inline(inner)}</span>')
        last = m.end()
    out.append(esc(text[last:]))
    return ''.join(out).replace('\n', '<br>')


if __name__ == '__main__':
    qs = json.load(open('/tmp/duo/questions.json'))
    for q in qs:
        q['questionHtml'] = latex_to_html(q['question'])
        q['optionsHtml'] = [latex_to_html(o) for o in q['options']]
        q['explanationHtml'] = latex_to_html(q['explanation'])
    json.dump(qs, open('/tmp/duo/questions_rendered.json', 'w'), indent=1)
    # print a few samples
    samples = [q for q in qs if '\\frac' in q['question'] or '\\Omega' in q['question'] or '^' in q['question']][:6]
    for q in samples:
        print(q['id'], '|', q['questionHtml'])
    print('---options sample---')
    print(qs[1]['optionsHtml'])
