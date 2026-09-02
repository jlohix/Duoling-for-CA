export const SUPERMESH_STEPS = [
  {
    id: "meet",
    highlight: "isrc",
    title: "When a current source sits between meshes",
    body: "This circuit still has two windows, but the shared branch is a 1 A current source, not a resistor. You cannot write KVL around a window that contains a current source: you do not know the voltage across it.",
    eq: "No KVL through a current source",
  },
  {
    id: "why",
    highlight: "isrc",
    title: "What a supermesh is",
    body: "A supermesh is the big loop you get by treating the two windows as one and skipping the current source. You still keep both mesh currents $\\mathbf{I}_1$ and $\\mathbf{I}_2$. The source only gives a current constraint, not a voltage drop.",
    eq: "Skip the source, keep both currents",
    check: {
      prompt: "You make a supermesh when",
      options: {
        a: "Two meshes share a resistor.",
        b: "A current source sits on a branch that two meshes share.",
        c: "The circuit has only one loop.",
      },
      answer: "b",
      why: "A shared resistor is ordinary mesh. A shared current source needs a supermesh.",
    },
  },
  {
    id: "i1",
    highlight: "i1",
    title: "Still assign $\\mathbf{I}_1$ and $\\mathbf{I}_2$",
    body: "$\\mathbf{I}_1$ is clockwise in the left window. $\\mathbf{I}_2$ is clockwise in the right window. In this worked example $\\mathbf{I}_1 = 2$ A and $\\mathbf{I}_2 = 1$ A. Both still pass through the current source, in opposite directions on that branch.",
    eq: "$\\mathbf{I}_1 = 2\\ \\mathrm{A}$, $\\mathbf{I}_2 = 1\\ \\mathrm{A}$",
  },
  {
    id: "constraint",
    highlight: "isrc",
    title: "The current-source constraint",
    body: "The source forces 1 A down the shared branch. With both meshes clockwise, that net current is $\\mathbf{I}_1 - \\mathbf{I}_2$. So $\\mathbf{I}_1 - \\mathbf{I}_2 = 1$ A. Check: $2 - 1 = 1$. That is one of your two equations.",
    eq: "$\\mathbf{I}_1 - \\mathbf{I}_2 = I_s$",
    check: {
      prompt: "If $\\mathbf{I}_1$ and $\\mathbf{I}_2$ are both clockwise and $I_s$ points down the shared branch,",
      options: {
        a: "$\\mathbf{I}_1 + \\mathbf{I}_2 = I_s$",
        b: "$\\mathbf{I}_1 - \\mathbf{I}_2 = I_s$",
        c: "$\\mathbf{I}_1 = \\mathbf{I}_2 = I_s$",
      },
      answer: "b",
      why: "$\\mathbf{I}_1$ goes down the source; $\\mathbf{I}_2$ goes up. The source current is $\\mathbf{I}_1$ minus $\\mathbf{I}_2$.",
    },
  },
  {
    id: "kvl",
    highlight: "supermesh",
    title: "KVL around the supermesh",
    body: "Walk the outer path: the 12 V battery, the left-top 4 Ω (sees $\\mathbf{I}_1$), the right-top 4 Ω (sees $\\mathbf{I}_2$), then back along the bottom. Skip the middle source. That is $12 = 4\\mathbf{I}_1 + 4\\mathbf{I}_2$. Plug in: $12 = 8 + 4$.",
    eq: "$12 = 4\\mathbf{I}_1 + 4\\mathbf{I}_2$",
  },
  {
    id: "lab",
    highlight: "r",
    title: "Your turn",
    body: "The lab hides one of the two top resistors. $\\mathbf{I}_1$, $\\mathbf{I}_2$, and the shared current source stay on the sketch. Write the supermesh KVL (battery = $\\mathbf{I}_1$ Rleft + $\\mathbf{I}_2$ Rright) and drop R.",
    eq: "Drop R so the outer loop sums to the battery",
  },
];
