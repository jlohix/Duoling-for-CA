export const INDUCTOR_DRAG = [
  {
    id: "series-4-4",
    kind: "series",
    l1: 4,
    l2: 4,
    correct: 8,
    choices: [2, 4, 8, 16],
    why: "Series: $L_{eq}=L_1+L_2=4+4=8\\,\\mathrm{mH}$. Capacitors in series would have been $2\\,\\mathrm{mH}$.",
  },
  {
    id: "par-3-6",
    kind: "parallel",
    l1: 3,
    l2: 6,
    correct: 2,
    choices: [2, 3, 9, 18],
    why: "Parallel: $1/L_{eq}=1/3+1/6=1/2$, so $L_{eq}=2\\,\\mathrm{mH}$.",
  },
  {
    id: "tpos-i",
    kind: "tpos",
    volts: 10,
    rOhm: 5,
    correct: 2,
    choices: [0, 2, 10],
    why: "For $t>0$ in DC the current has settled, so $v=L\\,di/dt=0$ and $L$ is a short. Then $i=V_s/R=2\\,\\mathrm{A}$, not $0$.",
  },
];

export function indDragLabel(question, value) {
  if (question.kind === "tpos") return `${value} A`;
  return `${value} mH`;
}

export function indDragPrompt(question) {
  if (question.kind === "series") {
    return `Series: $L_1=${question.l1}\\,\\mathrm{mH}$ and $L_2=${question.l2}\\,\\mathrm{mH}$. Drag $L_{eq}$.`;
  }
  if (question.kind === "parallel") {
    return `Parallel: $L_1=${question.l1}\\,\\mathrm{mH}$ and $L_2=${question.l2}\\,\\mathrm{mH}$. Drag $L_{eq}$.`;
  }
  return `The source has been on a long time ($t>0$). $V_s=${question.volts}\\,\\mathrm{V}$, $R=${question.rOhm}\\,\\Omega$. Drag the current $i$.`;
}
