export const STEPS = [
  {
    id: "p1_partial_fractions",
    view: "split",
    highlight: "a",
    title: "Partial fraction expansion (distinct poles)",
    body: "Decompose $F(s) = \\dfrac{10s}{(s + 1)(s + 2)(s + 3)}$ into standard forms $\\dfrac{A}{s+1} + \\dfrac{B}{s+2} + \\dfrac{C}{s+3}$. Solving yields $A = -5$, $B = 20$, and $C = -15$.",
    eq: "$$F(s) = \\dfrac{-5}{s + 1} + \\dfrac{20}{s + 2} - \\dfrac{15}{s + 3}$$",
    check: {
      prompt: "How is the constant $A = -5$ determined?",
      options: {
        a: "Multiply $F(s)$ by $(s+1)$ and evaluate at $s = -1$.",
        b: "Integrate $F(s)$ with respect to $s$.",
        c: "Set $s = 0$ in the original equation.",
      },
      answer: "a",
      why: "Using the residue method, $A = [(s+1)F(s)]_{s=-1} = \\dfrac{10(-1)}{(-1+2)(-1+3)} = -5$.",
    },
  },
  {
    id: "p1_inverse_transform",
    view: "decay",
    highlight: "curve",
    title: "Apply inverse transform",
    body: "Use the transform pair $\\mathcal{L}^{-1}\\left\\{\\dfrac{1}{s + a}\\right\\} = e^{-at}u(t)$ on each term.",
    eq: "$$f(t) = (-5e^{-t} + 20e^{-2t} - 15e^{-3t})u(t)$$",
    check: {
      prompt: "What is the inverse transform of the middle term $20 / (s + 2)$?",
      options: {
        a: "$20 e^{-2t} u(t)$",
        b: "$-20 e^{2t} u(t)$",
        c: "$20 t e^{-2t} u(t)$",
      },
      answer: "a",
      why: "Constant factor $20$ multiplies the inverse of $1/(s+2)$, which is $e^{-2t}$.",
    },
  },
  {
    id: "p2_partial_fractions",
    view: "trigtable",
    highlight: "damp",
    title: "Partial fractions with complex poles",
    body: "Decompose $F(s) = \\dfrac{s + 1}{(s + 2)(s^2 + 2s + 5)}$ into $\\dfrac{A}{s+2} + \\dfrac{Bs + C}{s^2 + 2s + 5}$. Solving linear equations yields $A = -1/5$, $B = 1/5$, and $C = 9/5$.",
    eq: "$$F(s) = -\\dfrac{1}{5}\\cdot\\dfrac{1}{s+2} + \\dfrac{1}{5}\\cdot\\dfrac{s + 9}{(s+1)^2 + 4}$$",
    check: {
      prompt: "Why does the second term have a linear numerator $(Bs + C)$?",
      options: {
        a: "Because its denominator is an irreducible quadratic factor.",
        b: "Because the total order of the numerator must equal the denominator.",
        c: "Because it contains an exponential component.",
      },
      answer: "a",
      why: "Irreducible quadratic terms in partial fractions require a first-degree polynomial numerator $(Bs + C)$.",
    },
  },
  {
    id: "p2_inverse_transform",
    view: "damped",
    highlight: "curve",
    title: "Complete square & invert to sine/cosine",
    body: "Rewrite $\\dfrac{s+9}{(s+1)^2+4}$ as $\\dfrac{s+1}{(s+1)^2+4} + 4\\cdot\\dfrac{2}{(s+1)^2+4}$ to expose damped cosine and sine forms.",
    eq: "$$f(t) = \\left( -\\dfrac{1}{5}e^{-2t} + \\dfrac{1}{5}e^{-t}\\cos(2t) + \\dfrac{4}{5}e^{-t}\\sin(2t) \\right) u(t)$$",
    check: {
      prompt: "What term produces the $e^{-t}\\cos(2t)$ response?",
      options: {
        a: "$(s + 1) / [(s + 1)^2 + 2^2]$",
        b: "$2 / [(s + 1)^2 + 2^2]$",
        c: "$1 / (s + 2)$",
      },
      answer: "a",
      why: "The form $(s - a)/[(s - a)^2 + \\omega^2]$ transforms to $e^{at}\\cos(\\omega t)$. Here $a = -1$ and $\\omega = 2$.",
    },
  },
  {
    id: "p3_differential_eq",
    view: "deriv",
    highlight: "dt",
    title: "Apply initial conditions in the Laplace domain",
    body: "Transform $\\dfrac{d^2v}{dt^2} + 5\\dfrac{dv}{dt} + 6v = 6e^{-t}$ using initial values $v(0)=2$ and $v'(0)=4$. Obtain $(s^2+5s+6)V(s) - 2s - 14 = \\dfrac{6}{s+1}$.",
    eq: "$$V(s) = \\dfrac{2s^2 + 16s + 20}{(s+1)(s+2)(s+3)}$$",
    check: {
      prompt: "Where does the $-2s - 14$ term come from?",
      options: {
        a: "From initial condition expansions: $s v(0) + v'(0) + 5 v(0)$.",
        b: "From the right-hand side source $6 e^{-t}$.",
        c: "From completing the square of the characteristic equation.",
      },
      answer: "a",
      why: "Transforming $d^2v/dt^2$ gives $s^2V(s) - s v(0) - v'(0)$ and $5 dv/dt$ gives $5(sV(s) - v(0))$. Grouping constants yields $-2s - 4 - 5(2) = -2s - 14$.",
    },
  },
  {
    id: "p3_time_response",
    view: "decay",
    highlight: "curve",
    title: "Solve for the time-domain response $v(t)$",
    body: "Expand $V(s)$ into $\\dfrac{3}{s+1} + \\dfrac{8}{s+2} - \\dfrac{9}{s+3}$ using partial fractions, then take the inverse transform.",
    eq: "$$v(t) = (3e^{-t} + 8e^{-2t} - 9e^{-3t}) u(t)$$",
    check: {
      prompt: "What is the steady-state value of $v(t)$ as $t$ approaches infinity?",
      options: {
        a: "$0$",
        b: "$3$",
        c: "$2$",
      },
      answer: "a",
      why: "All three exponential terms ($e^{-t}$, $e^{-2t}$, $e^{-3t}$) decay to $0$ as $t \\to \\infty$.",
    },
  },
];

export const PRACTICE = [
  {
    id: "p1",
    prompt: "For $F(s)=10s/((s+1)(s+2)(s+3))$, the residue $A$ at $s=-1$ is found by",
    options: {
      a: "Covering $(s+1)$ and evaluating at $s=-1$.",
      b: "Integrating $F(s)$.",
      c: "Setting $s=0$.",
    },
    answer: "a",
    why: "$A=[(s+1)F(s)]_{s=-1}=-5$.",
  },
  {
    id: "p2",
    prompt: "An irreducible quadratic factor in $F(s)$ needs a numerator of the form",
    options: {
      a: "$Bs+C$.",
      b: "A constant only.",
      c: "$D/(s+p)^2$.",
    },
    answer: "a",
    why: "That $Bs+C$ splits into damped cosine and sine after completing the square.",
  },
  {
    id: "p3",
    prompt: "If $v(t)=(3e^{-t}+8e^{-2t}-9e^{-3t})u(t)$, then $v(\\infty)$ is",
    options: {
      a: "$0$.",
      b: "$2$.",
      c: "$3$.",
    },
    answer: "a",
    why: "Every exponential dies. Steady state is $0$.",
  },
];
