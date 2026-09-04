export const STEPS = [
  {
    id: "meet",
    view: "bump",
    highlight: "pole",
    title: "Repeated real poles",
    body: "$n$ poles stacked at $s=-p$. Partial fractions need $n$ terms. For a double pole ($n=2$) you get the critically damped shape.",
    eq: [
      "$$\\dfrac{1}{(s+p)^2}\\;\\leftrightarrow\\; t e^{-pt}u(t)$$",
      "$$(k_2 t + k_1)e^{-pt}u(t)$$",
    ],
  },
  {
    id: "form",
    view: "split",
    highlight: "split",
    title: "The $n=2$ template",
    body: "Forgetting $k_1$ is the usual miss. $k_2$ goes with $t e^{-pt}$; $k_1$ goes with $e^{-pt}$.",
    eq: "$$F(s)=\\cdots+\\dfrac{k_2}{(s+p)^2}+\\dfrac{k_1}{s+p}+\\cdots$$",
    check: {
      prompt: "A double pole at $-2$ needs which time terms?",
      options: {
        a: "Only $e^{-2t}u(t)$.",
        b: "$(k_2 t + k_1)e^{-2t}u(t)$.",
        c: "A sine and a cosine.",
      },
      answer: "b",
      why: "Extra $t$ gives two unique constants — same idea as critical damping.",
    },
  },
  {
    id: "k2",
    view: "split",
    highlight: "a",
    title: "Find $k_2$ first",
    body: "Cover the whole $(s+p)^2$. Same cover-up as a simple pole, but you cover the square.",
    eq: "$$k_2=(s+p)^2 F(s)\\big|_{s=-p}$$",
  },
  {
    id: "k1",
    view: "split",
    highlight: "b",
    title: "Then $k_1$ (one derivative)",
    body: "For $n=2$, $i=1$ the general rule collapses to one derivative. Or pick a friendly $s\\ne -p$ and solve for $k_1$.",
    eq: [
      "$$k_i=\\dfrac{1}{(n-i)!}\\dfrac{d^{n-i}}{ds^{n-i}}\\big[(s+p)^n F(s)\\big]_{s=-p}$$",
      "$$k_1=\\dfrac{d}{ds}\\big[(s+p)^2 F(s)\\big]_{s=-p}$$",
    ],
  },
  {
    id: "ex",
    view: "bump",
    highlight: "curve",
    title: "Tiny example",
    points: [
      "$F(s)=1/(s+1)^2$ is $k_2=1$, $k_1=0$, so $t e^{-t}u(t)$.",
      "If $F(s)=(s+3)/(s+1)^2$, then $k_2=2$ and $k_1=1$.",
    ],
    eq: "$$f(t)=(2t+1)e^{-t}u(t)$$",
  },
  {
    id: "ckt",
    view: "elements",
    highlight: "all",
    title: "Critically damped RLC",
    body: "Equal characteristic roots $s_{1,2}=-\\alpha$ when $\\alpha=\\omega_0$. Expect the extra $t$, not a sinusoid.",
    eq: "$$x(t)=(D_1+D_2 t)e^{-\\alpha t}$$",
  },
];

export const PRACTICE = [
  {
    id: "p1",
    view: "bump",
    prompt: "The inverse of $1/(s+5)^2$ is",
    options: {
      a: "$e^{-5t}u(t)$.",
      b: "$t e^{-5t}u(t)$.",
      c: "$5t$.",
    },
    answer: "b",
    why: "Table row $t e^{-pt}\\leftrightarrow 1/(s+p)^2$. Here $k_1=0$.",
  },
  {
    id: "p2",
    view: "split",
    prompt: "For a double pole the expansion must include",
    options: {
      a: "Only $k_2/(s+p)^2$.",
      b: "Both $k_2/(s+p)^2$ and $k_1/(s+p)$.",
      c: "A conjugate pair.",
    },
    answer: "b",
    why: "$n$ repeated poles $\\rightarrow$ $n$ terms.",
  },
  {
    id: "p3",
    view: "bump",
    prompt: "Critically damped natural response looks like",
    options: {
      a: "$(D_1+D_2 t)e^{-\\alpha t}u(t)$.",
      b: "A forever sinusoid.",
      c: "Two different real exponentials.",
    },
    answer: "a",
    why: "Equal roots. Overdamped is two $p$'s. Underdamped is $\\alpha\\pm j\\beta$.",
  },
  {
    id: "p4",
    view: "split",
    prompt: "For $1/(s+p)^2$ the cover-up order is",
    options: {
      a: "Find $k_2$ first, then $k_1$.",
      b: "Skip $k_1$; only $k_2$ exists.",
      c: "Use a conjugate pair.",
    },
    answer: "a",
    why: "$k_2$ is cover-up on the square. $k_1$ needs a derivative (or equate coeffs).",
  },
  {
    id: "p5",
    view: "elements",
    prompt: "Repeated real LHP poles are the",
    options: {
      a: "Overdamped case.",
      b: "Underdamped case.",
      c: "Critically damped case.",
    },
    answer: "c",
    why: "$\\alpha=\\omega_0$ repeats the root. Overdamped is two different $p$'s.",
  },
];
