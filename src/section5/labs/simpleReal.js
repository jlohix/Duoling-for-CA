export const STEPS = [
  {
    id: "shape",
    view: "decay",
    highlight: "curve",
    title: "Simple real poles",
    body: "Distinct real poles at $s=-p_i$ (not repeated). If every $p_i>0$, each term dies — that is the overdamped family.",
    eq: [
      "$$\\dfrac{k}{s+p}\\;\\leftrightarrow\\; k e^{-pt}u(t)$$",
      "$$f(t)=\\big(k_1 e^{-p_1 t}+k_2 e^{-p_2 t}+\\cdots\\big)u(t)$$",
    ],
  },
  {
    id: "cover",
    view: "split",
    highlight: "a",
    title: "Residue $k_i$ (cover-up)",
    body: "Cover the $(s+p_i)$ factor and plug $s=-p_i$ into what remains.",
    eq: [
      "$$F(s)=\\sum \\dfrac{k_i}{s+p_i}$$",
      "$$k_i=(s+p_i)F(s)\\big|_{s=-p_i}$$",
    ],
    check: {
      prompt: "For $F(s)=6/(s+2)$, the residue $k$ is",
      options: {
        a: "$6$.",
        b: "$2$.",
        c: "$3$.",
      },
      answer: "a",
      why: "Already one term. $k=6$, so $f(t)=6e^{-2t}u(t)$.",
    },
  },
  {
    id: "two",
    view: "split",
    highlight: "b",
    title: "Two distinct real poles",
    points: [
      "Cover $(s+1)$: $k_1=8/(s+3)$ at $s=-1$ gives $k_1=4$.",
      "Cover $(s+3)$: $k_2=8/(s+1)$ at $s=-3$ gives $k_2=-4$.",
    ],
    eq: [
      "$$F(s)=\\dfrac{8}{(s+1)(s+3)}=\\dfrac{k_1}{s+1}+\\dfrac{k_2}{s+3}$$",
      "$$f(t)=(4e^{-t}-4e^{-3t})u(t)$$",
    ],
  },
  {
    id: "speed",
    view: "decay",
    highlight: "pole",
    title: "Which term lasts",
    body: "Pole at $-p$ is $e^{-pt}u(t)$. After a while you mainly see the pole closest to the $j\\omega$ axis (smallest $p$).",
    eq: "$$\\text{bigger } p \\;\\rightarrow\\; \\text{faster decay}$$",
  },
  {
    id: "ckt",
    view: "elements",
    highlight: "c",
    title: "Overdamped circuits",
    points: [
      "First-order RC/RL: one real pole (series RC natural pole $s=-1/RC$).",
      "Second-order overdamped: two distinct real roots when $\\alpha>\\omega_0$.",
    ],
    eq: "$$s^2+2\\alpha s+\\omega_0^2=0$$",
  },
];

export const PRACTICE = [
  {
    id: "p1",
    view: "decay",
    prompt: "The inverse of $5/(s+4)$ is",
    options: {
      a: "$5e^{-4t}u(t)$.",
      b: "$4e^{-5t}u(t)$.",
      c: "$5e^{+4t}u(t)$.",
    },
    answer: "a",
    why: "$k/(s+p)\\leftrightarrow k e^{-pt}u(t)$.",
  },
  {
    id: "p2",
    view: "split",
    prompt: "Cover-up for $k_i$ at $s=-p_i$ means",
    options: {
      a: "Drop $(s+p_i)$ and evaluate the rest at $s=-p_i$.",
      b: "Differentiate the denominator.",
      c: "Set $N(s)=0$.",
    },
    answer: "a",
    why: "Cover that factor and plug $s=-p_i$ into the rest. Repeated poles need a derivative.",
  },
  {
    id: "p3",
    view: "elements",
    prompt: "Two distinct real LHP poles are the",
    options: {
      a: "Overdamped natural response.",
      b: "Critically damped natural response.",
      c: "Underdamped natural response.",
    },
    answer: "a",
    why: "Real and distinct roots $\\rightarrow$ overdamped.",
  },
  {
    id: "p4",
    view: "decay",
    prompt: "The inverse of $3/(s+2)$ is",
    options: {
      a: "$2e^{-3t}u(t)$.",
      b: "$3e^{-2t}u(t)$.",
      c: "$3e^{+2t}u(t)$.",
    },
    answer: "b",
    why: "$k/(s+p)\\leftrightarrow k e^{-pt}u(t)$. The $+$ exponential would grow.",
  },
  {
    id: "p5",
    view: "split",
    prompt: "$F(s)=1/((s+1)(s+3))$ expands to terms like",
    options: {
      a: "$k_1/(s+1)+k_2/(s+3)$.",
      b: "$(As+B)/((s+1)(s+3))$ and stop.",
      c: "$k/(s+1)^2$ only.",
    },
    answer: "a",
    why: "Two distinct real poles: two cover-up constants. Repeated would bring $t e^{-pt}$.",
  },
];
