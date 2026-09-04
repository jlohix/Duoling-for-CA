export const STEPS = [
  {
    id: "frac",
    view: "split",
    highlight: "f",
    title: "Poles and zeros",
    body: "Write $F(s)=N(s)/D(s)$. If a factor cancels, that pole/zero pair disappears.",
    eq: [
      "$$\\text{zeros: } N(s)=0$$",
      "$$\\text{poles: } D(s)=0$$",
    ],
  },
  {
    id: "proper",
    view: "split",
    highlight: "split",
    title: "Proper vs long division",
    body: [
      "If $\\deg N < \\deg D$, $F(s)$ is proper — ready for partial fractions.",
      "If $\\deg N \\ge \\deg D$, long-divide first, then expand only the proper remainder.",
    ],
    eq: "$$\\dfrac{N}{D}=Q+\\dfrac{R}{D}\\qquad (\\deg R < \\deg D)$$",
    check: {
      prompt: "For $F(s)=(s+2)/((s+1)(s+4))$, the poles are",
      options: {
        a: "$s=-2$ only.",
        b: "$s=-1$ and $s=-4$.",
        c: "$s=+1$ and $s=+4$.",
      },
      answer: "b",
      why: "Poles from $D(s)=0$. The $-2$ is a zero.",
    },
  },
  {
    id: "marks",
    view: "plane",
    highlight: "all",
    title: "The $s$-plane",
    body: "$s=\\sigma+j\\omega$. Horizontal axis $\\sigma$, vertical $j\\omega$. Real poles sit on the $\\sigma$-axis. For real coefficients, complex poles come as conjugates.",
    points: [
      "Zero: circle ○",
      "Pole: cross ×",
    ],
  },
  {
    id: "nat",
    view: "decay",
    highlight: "pole",
    title: "Pole type → time shape",
    body: "Same families as second-order RLC. Always multiply by $u(t)$ after inverse LT.",
    points: [
      "Distinct real poles → overdamped",
      "Repeated real pole → critically damped",
      "Complex pair → underdamped",
    ],
    eq: [
      "$$A_1 e^{-\\alpha_1 t}+A_2 e^{-\\alpha_2 t}$$",
      "$$(D_1+D_2 t)e^{-\\alpha t}$$",
      "$$e^{-\\alpha t}(B_1\\cos\\beta t+B_2\\sin\\beta t)$$",
    ],
  },
  {
    id: "h",
    view: "guide",
    highlight: "s",
    title: "Transfer function $H(s)$",
    body: "Defined with zero initial energy. It can be voltage gain, current gain, impedance, or admittance. Poles of $H(s)$ (after cancellation) are the natural frequencies.",
    eq: [
      "$$H(s)=Y(s)/X(s)$$",
      "$$h(t)=\\mathcal{L}^{-1}\\{H(s)\\}$$",
    ],
  },
];

export const PRACTICE = [
  {
    id: "p1",
    view: "split",
    prompt: "A pole is a value of $s$ where",
    options: {
      a: "$N(s)=0$.",
      b: "$D(s)=0$.",
      c: "$F(s)=1$.",
    },
    answer: "b",
    why: "$s$ that makes $D(s)=0$ are poles. $N(s)=0$ are zeros.",
  },
  {
    id: "p2",
    view: "split",
    prompt: "If $\\deg N \\ge \\deg D$ you first",
    options: {
      a: "Long-divide, then expand $R(s)/D(s)$.",
      b: "Cover-up $s=\\infty$.",
      c: "Declare the circuit has no inverse.",
    },
    answer: "a",
    why: "Long-divide, then expand the proper remainder.",
  },
  {
    id: "p3",
    view: "guide",
    prompt: "$H(s)$ is defined with",
    options: {
      a: "Whatever I.C.s the circuit happens to have.",
      b: "Zero initial energy (no I.C. sources).",
      c: "Only current inputs.",
    },
    answer: "b",
    why: "Transfer function assumes no initial energy. $h(t)$ is the impulse response.",
  },
  {
    id: "p4",
    view: "split",
    prompt: "A zero is a value of $s$ where",
    options: {
      a: "$N(s)=0$.",
      b: "$D(s)=0$.",
      c: "$F(s)=\\infty$.",
    },
    answer: "a",
    why: "$N(s)=0$ are zeros. $D(s)=0$ are poles, where $|F|$ blows up.",
  },
  {
    id: "p5",
    view: "guide",
    prompt: "The impulse response $h(t)$ is",
    options: {
      a: "The inverse LT of $H(s)$.",
      b: "Always $\\delta(t)$.",
      c: "The same as the step response.",
    },
    answer: "a",
    why: "$h(t)=\\mathcal{L}^{-1}\\{H(s)\\}$. Step response is the integral of $h$, not $h$ itself.",
  },
];
