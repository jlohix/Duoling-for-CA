export const FREEC_DRAG = [
  {
    id: "tau-2k-4u",
    kind: "tau",
    rLabel: "2 kΩ",
    cLabel: "4 μF",
    correct: 8,
    choices: [2, 4, 8, 16],
    unit: "ms",
    why: "$\\tau=RC=2\\times 10^3\\times 4\\times 10^{-6}=8\\,\\mathrm{ms}$. Not $L/R$.",
  },
  {
    id: "v-at-tau",
    kind: "vtau",
    v0: 10,
    correct: 3.7,
    choices: [3.7, 6.3, 5, 1.4],
    unit: "V",
    why: "At $t=\\tau$, $v=v(0)/e\\approx 3.7\\,\\mathrm{V}$. $6.3\\,\\mathrm{V}$ is $10(1-1/e)$. $5\\,\\mathrm{V}$ is a guessed half. $1.4\\,\\mathrm{V}$ is $10e^{-2}$ (two time constants).",
  },
  {
    id: "tau-1k-5u",
    kind: "tau",
    rLabel: "1 kΩ",
    cLabel: "5 μF",
    correct: 5,
    choices: [1, 5, 6, 20],
    unit: "ms",
    why: "$\\tau=RC=1\\times 10^3\\times 5\\times 10^{-6}=5\\,\\mathrm{ms}$.",
  },
  {
    id: "v-inf",
    kind: "vinf",
    v0: 10,
    correct: 0,
    choices: [0, 3.7, 10],
    unit: "V",
    why: "No source. As $t\\to\\infty$, $e^{-t/\\tau}\\to 0$, so $v\\to 0$.",
  },
];

export function freeCDragLabel(question, value) {
  return `${value} ${question.unit}`;
}

export function freeCDragPrompt(question) {
  if (question.kind === "tau") {
    return `$R=${question.rLabel}$, $C=${question.cLabel}$. Drag $\\tau=RC$.`;
  }
  if (question.kind === "vtau") {
    return `$v(0)=${question.v0}\\,\\mathrm{V}$. Drag $v(\\tau)$ (one time constant).`;
  }
  return `Source-free. $v(0)=${question.v0}\\,\\mathrm{V}$. Drag $v(\\infty)$.`;
}
