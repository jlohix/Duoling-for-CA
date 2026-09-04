export const STEPS = [
  {
    id: "why",
    view: "split",
    highlight: "split",
    title: "Why expand at all",
    body: "The table lists $k/(s+p)$, $k/(s+p)^2$, and the quadratic $\\alpha,\\beta$ pieces — not a raw product of poles.",
    points: [
      "Decompose $F(s)$ into simple terms by partial fraction expansion.",
      "Invert each term by matching the table.",
    ],
  },
  {
    id: "factor",
    view: "split",
    highlight: "f",
    title: "Factor $D(s)$ and check proper",
    body: "If $\\deg N\\ge \\deg D$, long-divide first and expand only $R(s)/D(s)$.",
    points: [
      "$(s+p)$ — simple real",
      "$(s+p)^n$ — repeated",
      "$(s+\\alpha)^2+\\beta^2$ — distinct complex",
    ],
    check: {
      prompt: "Before expanding $s/((s+1)(s+2))$ you",
      options: {
        a: "Need long division (improper).",
        b: "Can expand as-is (proper).",
        c: "Must evaluate the Laplace integral.",
      },
      answer: "b",
      why: "Numerator degree 1, denominator degree 2.",
    },
  },
  {
    id: "template",
    view: "split",
    highlight: "all",
    title: "Write the template",
    body: "One template per factor. Do not invent extra poles.",
    eq: [
      "$$\\dfrac{k_i}{s+p_i}$$",
      "$$\\dfrac{k_n}{(s+p)^n}+\\cdots+\\dfrac{k_1}{s+p}$$",
      "$$\\dfrac{A_1 s+A_2}{(s+\\alpha)^2+\\beta^2}$$",
    ],
  },
  {
    id: "cover",
    view: "split",
    highlight: "a",
    title: "Find the numbers",
    points: [
      "Simple: cover-up $k_i=(s+p_i)F(s)|_{s=-p_i}$.",
      "Repeated: cover the highest power, then the derivative formula.",
      "Complex: split $A_1 s+A_2$, with $B_1=(A_2-A_1\\alpha)/\\beta$.",
    ],
  },
  {
    id: "inv",
    view: "table",
    highlight: "all",
    title: "Inverse each term",
    body: "Look up each piece, add, then multiply the sum by $u(t)$. That is $f(t)$ for $t\\ge 0$.",
    eq: [
      "$$\\dfrac{k}{s+p}\\;\\rightarrow\\; k e^{-pt}$$",
      "$$\\dfrac{k}{(s+p)^2}\\;\\rightarrow\\; k t e^{-pt}$$",
    ],
  },
  {
    id: "ckt",
    view: "guide",
    highlight: "all",
    title: "Back to the circuit method",
    points: [
      "Draw the $s$-domain circuit ($R$, $sL$, $1/sC$, I.C. sources).",
      "Nodal / mesh / theorems → $V(s)$ or $I(s)$.",
      "This expansion, then inverse LT.",
    ],
  },
];

export const PRACTICE = [
  {
    id: "p1",
    view: "split",
    prompt: "Partial fractions exist so you can",
    options: {
      a: "Avoid the Laplace table.",
      b: "Turn $F(s)$ into a sum of table rows.",
      c: "Delete poles you do not like.",
    },
    answer: "b",
    why: "Then each row has a known inverse.",
  },
  {
    id: "p2",
    view: "split",
    prompt: "If $F(s)$ is improper you first",
    options: {
      a: "Long-divide, then expand the remainder.",
      b: "Cover-up $s=\\infty$.",
      c: "Ignore the numerator.",
    },
    answer: "a",
    why: "$Q(s)$ plus proper $R(s)/D(s)$. Only the remainder gets PFE.",
  },
  {
    id: "p3",
    view: "table",
    prompt: "After $V(s)=3/(s+2)+4/(s+5)$, $v(t)$ is",
    options: {
      a: "$(3e^{-2t}+4e^{-5t})u(t)$.",
      b: "$(3e^{+2t}+4e^{+5t})u(t)$.",
      c: "$(3+4t)e^{-2t}u(t)$.",
    },
    answer: "a",
    why: "Two simple real poles. The $t e^{-pt}$ form is repeated.",
  },
  {
    id: "p4",
    view: "guide",
    prompt: "After PFE you still multiply the time function by",
    options: {
      a: "$\\delta(t)$ only.",
      b: "$u(t)$ (causal, $t\\ge 0$).",
      c: "$e^{+st}$.",
    },
    answer: "b",
    why: "Unilateral pairs are for $t\\ge 0$. Write $u(t)$ on the inverse.",
  },
  {
    id: "p5",
    view: "split",
    prompt: "A simple real pole $k/(s+p)$ inverts to",
    options: {
      a: "$k e^{-pt}u(t)$.",
      b: "$k t e^{-pt}u(t)$.",
      c: "$k\\cos pt\\,u(t)$.",
    },
    answer: "a",
    why: "The extra $t$ is a repeated pole. Cosine needs a quadratic factor.",
  },
];
