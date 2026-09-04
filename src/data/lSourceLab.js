export const LSOURCE_DRAG = [
  {
    id: "tau-8m-2",
    kind: "tau",
    lLabel: "8 mH",
    rLabel: "2 Ω",
    correct: 4,
    choices: [2, 4, 8, 16],
    unit: "ms",
    why: "$\\tau=L/R=8\\times 10^{-3}/2=4\\,\\mathrm{ms}$. Not $RC$, and not $L\\times R$.",
  },
  {
    id: "i-at-tau",
    kind: "itau",
    vs: 10,
    rOhm: 5,
    iInf: 2,
    correct: 1.26,
    choices: [0, 0.74, 1.26, 2],
    unit: "A",
    why: "$I_0=0$, so $i(\\tau)=(V_s/R)(1-1/e)\\approx 2\\times 0.632\\approx 1.26\\,\\mathrm{A}$. $0.74\\,\\mathrm{A}$ is $2/e$, the source-free leftover. $2\\,\\mathrm{A}$ is $i(\\infty)$, not $i(\\tau)$.",
  },
  {
    id: "tau-6m-3",
    kind: "tau",
    lLabel: "6 mH",
    rLabel: "3 Ω",
    correct: 2,
    choices: [2, 6, 9, 18],
    unit: "ms",
    why: "$\\tau=L/R=6\\times 10^{-3}/3=2\\,\\mathrm{ms}$. $18$ is $L\\times R$ with a unit slip.",
  },
  {
    id: "i-inf",
    kind: "iinf",
    vs: 12,
    rOhm: 4,
    correct: 3,
    choices: [0, 3, 4, 12],
    unit: "A",
    why: "$L$ shorts in DC, so $i(\\infty)=V_s/R=12/4=3\\,\\mathrm{A}$. Not $0$ (that is source-free) and not $12\\,\\mathrm{A}$ (forgot $R$).",
  },
];

export function lSourceDragLabel(question, value) {
  return `${value} ${question.unit}`;
}

export function lSourceDragPrompt(question) {
  if (question.kind === "tau") {
    return `$L=${question.lLabel}$, $R=${question.rLabel}$. Drag $\\tau=L/R$.`;
  }
  if (question.kind === "itau") {
    return `$I_0=0$, $V_s=${question.vs}\\,\\mathrm{V}$, $R=${question.rOhm}\\,\\Omega$. Drag $i(\\tau)$.`;
  }
  return `$V_s=${question.vs}\\,\\mathrm{V}$, $R=${question.rOhm}\\,\\Omega$. Drag $i(\\infty)$.`;
}
