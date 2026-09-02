export const DC_PARTS = [
  { id: "open", label: "Open circuit" },
  { id: "short", label: "Short circuit" },
  { id: "cap", label: "Capacitor" },
  { id: "ind", label: "Inductor" },
];

export const DC_LAB_QUESTIONS = [
  {
    id: "c-series",
    part: "C",
    partName: "capacitor",
    volts: 12,
    correct: "open",
    currentText: "I → 0",
    why: "After a long time, a capacitor is an open circuit, so current is zero.",
  },
  {
    id: "l-series",
    part: "L",
    partName: "inductor",
    volts: 12,
    rOhm: 4,
    correct: "short",
    currentText: "I = 3 A",
    why: "After a long time, an inductor is a short circuit. Then I = V / R.",
  },
  {
    id: "c-charged",
    part: "C",
    partName: "capacitor",
    volts: 9,
    correct: "open",
    currentText: "I → 0",
    why: "DC steady state: capacitor plates hold voltage, no current through C.",
  },
  {
    id: "l-steady",
    part: "L",
    partName: "inductor",
    volts: 10,
    rOhm: 5,
    correct: "short",
    currentText: "I = 2 A",
    why: "DC steady state: inductor voltage is zero, so it behaves like a wire.",
  },
];
