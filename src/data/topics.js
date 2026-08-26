export const TOPICS = [
  { id: 1, name: "Basic laws", blurb: "Ohm, KCL, KVL, equivalents" },
  { id: 2, name: "Energy storage", blurb: "Capacitors, inductors, coupling" },
  { id: 3, name: "Transients and AC", blurb: "RC/RL, phasors, power" },
  { id: 4, name: "Op-amps", blurb: "Ideal amps and configurations" },
  { id: 5, name: "Laplace", blurb: "s-domain models" },
  { id: 6, name: "Network functions", blurb: "H(s) and two-ports" },
  { id: 7, name: "Frequency domain", blurb: "RMS, reactance, mixed sources" },
];

export const DIFFICULTIES = [
  { id: 1, name: "Easy", icon: "1" },
  { id: 2, name: "Average", icon: "2" },
  { id: 3, name: "Challenging", icon: "3" },
];

export function lessonKey(topicId, difficulty) {
  return `${topicId}-${difficulty}`;
}
