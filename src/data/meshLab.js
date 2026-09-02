export const MESH_STEPS = [
  {
    id: "meet",
    highlight: "all",
    title: "What mesh analysis is for",
    body: "A mesh is a window in the circuit: a loop with no loop inside it. You give each window its own current, then write KVL around that window. This drawing has two meshes sharing the middle resistor.",
    eq: "One current per window, then KVL",
  },
  {
    id: "i1",
    highlight: "i1",
    title: "Left mesh current $\\mathbf{I}_1$",
    body: "Assign $\\mathbf{I}_1$ clockwise around the left window. It leaves the 12 V battery, goes through the left-top 4 Ω, and comes down the shared 4 Ω. We will treat $\\mathbf{I}_1$ as 2 A in this worked example.",
    eq: "$\\mathbf{I}_1 = 2\\ \\mathrm{A}$, clockwise",
  },
  {
    id: "i2",
    highlight: "i2",
    title: "Right mesh current $\\mathbf{I}_2$",
    body: "Assign $\\mathbf{I}_2$ clockwise around the right window. It goes through the right-top 4 Ω and up the shared 4 Ω (opposite $\\mathbf{I}_1$). Here $\\mathbf{I}_2$ is 1 A.",
    eq: "$\\mathbf{I}_2 = 1\\ \\mathrm{A}$, clockwise",
  },
  {
    id: "shared",
    highlight: "shared",
    title: "Current in the shared branch",
    body: "The middle resistor sees both mesh currents. With both clockwise, the net current down the shared 4 Ω is $\\mathbf{I}_1 - \\mathbf{I}_2 = 2 - 1 = 1$ A. Ohm’s law on that branch is $(\\mathbf{I}_1 - \\mathbf{I}_2)$ times Rshared.",
    eq: "Shared current = $\\mathbf{I}_1 - \\mathbf{I}_2$",
    check: {
      prompt: "If $\\mathbf{I}_1$ and $\\mathbf{I}_2$ are both clockwise, net current down the shared resistor is",
      options: {
        a: "$\\mathbf{I}_1 + \\mathbf{I}_2$",
        b: "$\\mathbf{I}_1 - \\mathbf{I}_2$",
        c: "Always $\\mathbf{I}_2$ only.",
      },
      answer: "b",
      why: "$\\mathbf{I}_1$ goes down the shared branch; $\\mathbf{I}_2$ goes up. Subtract them.",
    },
  },
  {
    id: "kvl",
    highlight: "kvl",
    title: "KVL around each window",
    body: "Left window, start at the battery: $12 = 4\\mathbf{I}_1 + 4(\\mathbf{I}_1 - \\mathbf{I}_2)$. Plug in $\\mathbf{I}_1 = 2$ A and $\\mathbf{I}_2 = 1$ A: $12 = 8 + 4$. Right window, no extra source: $0 = 4\\mathbf{I}_2 + 4(\\mathbf{I}_2 - \\mathbf{I}_1) = 4 - 4$. Both loops close.",
    eq: "Sum of voltage drops around a mesh = 0",
    check: {
      prompt: "Mesh analysis writes an equation",
      options: {
        a: "At one node, using KCL.",
        b: "Around one window, using KVL.",
        c: "Only for series circuits.",
      },
      answer: "b",
      why: "Each mesh gets a KVL loop. Nodal analysis is the KCL version.",
    },
  },
  {
    id: "lab",
    highlight: "all",
    title: "Your turn",
    body: "The lab leaves every resistor on the sketch. Write KVL on each window and pick $\\mathbf{I}_1$ and $\\mathbf{I}_2$.",
    eq: "Find $\\mathbf{I}_1$ and $\\mathbf{I}_2$",
  },
];
