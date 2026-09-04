export const STEPS = [
  {
    id: "how",
    view: "table",
    highlight: "all",
    title: "The summary table",
    body: "Functions $f(t)\\Longleftrightarrow F(s)$ are LT pairs, defined for $t\\ge 0$ ($f(t)=0$ for $t<0$).",
    points: [
      "Forward: match $f(t)$ to a row.",
      "Inverse: split $F(s)$ into rows, then match.",
      "Properties stretch the table without new integrals.",
    ],
  },
  {
    id: "imp",
    view: "table",
    highlight: "imp",
    title: "Impulse, step, ramp",
    body: "Extra powers of $t$ stack poles at $s=0$.",
    eq: [
      "$$\\delta(t)\\;\\leftrightarrow\\; 1$$",
      "$$u(t)\\;\\leftrightarrow\\; 1/s$$",
      "$$t\\,u(t)\\;\\leftrightarrow\\; 1/s^2$$",
      "$$t^n\\;\\leftrightarrow\\; n!/s^{n+1}$$",
    ],
  },
  {
    id: "exp",
    view: "table",
    highlight: "exp",
    title: "Exponential and $t e^{-at}$",
    body: "The $t e^{-at}$ row is Frequency Differentiation on the exponential.",
    eq: [
      "$$e^{-at}u(t)\\;\\leftrightarrow\\; 1/(s+a)$$",
      "$$t e^{-at}u(t)\\;\\leftrightarrow\\; 1/(s+a)^2$$",
      "$$t^n e^{-at}u(t)\\;\\leftrightarrow\\; n!/(s+a)^{n+1}$$",
    ],
    check: {
      prompt: "Which pair is the unit ramp $t\\,u(t)$?",
      options: {
        a: "$1/s$.",
        b: "$1/s^2$.",
        c: "$s/(s^2+1)$.",
      },
      answer: "b",
      why: "Unit step is $1/s$. Time Integration once more gives $1/s^2$.",
    },
  },
  {
    id: "trig",
    view: "trigtable",
    highlight: "sin",
    title: "Sine and cosine",
    body: "Memory: sine starts at 0 (no $s$ on top). Cosine starts at 1 ($s$ on top).",
    eq: [
      "$$\\sin\\omega t\\,u(t)\\;\\leftrightarrow\\; \\dfrac{\\omega}{s^2+\\omega^2}$$",
      "$$\\cos\\omega t\\,u(t)\\;\\leftrightarrow\\; \\dfrac{s}{s^2+\\omega^2}$$",
    ],
  },
  {
    id: "damped",
    view: "trigtable",
    highlight: "damp",
    title: "Damped sine and cosine",
    body: "Frequency Shift on the sine/cosine rows. Distinct complex poles use this pair with the oscillation written as $\\beta$.",
    eq: [
      "$$e^{-at}\\sin\\omega t\\;\\leftrightarrow\\; \\dfrac{\\omega}{(s+a)^2+\\omega^2}$$",
      "$$e^{-at}\\cos\\omega t\\;\\leftrightarrow\\; \\dfrac{s+a}{(s+a)^2+\\omega^2}$$",
    ],
  },
  {
    id: "use",
    view: "guide",
    highlight: "all",
    title: "How the table is used on a circuit",
    points: [
      "Transform the circuit to the $s$-domain.",
      "Solve for $V(s)$ or $I(s)$.",
      "Partial fractions, then match this table.",
      "Multiply the sum by $u(t)$.",
    ],
  },
];

export const PRACTICE = [
  {
    id: "p1",
    view: "table",
    prompt: "The inverse of $1$ is",
    options: {
      a: "The unit impulse $\\delta(t)$.",
      b: "The unit step $u(t)$.",
      c: "The unit ramp $t$.",
    },
    answer: "a",
    why: "$\\delta(t)\\leftrightarrow 1$. $u(t)\\leftrightarrow 1/s$. $t\\leftrightarrow 1/s^2$.",
  },
  {
    id: "p2",
    view: "trigtable",
    prompt: "$\\cos 3t\\,u(t)$ matches",
    options: {
      a: "$3/(s^2+9)$.",
      b: "$s/(s^2+9)$.",
      c: "$1/(s+3)$.",
    },
    answer: "b",
    why: "Cosine keeps $s$ on top. $3/(s^2+9)$ is $\\sin 3t\\,u(t)$.",
  },
  {
    id: "p3",
    view: "guide",
    prompt: "To invert a circuit $V(s)$ you",
    options: {
      a: "Evaluate the Bromwich integral by hand.",
      b: "Decompose into table terms, then write each $v(t)$ piece times $u(t)$.",
      c: "Replace every $s$ by $t$.",
    },
    answer: "b",
    why: "Partial fractions, then match the table.",
  },
  {
    id: "p4",
    view: "table",
    prompt: "The inverse of $1/s$ is",
    options: {
      a: "$\\delta(t)$.",
      b: "$u(t)$.",
      c: "$t\\,u(t)$.",
    },
    answer: "b",
    why: "Unit step $\\leftrightarrow 1/s$. Impulse $\\leftrightarrow 1$. Ramp $\\leftrightarrow 1/s^2$.",
  },
  {
    id: "p5",
    view: "trigtable",
    prompt: "$\\sin 3t\\,u(t)$ matches",
    options: {
      a: "$s/(s^2+9)$.",
      b: "$1/(s+3)$.",
      c: "$3/(s^2+9)$.",
    },
    answer: "c",
    why: "Sine has $\\omega$ on top. Cosine keeps $s$ on top.",
  },
];
