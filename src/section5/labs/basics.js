export const STEPS = [
  {
    id: "meet",
    view: "map",
    highlight: "all",
    boardHint: "Time Domain on the left. Frequency Domain on the right.",
    title: "Time Domain and Frequency Domain",
    body: [
      "We usually write signals as $f(t)$. Laplace switches to the frequency domain $F(s)$, with $s=\\sigma+j\\omega$.",
      "Why bother:",
    ],
    points: [
      "Circuit DEs become algebra.",
      "Capacitor and inductor initial conditions fit in automatically.",
      "Natural + forced response come out in one calculation.",
    ],
    eq: "$$f(t)\\;\\Longleftrightarrow\\; F(s)$$",
  },
  {
    id: "def",
    view: "map",
    highlight: "map",
    boardHint: "Lower limit 0⁻ captures jumps at t=0 (initial conditions).",
    title: "Unilateral Laplace Transform",
    body: [
      "The lower limit $0^-$ is just before $t=0$, so jumps at $t=0$ are included.",
      "Because $f(t)$ is ignored for $t<0$, this is the unilateral (one-sided) transform. You match LT pairs instead of grinding the integral.",
    ],
    eq: "$$F(s)=\\int_{0^-}^{\\infty} f(t)\\,e^{-st}\\,dt$$",
    check: {
      prompt: "You find $F(s)$ mainly by",
      options: {
        a: "Evaluating the defining integral every time.",
        b: "Pattern-matching known Laplace transform pairs.",
        c: "Replacing $t$ with $s$ in $f(t)$.",
      },
      answer: "b",
      why: "Think of the transform as matching known LT pairs.",
    },
  },
  {
    id: "ex8",
    view: "table",
    highlight: "all",
    boardHint: "Unit impulse, unit step, exponential.",
    title: "Three pairs to start",
    body: "All pairs in the table are for $t\\ge 0$ ($f(t)=0$ for $t<0$).",
    eq: [
      "$$\\delta(t)\\;\\leftrightarrow\\; 1$$",
      "$$u(t)\\;\\leftrightarrow\\; 1/s$$",
      "$$e^{-at}u(t)\\;\\leftrightarrow\\; 1/(s+a)\\quad (a>0)$$",
    ],
  },
  {
    id: "guide",
    view: "guide",
    highlight: "all",
    boardHint: "Transform the circuit, solve algebra, then inverse LT.",
    title: "Step-by-step (circuit method)",
    points: [
      "Transform the circuit from the time domain to the frequency domain.",
      "Solve the algebraic equations there (nodal, mesh, superposition — the same theorems still hold).",
      "Inverse LT the result to get the time-domain solution.",
    ],
    eq: "$$\\text{time domain}\\;\\xrightarrow{\\mathrm{LT}}\\;\\text{algebra}\\;\\xrightarrow{\\mathrm{LT}^{-1}}\\; f(t)$$",
  },
  {
    id: "zero",
    view: "elements",
    highlight: "all",
    boardHint: "Zigzag = R. Coil = L. Two plates = C.",
    title: "Zero initial conditions",
    body: "At rest, KCL and KVL stay the same, but they are now algebraic. These are the $s$-domain impedances $R$, $sL$, and $1/(sC)$.",
    eq: [
      "$$V(s)=R I(s)$$",
      "$$V(s)=sL\\,I(s)$$",
      "$$V(s)=I(s)/(sC)$$",
    ],
    check: {
      prompt: "With zero I.C.s, an inductor maps to",
      options: {
        a: "$V(s)=sL\\,I(s)$.",
        b: "$V(s)=L I(s)$ (same as a resistor $L$).",
        c: "$V(s)=I(s)/(sL)$.",
      },
      answer: "a",
      why: "$v=L di/dt$ and $i(0^-)=0$ give $V=sLI$. The capacitor is $V=I/(sC)$.",
    },
  },
  {
    id: "nz",
    view: "ic",
    highlight: "all",
    boardHint: "Non-zero I.C.s become extra sources next to sL or 1/sC.",
    title: "Non-zero initial conditions",
    body: "Draw the series voltage source or the parallel current source, then use ordinary circuit theorems. If I.C.s are not given, find $v_C(0^-)$ and $i_L(0^-)$ from DC steady state first (C open, L short).",
    eq: [
      "$$V_L(s)=sL I(s)-L i(0^-)$$",
      "$$I_C(s)=sC V(s)-C v(0^-)$$",
    ],
  },
];

export const PRACTICE = [
  {
    id: "p1",
    prompt: "Laplace is useful because it turns",
    options: {
      a: "Algebra into harder calculus.",
      b: "Integro-differential equations into algebra, and folds in I.C.s.",
      c: "KCL into a guess for $v(t)$.",
    },
    answer: "b",
    why: "Frequency domain turns DEs into algebra and folds in I.C.s, so natural + forced come out together.",
  },
  {
    id: "p2",
    prompt: "$\\mathcal{L}\\{\\delta(t)\\}$ is",
    options: {
      a: "$1/s$.",
      b: "$1$.",
      c: "$s$.",
    },
    answer: "b",
    why: "Unit impulse $\\leftrightarrow 1$. Unit step $\\leftrightarrow 1/s$.",
  },
  {
    id: "p3",
    prompt: "With $v(0^-)=0$, a capacitor in the $s$-domain obeys",
    options: {
      a: "$V=sC\\,I$.",
      b: "$V=C I$.",
      c: "$V=I/(sC)$.",
    },
    answer: "c",
    why: "Zero-I.C. capacitor: $V(s)=I(s)/(sC)$. $sC$ is the admittance.",
  },
];
