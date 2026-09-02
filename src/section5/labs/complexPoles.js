export const STEPS = [
  {
    id: "pair",
    view: "plane",
    highlight: "pole",
    title: "Distinct complex poles",
    body: "One simple conjugate pair. Real coefficients force the mate. The denominator then contains a quadratic.",
    eq: [
      "$$s=-\\alpha\\pm j\\beta$$",
      "$$(s+\\alpha)^2+\\beta^2$$",
    ],
  },
  {
    id: "shape",
    view: "damped",
    highlight: "curve",
    title: "Time picture",
    body: "$\\alpha$ (how far left) is the decay. $\\beta$ (how far up) is the oscillation in rad/s. For RLC, this $\\beta$ is the damped frequency $\\omega_d$.",
    eq: "$$e^{-\\alpha t}(A_1\\cos\\beta t+B_1\\sin\\beta t)\\,u(t)$$",
    check: {
      prompt: "Moving the pair left (bigger $\\alpha$) makes the ring",
      options: {
        a: "Last longer.",
        b: "Die faster.",
        c: "Turn into a ramp $t$.",
      },
      answer: "b",
      why: "That is more damping. Height $\\beta$ (or $\\omega_d$) is the wiggle, not the decay.",
    },
  },
  {
    id: "split",
    view: "trigtable",
    highlight: "damp",
    title: "Keep the quadratic",
    body: "Split the numerator into a $(s+\\alpha)$ piece (cosine) and a leftover (sine). Completing the square stays real.",
    eq: [
      "$$F(s)=\\dfrac{A_1 s+A_2}{(s+\\alpha)^2+\\beta^2}+\\cdots$$",
      "$$B_1=\\dfrac{A_2-A_1\\alpha}{\\beta}$$",
    ],
  },
  {
    id: "match",
    view: "trigtable",
    highlight: "sin",
    title: "Match the table",
    body: "Those two pieces are the damped cosine and damped sine rows. You do not have to cover-up one complex pole.",
    eq: [
      "$$\\dfrac{s+\\alpha}{(s+\\alpha)^2+\\beta^2}\\;\\leftrightarrow\\; e^{-\\alpha t}\\cos\\beta t\\,u(t)$$",
      "$$\\dfrac{\\beta}{(s+\\alpha)^2+\\beta^2}\\;\\leftrightarrow\\; e^{-\\alpha t}\\sin\\beta t\\,u(t)$$",
    ],
  },
  {
    id: "ckt",
    view: "elements",
    highlight: "l",
    title: "Underdamped RLC ($\\beta=\\omega_d$)",
    body: "Underdamped when $\\alpha<\\omega_0$. That $\\omega_d$ is the $\\beta$ in the inverse formula.",
    points: [
      "Series: $\\alpha=R/(2L)$",
      "Parallel: $\\alpha=1/(2RC)$",
      "Both: $\\omega_0=1/\\sqrt{LC}$",
    ],
    eq: [
      "$$s^2+2\\alpha s+\\omega_0^2=0$$",
      "$$\\omega_d=\\sqrt{\\omega_0^2-\\alpha^2}$$",
    ],
  },
];

export const PRACTICE = [
  {
    id: "p1",
    prompt: "Distinct complex poles (real coefficients) sit at",
    options: {
      a: "$s=-\\alpha\\pm j\\beta$ (a conjugate pair).",
      b: "Both on the positive real axis.",
      c: "One complex pole is enough.",
    },
    answer: "a",
    why: "Real $N$ and $D$ force a conjugate pair at $-\\alpha\\pm j\\beta$.",
  },
  {
    id: "p2",
    prompt: "The inverse of $\\beta / ((s+\\alpha)^2+\\beta^2)$ is",
    options: {
      a: "$e^{-\\alpha t}\\sin\\beta t\\,u(t)$.",
      b: "$e^{-\\alpha t}\\cos\\beta t\\,u(t)$.",
      c: "$t e^{-\\alpha t}u(t)$.",
    },
    answer: "a",
    why: "Sine has $\\beta$ on top. Cosine has $(s+\\alpha)$ on top.",
  },
  {
    id: "p3",
    prompt: "In series/parallel RLC, $\\beta$ in the inverse formula is",
    options: {
      a: "The damped frequency $\\omega_d$.",
      b: "Always $R/L$.",
      c: "The forcing frequency of the source.",
    },
    answer: "a",
    why: "$\\omega_d=\\sqrt{\\omega_0^2-\\alpha^2}$. Same number, two names.",
  },
];
