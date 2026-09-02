export const SUPERNODE_STEPS = [
  {
    id: "meet",
    highlight: "vs",
    title: "When a voltage source sits between nodes",
    body: "This sketch has two nodes above ground, A and B, tied together by a 4 V source. You cannot write KCL at A or B alone: you do not know the current through that source.",
    eq: "No KCL through a voltage source",
  },
  {
    id: "why",
    highlight: "sn",
    title: "What a supernode is",
    body: "A supernode is a blob around both nodes and the voltage source between them. You write one KCL for the whole blob, counting only currents in the resistors that leave the blob. The source itself is inside, so its current is ignored.",
    eq: "One KCL for both nodes together",
    check: {
      prompt: "You make a supernode when",
      options: {
        a: "Two nodes share a resistor to ground.",
        b: "A voltage source sits between two nodes that are not ground.",
        c: "The circuit has only one node.",
      },
      answer: "b",
      why: "A resistor between nodes is ordinary nodal. A floating voltage source needs a supernode.",
    },
  },
  {
    id: "nodes",
    highlight: "nodes",
    title: "Still label both node voltages",
    body: "Node A is 6 V. Node B is 2 V. Ground is 0 V. The left-top 2 Ω sits between the 12 V battery and A. The two vertical resistors sit from each node down to ground.",
    eq: "Va = 6 V, Vb = 2 V",
  },
  {
    id: "constraint",
    highlight: "vs",
    title: "The voltage-source constraint",
    body: "The source forces a 4 V difference, plus on the A side. So Va − Vb = 4 V. Check: 6 − 2 = 4. That is one of your two equations. It does not tell you the current in the source.",
    eq: "Va − Vb = Vs",
    check: {
      prompt: "If the floating source is 4 V with plus toward A,",
      options: {
        a: "Va + Vb = 4 V",
        b: "Va − Vb = 4 V",
        c: "Va = Vb = 4 V",
      },
      answer: "b",
      why: "Walk from B to A through the source: you rise 4 V, so A is 4 V above B.",
    },
  },
  {
    id: "kcl",
    highlight: "kcl",
    title: "KCL for the supernode",
    body: "Current into the blob through the 2 Ω: (12 − 6) / 2 = 3 A. Current out through the 3 Ω under A: 6 / 3 = 2 A. Current out through the 2 Ω under B: 2 / 2 = 1 A. 3 A in equals 2 A + 1 A out. The source current never appears.",
    eq: "3 A in = 6/3 + 2/Rb",
  },
  {
    id: "lab",
    highlight: "r",
    title: "Your turn",
    body: "The lab hides one resistor. Va, Vb, and the floating source stay on the sketch. Use Va − Vb = Vs and KCL on the blob, then drop R.",
    eq: "Drop R so supernode KCL holds",
  },
];
