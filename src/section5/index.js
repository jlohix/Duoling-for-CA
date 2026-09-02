import { STEPS as basicsSteps, PRACTICE as basicsPractice } from "./labs/basics";
import { STEPS as propertiesSteps, PRACTICE as propertiesPractice } from "./labs/properties";
import { STEPS as summarySteps, PRACTICE as summaryPractice } from "./labs/summary";
import { STEPS as polesSteps, PRACTICE as polesPractice } from "./labs/polesZeros";
import { STEPS as simpleSteps, PRACTICE as simplePractice } from "./labs/simpleReal";
import { STEPS as repeatedSteps, PRACTICE as repeatedPractice } from "./labs/repeatedReal";
import { STEPS as complexSteps, PRACTICE as complexPractice } from "./labs/complexPoles";
import { STEPS as pfeSteps, PRACTICE as pfePractice } from "./labs/pfe";
import { STEPS as workedSteps, PRACTICE as workedPractice } from "./labs/worked";
import LaplaceSchematic from "./Schematics";

export const LAPLACE_LABS = [
  {
    id: "basics",
    title: "Laplace Transform Basics",
    icon: "L",
    count: "Walkthrough",
    boardHint: "Time Domain on the left. Frequency Domain on the right.",
    formula: "$f(t)\\Longleftrightarrow F(s)$",
    doneBlurb: "Unilateral LT, then s-domain R, sL, 1/sC.",
    steps: basicsSteps,
    practice: basicsPractice,
  },
  {
    id: "properties",
    title: "Properties of LT",
    icon: "Pr",
    count: "Walkthrough",
    boardHint: "Linearity, scaling, time/frequency shift, d/dt, integral, t f(t), initial/final.",
    formula: "$a_1 f_1+a_2 f_2 \\leftrightarrow a_1 F_1+a_2 F_2$",
    doneBlurb: "Time Shift is e^{-as}. Frequency Shift is F(s+a).",
    steps: propertiesSteps,
    practice: propertiesPractice,
  },
  {
    id: "summary",
    title: "Laplace Transform Summary",
    icon: "Σ",
    count: "Walkthrough",
    boardHint: "Table pairs. All defined for t ≥ 0.",
    formula: "$u(t)\\leftrightarrow 1/s$",
    doneBlurb: "Impulse, step, exp, ramp, then damped trig.",
    steps: summarySteps,
    practice: summaryPractice,
  },
  {
    id: "poles",
    title: "Poles & Zeros",
    icon: "×",
    count: "Walkthrough",
    boardHint: "N(s)=0 zeros. D(s)=0 poles. H(s)=Y(s)/X(s).",
    formula: "poles from $D(s)=0$",
    doneBlurb: "Proper fraction, then H(s) and h(t).",
    steps: polesSteps,
    practice: polesPractice,
  },
  {
    id: "simple",
    title: "Simple Real Poles",
    icon: "e",
    count: "Walkthrough",
    boardHint: "k_i / (s+p_i) → k_i e^{-p_i t} u(t).",
    formula: "$k/(s+p)\\leftrightarrow k e^{-pt}u(t)$",
    doneBlurb: "Cover-up k_i. Overdamped = distinct real poles.",
    steps: simpleSteps,
    practice: simplePractice,
  },
  {
    id: "repeated",
    title: "Repeated Real Poles",
    icon: "t",
    count: "Walkthrough",
    boardHint: "n stacked poles → n terms, extra powers of t.",
    formula: "$1/(s+p)^2\\leftrightarrow t e^{-pt}u(t)$",
    doneBlurb: "k_2 then k_1. Critical damping = repeated pole.",
    steps: repeatedSteps,
    practice: repeatedPractice,
  },
  {
    id: "complex",
    title: "Distinct Complex Poles",
    icon: "~",
    count: "Walkthrough",
    boardHint: "s = −α ± jβ. In RLC, β is ω_d.",
    formula: "$e^{-\\alpha t}(A_1\\cos\\beta t+B_1\\sin\\beta t)u(t)$",
    doneBlurb: "Split A1 s+A2. Underdamped = this pair.",
    steps: complexSteps,
    practice: complexPractice,
  },
  {
    id: "pfe",
    title: "Partial Fraction Expansion",
    icon: "PF",
    count: "Walkthrough",
    boardHint: "Decompose, match the table, then × u(t).",
    formula: "$F(s)\\xrightarrow{\\mathrm{PFE}} f(t)$",
    doneBlurb: "Then inverse LT back to the time domain.",
    steps: pfeSteps,
    practice: pfePractice,
  },
  {
    id: "worked",
    title: "Worked examples",
    icon: "Ex",
    count: "Walkthrough",
    boardHint: "Three inverses: distinct poles, complex poles, then an ODE with I.C.s.",
    formula: "$F(s)\\xrightarrow{\\mathrm{PFE}} f(t)$",
    doneBlurb: "Cover-up, complete the square, then bring I.C.s into s.",
    steps: workedSteps,
    practice: workedPractice,
  },
];

export function getLaplaceLab(id) {
  return LAPLACE_LABS.find((lab) => lab.id === id) || LAPLACE_LABS[0];
}

export function getNextLaplaceLab(id) {
  const index = LAPLACE_LABS.findIndex((lab) => lab.id === id);
  if (index < 0 || index >= LAPLACE_LABS.length - 1) return null;
  return LAPLACE_LABS[index + 1];
}

export { LaplaceSchematic };
