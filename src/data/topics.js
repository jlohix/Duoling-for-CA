export const TOPICS = [
  { id: 1, name: "Basic laws", short: "Laws", blurb: "Ohm, KCL, KVL, dividers, and power" },
  { id: 2, name: "Op-amps", short: "Op-amp", blurb: "Ideal op-amps, inverting and non-inverting amps" },
  { id: 3, name: "Transients", short: "RC/RL", blurb: "RC and RL time constants, natural and step response" },
  { id: 4, name: "First-order circuits", short: "1st", blurb: "Source-free and step response of RC and RL" },
  { id: 5, name: "Laplace transforms", short: "Laplace", blurb: "s-domain models, poles, and inverse transforms" },
  { id: 6, name: "Network functions", short: "H(s)", blurb: "H(s) and two-ports" },
  { id: 7, name: "Frequency domain", short: "Freq", blurb: "RMS, reactance, mixed sources" },
];

export const DIFFICULTIES = [
  { id: 1, name: "Easy", icon: "1" },
  { id: 2, name: "Average", icon: "2" },
  { id: 3, name: "Challenging", icon: "3" },
];

export function lessonKey(topicId, difficulty) {
  return `${topicId}-${difficulty}`;
}
