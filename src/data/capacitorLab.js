export const CAPACITOR_DRAG = [
  {
    id: "series-4-4",
    kind: "series",
    c1: 4,
    c2: 4,
    correct: 2,
    choices: [1, 2, 4, 8],
    why: "Series: $1/C_{eq}=1/4+1/4$, so $C_{eq}=2\\,\\mu\\mathrm{F}$.",
  },
  {
    id: "par-3-6",
    kind: "parallel",
    c1: 3,
    c2: 6,
    correct: 9,
    choices: [2, 3, 9, 18],
    why: "Parallel: $C_{eq}=C_1+C_2=3+6=9\\,\\mu\\mathrm{F}$.",
  },
  {
    id: "tpos-i",
    kind: "tpos",
    volts: 10,
    rOhm: 5,
    correct: 0,
    choices: [0, 2, 10],
    why: "For $t>0$ in DC the voltage has settled, so $i=C\\,dv/dt=0$. Do not use $V_s/R$.",
  },
];

export function capDragLabel(question, value) {
  if (question.kind === "tpos") return `${value} A`;
  return `${value} μF`;
}

export function capDragPrompt(question) {
  if (question.kind === "series") {
    return `Series: $C_1=${question.c1}\\,\\mu\\mathrm{F}$ and $C_2=${question.c2}\\,\\mu\\mathrm{F}$. Drag $C_{eq}$.`;
  }
  if (question.kind === "parallel") {
    return `Parallel: $C_1=${question.c1}\\,\\mu\\mathrm{F}$ and $C_2=${question.c2}\\,\\mu\\mathrm{F}$. Drag $C_{eq}$.`;
  }
  return `The source has been on a long time ($t>0$). $V_s=${question.volts}\\,\\mathrm{V}$, $R=${question.rOhm}\\,\\Omega$. Drag the current $i$.`;
}
