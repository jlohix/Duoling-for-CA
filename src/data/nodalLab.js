export const NODAL_STEPS = [
  {
    id: "meet",
    highlight: "all",
    title: "What nodal analysis is for",
    body: "Pick one node (a connection of wires) and write its voltage relative to ground. Then Ohm’s law on every resistor that touches that node, and KCL to say the currents must balance. Here the marked node is 6 V, and the battery is 18 V.",
    eq: "Node voltage, then Ohm, then KCL",
  },
  {
    id: "node",
    highlight: "node",
    title: "Label the node",
    body: "The big dot is the node we care about. Its voltage is already marked: 6 V above the bottom rail (ground). The top-left resistor sits between 18 V and 6 V. The two vertical resistors sit between 6 V and 0 V.",
    eq: "Node = 6 V  (ground = 0 V)",
    check: {
      prompt: "Voltage across a resistor from the node down to ground is",
      options: {
        a: "18 V, the battery.",
        b: "6 V, the node voltage.",
        c: "Always zero.",
      },
      answer: "b",
      why: "The top of those resistors is 6 V and the bottom is ground, so each sees 6 V.",
    },
  },
  {
    id: "ohm",
    highlight: "ohm",
    title: "Current into the node",
    body: "Ohm’s law on the 4 Ω from the battery: current toward the node is (18 − 6) / 4 = 3 A. That 3 A is the only current arriving from the source side.",
    eq: "I = (18 V − 6 V) / 4 Ω = 3 A",
  },
  {
    id: "kcl",
    highlight: "kcl",
    title: "KCL at the node",
    body: "No charge piles up. Current in equals current out. 3 A arrives. The 3 Ω resistor takes 6 / 3 = 2 A down. The leftover 1 A must leave through the unknown resistor R: 6 / R = 1 A, so R = 6 Ω.",
    eq: "3 A in = 2 A + 6/R   →   R = 6 Ω",
    check: {
      prompt: "KCL at this node says",
      options: {
        a: "All three resistor currents add to the battery voltage.",
        b: "Current into the node equals current leaving it.",
        c: "The two vertical resistors must be equal.",
      },
      answer: "b",
      why: "Currents into the dot must leave again. Voltage is used only to find each current with Ohm’s law.",
    },
  },
  {
    id: "lab",
    highlight: "r",
    title: "Your turn",
    body: "The lab hides one resistor. Easy questions match this sketch. After those, hard questions add a current source or extra branches — still Ohm and KCL, just more branches.",
    eq: "Drop R so KCL holds",
  },
];
