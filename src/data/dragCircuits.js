export const DRAG_CIRCUIT_QUESTIONS = [
  {
    id: "series-12-2",
    kind: "series",
    volts: 12,
    amps: 2,
    correctOhm: 6,
    choices: [3, 6, 12, 24],
    why: "Series: one current, so R = V / I = 12 / 2 = 6 Ω.",
  },
  {
    id: "series-9-3",
    kind: "series",
    volts: 9,
    amps: 3,
    correctOhm: 3,
    choices: [1, 3, 6, 9],
    why: "Series: R = V / I = 9 / 3 = 3 Ω.",
  },
  {
    id: "series-10-05",
    kind: "series",
    volts: 10,
    amps: 0.5,
    correctOhm: 20,
    choices: [5, 10, 20, 40],
    why: "Series: R = V / I = 10 / 0.5 = 20 Ω.",
  },
  {
    id: "series-5-025",
    kind: "series",
    volts: 5,
    amps: 0.25,
    correctOhm: 20,
    choices: [4, 10, 20, 50],
    why: "Series: R = V / I = 5 / 0.25 = 20 Ω.",
  },
  {
    id: "par-12-3",
    kind: "parallel",
    volts: 12,
    amps: 3,
    knownOhm: 12,
    correctOhm: 6,
    choices: [3, 6, 12, 24],
    why: "Both branches see 12 V. The 12 Ω branch takes 1 A. Source current is 3 A, so the gap takes 2 A. R = 12 / 2 = 6 Ω.",
  },
  {
    id: "par-10-15",
    kind: "parallel",
    volts: 10,
    amps: 1.5,
    knownOhm: 20,
    correctOhm: 10,
    choices: [5, 10, 20, 40],
    why: "Both branches see 10 V. The 20 Ω branch takes 0.5 A. Source current is 1.5 A, so the gap takes 1 A. R = 10 / 1 = 10 Ω.",
  },
];

export const NODAL_LAB_QUESTIONS = [
  {
    id: "nodal-r3",
    kind: "nodal",
    level: "easy",
    slot: "gnd",
    volts: 18,
    nodeVolts: 6,
    knownOhm: 4,
    knownOhm2: 3,
    amps: 3,
    correctOhm: 6,
    choices: [3, 4, 6, 12],
    why: "KCL at the node: (18 − 6) / 4 = 6 / 3 + 6 / R. That is 3 = 2 + 6 / R, so R = 6 Ω.",
  },
  {
    id: "nodal-r1",
    kind: "nodal",
    level: "easy",
    slot: "src",
    volts: 12,
    nodeVolts: 6,
    knownOhm: 6,
    knownOhm2: 12,
    amps: 1.5,
    correctOhm: 4,
    choices: [3, 4, 6, 12],
    why: "KCL: current into the node is 6 / 6 + 6 / 12 = 1.5 A. Then R = (12 − 6) / 1.5 = 4 Ω.",
  },
  {
    id: "nodal-hard-isrc",
    kind: "nodal",
    level: "hard",
    shape: "isrc",
    slot: "gnd",
    nodeVolts: 12,
    amps: 4,
    knownOhm: 6,
    correctOhm: 6,
    choices: [3, 4, 6, 12],
    why: "Hard: 4 A into the node. The 6 Ω takes 12 / 6 = 2 A down. Leftover 2 A through R: 12 / R = 2, so R = 6 Ω.",
  },
  {
    id: "nodal-hard-four",
    kind: "nodal",
    level: "hard",
    shape: "four",
    slot: "gnd",
    volts: 24,
    nodeVolts: 8,
    knownOhm: 4,
    knownOhm2: 8,
    knownOhm3: 4,
    amps: 4,
    correctOhm: 8,
    choices: [2, 4, 8, 16],
    why: "Hard: (24 − 8) / 4 = 4 A in. Down: 8 / 8 = 1 A and 8 / 4 = 2 A. Leftover 1 A through R: 8 / R = 1, so R = 8 Ω.",
  },
  {
    id: "nodal-hard-src",
    kind: "nodal",
    level: "hard",
    slot: "src",
    volts: 24,
    nodeVolts: 6,
    knownOhm: 3,
    knownOhm2: 6,
    amps: 3,
    correctOhm: 6,
    choices: [3, 4, 6, 12],
    why: "Hard: currents down 6 / 3 = 2 A and 6 / 6 = 1 A, so 3 A must arrive through R. R = (24 − 6) / 3 = 6 Ω.",
  },
];

export const THEVENIN_LAB_QUESTIONS = [
  {
    id: "thev-4-12",
    kind: "thev-rth",
    volts: 12,
    vth: 9,
    knownOhm: 4,
    knownOhm2: 12,
    correctOhm: 3,
    choices: [2, 3, 4, 6],
    why: "Short the 12 V source. $R_{th}$ at a–b is 4 || 12 = 3 Ω. Open-circuit voltage is 12 × 12 / (4 + 12) = 9 V.",
  },
  {
    id: "thev-8-8",
    kind: "thev-rth",
    volts: 24,
    vth: 12,
    knownOhm: 8,
    knownOhm2: 8,
    correctOhm: 4,
    choices: [2, 4, 8, 16],
    why: "Short the 24 V source. $R_{th} = 8$ || 8 = 4 Ω. Voc = 24 × 8 / (8 + 8) = 12 V.",
  },
  {
    id: "thev-load-10",
    kind: "thev-load",
    volts: 10,
    knownOhm: 4,
    amps: 1,
    correctOhm: 6,
    choices: [3, 4, 6, 12],
    why: "After Thevenin, $I = V_{th} / (R_{th} + R_L)$. $1 = 10 / (4 + R_L)$, so $R_L = 6\\ \\Omega$.",
  },
];

export const NORTON_LAB_QUESTIONS = [
  {
    id: "nort-4-12",
    kind: "norton-rn",
    volts: 12,
    amps: 3,
    knownOhm: 4,
    knownOhm2: 12,
    correctOhm: 3,
    choices: [2, 3, 4, 6],
    why: "Short a–b: the 12 Ω is bypassed, so $I_n = 12 / 4 = 3\\ \\mathrm{A}$. $R_n = R_{th} = 4$ in parallel with $12 = 3\\ \\Omega$.",
  },
  {
    id: "nort-8-8",
    kind: "norton-rn",
    volts: 24,
    amps: 3,
    knownOhm: 8,
    knownOhm2: 8,
    correctOhm: 4,
    choices: [2, 4, 8, 16],
    why: "Voc = 24 × 8 / (8 + 8) = 12 V. $R_n = 8$ in parallel with 8 = 4 Ω. $I_n = 12 / 4 = 3\\ \\mathrm{A}$. Drop $R_n$.",
  },
  {
    id: "nort-load",
    kind: "norton-load",
    volts: 0,
    amps: 3,
    knownOhm: 3,
    loadAmps: 1,
    correctOhm: 6,
    choices: [2, 3, 6, 12],
    why: "Current divider: $I_L = I_n \\times R_n / (R_n + R_L)$. $1 = 3 \\times 3 / (3 + R_L)$, so $R_L = 6\\ \\Omega$.",
  },
];

export const MESH_LAB_QUESTIONS = [
  {
    id: "mesh-i-12",
    kind: "mesh",
    quiz: "currents",
    volts: 12,
    i1: 2,
    i2: 1,
    knownOhm: 4,
    knownOhm2: 4,
    knownOhm3: 4,
    choices: [
      { i1: 2, i2: 1 },
      { i1: 1, i2: 2 },
      { i1: 3, i2: 1 },
      { i1: 2, i2: 2 },
    ],
    why: "Left: $12 = 4\\mathbf{I}_1 + 4(\\mathbf{I}_1 - \\mathbf{I}_2)$. Right: $0 = 4\\mathbf{I}_2 + 4(\\mathbf{I}_2 - \\mathbf{I}_1)$. So $\\mathbf{I}_1 = 2$ A and $\\mathbf{I}_2 = 1$ A.",
  },
  {
    id: "mesh-i-left2",
    kind: "mesh",
    quiz: "currents",
    volts: 12,
    i1: 3,
    i2: 1.5,
    knownOhm: 2,
    knownOhm2: 4,
    knownOhm3: 4,
    choices: [
      { i1: 3, i2: 1.5 },
      { i1: 2, i2: 1 },
      { i1: 1.5, i2: 3 },
      { i1: 3, i2: 3 },
    ],
    why: "Left: $12 = 2\\mathbf{I}_1 + 4(\\mathbf{I}_1 - \\mathbf{I}_2)$. Right: $0 = 4\\mathbf{I}_2 + 4(\\mathbf{I}_2 - \\mathbf{I}_1)$. So $\\mathbf{I}_1 = 3$ A and $\\mathbf{I}_2 = 1.5$ A.",
  },
  {
    id: "mesh-i-24",
    kind: "mesh",
    quiz: "currents",
    volts: 24,
    i1: 4,
    i2: 2,
    knownOhm: 4,
    knownOhm2: 4,
    knownOhm3: 4,
    choices: [
      { i1: 4, i2: 2 },
      { i1: 2, i2: 1 },
      { i1: 4, i2: 1 },
      { i1: 3, i2: 3 },
    ],
    why: "Same layout as the 12 V, 4 Ω sketch, but the source is 24 V, so both currents double: $\\mathbf{I}_1 = 4$ A and $\\mathbf{I}_2 = 2$ A.",
  },
];

export const SUPERMESH_LAB_QUESTIONS = [
  {
    id: "super-left",
    kind: "supermesh",
    level: "easy",
    slot: "leftTop",
    volts: 12,
    i1: 2,
    i2: 1,
    amps: 1,
    knownOhm2: 4,
    correctOhm: 4,
    choices: [2, 4, 6, 8],
    why: "Supermesh KVL skips the 1 A source: $12 = \\mathbf{I}_1 R + 4\\mathbf{I}_2 = 2R + 4$. So $R = 4\\ \\Omega$. Check: $\\mathbf{I}_1 - \\mathbf{I}_2 = 1$ A.",
  },
  {
    id: "super-right",
    kind: "supermesh",
    level: "easy",
    slot: "right",
    volts: 12,
    i1: 2,
    i2: 1,
    amps: 1,
    knownOhm: 4,
    correctOhm: 4,
    choices: [2, 4, 6, 8],
    why: "Supermesh KVL: $12 = 4\\mathbf{I}_1 + \\mathbf{I}_2 R = 8 + R$. So $R = 4\\ \\Omega$.",
  },
  {
    id: "super-hard",
    kind: "supermesh",
    level: "hard",
    slot: "leftTop",
    volts: 18,
    i1: 3,
    i2: 1,
    amps: 2,
    knownOhm2: 6,
    correctOhm: 4,
    choices: [2, 4, 6, 8],
    why: "Constraint: $\\mathbf{I}_1 - \\mathbf{I}_2 = 2$ A. Supermesh: $18 = 3R + 1 \\times 6$. So $R = 4\\ \\Omega$.",
  },
];

export const SUPERNODE_LAB_QUESTIONS = [
  {
    id: "super-n-rb",
    kind: "supernode",
    level: "easy",
    slot: "rb",
    volts: 12,
    vs: 4,
    nodeVolts: 6,
    nodeVolts2: 2,
    knownOhm: 2,
    knownOhm2: 3,
    correctOhm: 2,
    choices: [2, 3, 4, 6],
    why: "Va − Vb = 4 V. KCL on the blob: (12 − 6) / 2 = 6 / 3 + 2 / R. That is 3 = 2 + 2 / R, so R = 2 Ω.",
  },
  {
    id: "super-n-ra",
    kind: "supernode",
    level: "easy",
    slot: "ra",
    volts: 12,
    vs: 4,
    nodeVolts: 6,
    nodeVolts2: 2,
    knownOhm: 2,
    knownOhm3: 2,
    correctOhm: 3,
    choices: [2, 3, 4, 6],
    why: "KCL: (12 − 6) / 2 = 6 / R + 2 / 2. That is 3 = 6 / R + 1, so R = 3 Ω.",
  },
  {
    id: "super-n-r1",
    kind: "supernode",
    level: "hard",
    slot: "r1",
    volts: 16,
    vs: 4,
    nodeVolts: 8,
    nodeVolts2: 4,
    knownOhm2: 4,
    knownOhm3: 2,
    correctOhm: 2,
    choices: [2, 4, 6, 8],
    why: "Hard: Va − Vb = 4 V. KCL: (16 − 8) / R = 8 / 4 + 4 / 2 = 4 A. So R = 2 Ω.",
  },
];

export const SUPERPOS_LAB_QUESTIONS = [
  {
    id: "superpos-load",
    kind: "superpos",
    level: "easy",
    volts: 12,
    volts2: 12,
    knownOhm: 4,
    knownOhm2: 4,
    vLeft: 4,
    vRight: 4,
    nodeVolts: 8,
    amps: 2,
    correctOhm: 4,
    choices: [2, 4, 6, 8],
    why: "Kill the right source: node is 4 V. Kill the left: node is 4 V. Add: 8 V. R = 8 / 2 = 4 Ω.",
  },
  {
    id: "superpos-18-6",
    kind: "superpos",
    level: "easy",
    volts: 18,
    volts2: 6,
    knownOhm: 6,
    knownOhm2: 6,
    vLeft: 6,
    vRight: 2,
    nodeVolts: 8,
    amps: 2,
    correctOhm: 4,
    choices: [2, 4, 6, 8],
    why: "Left source only: 6 V at the node. Right source only: 2 V. Add: 8 V. R = 8 / 2 = 4 Ω.",
  },
  {
    id: "superpos-hard",
    kind: "superpos",
    level: "hard",
    volts: 24,
    volts2: 12,
    knownOhm: 6,
    knownOhm2: 6,
    vLeft: 8,
    vRight: 4,
    nodeVolts: 12,
    amps: 2,
    correctOhm: 6,
    choices: [2, 4, 6, 8],
    why: "Hard: left contribution 8 V, right 4 V, total 12 V. R = 12 / 2 = 6 Ω.",
  },
];

export const DIVIDER_LAB_QUESTIONS = [
  {
    id: "vdiv-8",
    kind: "vdiv",
    level: "easy",
    volts: 12,
    knownOhm: 4,
    nodeVolts: 8,
    correctOhm: 8,
    choices: [2, 4, 6, 8],
    why: "Voltage divider: Vo = Vs × R2 / (R1 + R2). 8 = 12 × R / (4 + R), so R = 8 Ω.",
  },
  {
    id: "vdiv-6",
    kind: "vdiv",
    level: "easy",
    volts: 18,
    knownOhm: 6,
    nodeVolts: 6,
    correctOhm: 3,
    choices: [2, 3, 6, 9],
    why: "6 = 18 × R / (6 + R). Then 36 + 6R = 18R, so R = 3 Ω.",
  },
  {
    id: "idiv-1",
    kind: "idiv",
    level: "easy",
    volts: 12,
    knownOhm: 4,
    amps: 4,
    branchAmps: 1,
    correctOhm: 12,
    choices: [4, 6, 8, 12],
    why: "Current divider: I2 = Is × R1 / (R1 + R2). 1 = 4 × 4 / (4 + R), so R = 12 Ω.",
  },
  {
    id: "idiv-2",
    kind: "idiv",
    level: "easy",
    volts: 24,
    knownOhm: 6,
    amps: 6,
    branchAmps: 2,
    correctOhm: 12,
    choices: [4, 6, 8, 12],
    why: "2 = 6 × 6 / (6 + R). Then 12 + 2R = 36, so R = 12 Ω.",
  },
  {
    id: "vdiv-hard",
    kind: "vdiv",
    level: "hard",
    volts: 24,
    knownOhm: 6,
    nodeVolts: 16,
    correctOhm: 12,
    choices: [4, 6, 8, 12],
    why: "16 = 24 × R / (6 + R). Then 96 + 16R = 24R, so R = 12 Ω.",
  },
  {
    id: "idiv-hard",
    kind: "idiv",
    level: "hard",
    volts: 18,
    knownOhm: 3,
    amps: 9,
    branchAmps: 3,
    correctOhm: 6,
    choices: [2, 3, 6, 9],
    why: "3 = 9 × 3 / (3 + R). Then 9 + 3R = 27, so R = 6 Ω.",
  },
];

export const POWER_LAB_QUESTIONS = [
  {
    id: "p-vi",
    kind: "power",
    quiz: "mcq",
    shape: "dc",
    volts: 12,
    amps: 2,
    ohms: 6,
    answer: "$24\\ \\mathrm{W}$",
    choices: [
      "$12\\ \\mathrm{W}$",
      "$18\\ \\mathrm{W}$",
      "$24\\ \\mathrm{W}$",
      "$72\\ \\mathrm{W}$",
    ],
    why: "$P = VI = 12 \\times 2 = 24\\ \\mathrm{W}$.",
  },
  {
    id: "p-i2r",
    kind: "power",
    quiz: "mcq",
    shape: "i2r",
    volts: 12,
    amps: 3,
    ohms: 4,
    answer: "$36\\ \\mathrm{W}$",
    choices: [
      "$12\\ \\mathrm{W}$",
      "$16\\ \\mathrm{W}$",
      "$36\\ \\mathrm{W}$",
      "$48\\ \\mathrm{W}$",
    ],
    why: "$P = I^2 R = 3^2 \\times 4 = 36\\ \\mathrm{W}$.",
  },
  {
    id: "p-v2r",
    kind: "power",
    quiz: "mcq",
    shape: "v2r",
    volts: 12,
    amps: 3,
    ohms: 4,
    answer: "$36\\ \\mathrm{W}$",
    choices: [
      "$3\\ \\mathrm{W}$",
      "$16\\ \\mathrm{W}$",
      "$36\\ \\mathrm{W}$",
      "$48\\ \\mathrm{W}$",
    ],
    why: "$P = \\dfrac{V^2}{R} = \\dfrac{12^2}{4} = 36\\ \\mathrm{W}$.",
  },
  {
    id: "p-vi-24",
    kind: "power",
    quiz: "mcq",
    shape: "dc",
    volts: 24,
    amps: 0.5,
    ohms: 48,
    answer: "$12\\ \\mathrm{W}$",
    choices: [
      "$12\\ \\mathrm{W}$",
      "$24\\ \\mathrm{W}$",
      "$48\\ \\mathrm{W}$",
      "$72\\ \\mathrm{W}$",
    ],
    why: "$P = VI = 24 \\times 0.5 = 12\\ \\mathrm{W}$. Check: $I^2 R = 0.25 \\times 48 = 12\\ \\mathrm{W}$.",
  },
];

export const MAX_POWER_LAB_QUESTIONS = [
  {
    id: "mpt-rl",
    kind: "mpt",
    quiz: "mcq",
    shape: "match",
    volts: 12,
    rs: 6,
    answer: "$6\\ \\Omega$",
    choices: [
      "$0\\ \\Omega$",
      "$3\\ \\Omega$",
      "$6\\ \\Omega$",
      "$12\\ \\Omega$",
    ],
    why: "Match $R_L$ to $R_s$. $R_s = 6\\ \\Omega$, so $R_L = 6\\ \\Omega$.",
  },
  {
    id: "mpt-rule",
    kind: "mpt",
    quiz: "mcq",
    shape: "loop",
    volts: 12,
    rs: 4,
    answer: "Set $R_L = R_s$.",
    choices: [
      "Set $R_L = 0$ so $I$ is huge.",
      "Set $R_L = R_s$.",
      "Set $R_L$ much larger than $R_s$.",
      "Power in $R_L$ does not depend on $R_L$.",
    ],
    why: "Maximum load power is at $R_L = R_s$. After Thevenin, that is $R_L = R_{th}$.",
  },
  {
    id: "mpt-pmax",
    kind: "mpt",
    quiz: "mcq",
    shape: "pmax",
    volts: 12,
    rs: 4,
    rl: 4,
    answer: "$9\\ \\mathrm{W}$",
    choices: [
      "$3\\ \\mathrm{W}$",
      "$9\\ \\mathrm{W}$",
      "$18\\ \\mathrm{W}$",
      "$36\\ \\mathrm{W}$",
    ],
    why: "$P_{\\max} = V^2 / (4 R_s) = 144 / 16 = 9\\ \\mathrm{W}$.",
  },
  {
    id: "mpt-24",
    kind: "mpt",
    quiz: "mcq",
    shape: "pmax",
    volts: 24,
    rs: 8,
    rl: 8,
    answer: "$18\\ \\mathrm{W}$",
    choices: [
      "$9\\ \\mathrm{W}$",
      "$18\\ \\mathrm{W}$",
      "$36\\ \\mathrm{W}$",
      "$72\\ \\mathrm{W}$",
    ],
    why: "$P_{\\max} = 24^2 / (4 \\times 8) = 576 / 32 = 18\\ \\mathrm{W}$.",
  },
];

export const DEPENDENT_LAB_QUESTIONS = [
  {
    id: "dep-diamond",
    kind: "dep",
    quiz: "mcq",
    shape: "types",
    answer: "A source whose value is a gain times $v_x$ or $i_x$.",
    choices: [
      "A battery with a fixed voltage.",
      "A source whose value is a gain times $v_x$ or $i_x$.",
      "A resistor that changes with temperature.",
      "Always the same as an independent current source.",
    ],
    why: "A diamond is dependent: $V = \\mu v_x$, $I = g v_x$, and so on. A battery is independent.",
  },
  {
    id: "dep-kill",
    kind: "dep",
    quiz: "mcq",
    shape: "keep",
    answer: "Leave it in. Kill independent sources only.",
    choices: [
      "Replace it with a wire.",
      "Leave it in. Kill independent sources only.",
      "Set its gain to zero.",
      "Replace it with an open circuit.",
    ],
    why: "Dependent sources stay when you find $R_{th}$ or $R_n$. Only independent V and I sources turn off.",
  },
  {
    id: "dep-i",
    kind: "dep",
    quiz: "mcq",
    shape: "solve",
    showI: false,
    answer: "$2\\ \\mathrm{A}$",
    choices: [
      "$1\\ \\mathrm{A}$",
      "$2\\ \\mathrm{A}$",
      "$4\\ \\mathrm{A}$",
      "$6\\ \\mathrm{A}$",
    ],
    why: "KVL: $12 = 2I + 2 v_x$ and $v_x = 2I$, so $12 = 6I$ and $I = 2\\ \\mathrm{A}$.",
  },
  {
    id: "dep-vccs",
    kind: "dep",
    quiz: "mcq",
    level: "hard",
    shape: "vccs",
    answer: "A current source controlled by a voltage.",
    choices: [
      "A voltage source controlled by a current.",
      "A current source controlled by a voltage.",
      "An independent 0.5 A source.",
      "A resistor of 0.5 Ω.",
    ],
    why: "VCCS: voltage-controlled current source. The diamond has an arrow; its current is $g v_x$.",
  },
];

export function labKindLabel(kind) {
  if (kind === "thev-rth" || kind === "thev-load") return "Thevenin";
  if (kind === "norton-rn" || kind === "norton-load") return "Norton";
  if (kind === "parallel") return "parallel";
  if (kind === "nodal") return "nodal";
  if (kind === "mesh") return "mesh";
  if (kind === "supermesh") return "supermesh";
  if (kind === "supernode") return "supernode";
  if (kind === "superpos") return "superposition";
  if (kind === "vdiv") return "voltage divider";
  if (kind === "idiv") return "current divider";
  if (kind === "power") return "power";
  if (kind === "mpt") return "max power";
  if (kind === "dep") return "dependent sources";
  return "series";
}

export function labPrompt(q, hard) {
  const hardBit = hard
    ? " Hard mode: read the colour bands (no ohm labels)."
    : " Easy mode: ohm value and colour bands.";
  if (q.kind === "parallel") {
    return `Parallel: two resistors, both see the battery voltage. Source current is ${q.amps} A. One branch is ${q.knownOhm} Ω. Drop the other.${hardBit}`;
  }
  if (q.kind === "nodal") {
    if (q.shape === "isrc") {
      return `A current source Is feeds the node (${q.amps} A). The node is ${q.nodeVolts} V. Use KCL. Drop R.${hardBit}`;
    }
    if (q.shape === "four") {
      return `Four resistors meet at the ${q.nodeVolts} V node. Ohm on every branch, then KCL. Drop the missing resistor.${hardBit}`;
    }
    return `Nodal: the marked node is ${q.nodeVolts} V. Is is marked on the source branch. Use Ohm and KCL. Drop the missing resistor.${hardBit}`;
  }
  if (q.kind === "thev-rth") {
    return `Thevenin: the load is off at a–b. Kill the source and drop $R_{th}$. Voc is marked on the equivalent.${hardBit}`;
  }
  if (q.kind === "thev-load") {
    return `Thevenin equivalent: $V_{th} = ${q.volts}\\ \\mathrm{V}$ and $R_{th} = ${q.knownOhm}\\ \\Omega$. Drop $R_L$ so the load current is ${q.amps} A.${hardBit}`;
  }
  if (q.kind === "norton-rn") {
    return `Norton: the load is off at a–b. $I_n$ is marked. Kill the source and drop $R_n$.${hardBit}`;
  }
  if (q.kind === "norton-load") {
    return `Norton equivalent: $I_n = ${q.amps}\\ \\mathrm{A}$ and $R_n = ${q.knownOhm}\\ \\Omega$. Drop $R_L$ so the load current is ${q.loadAmps} A.${hardBit}`;
  }
  if (q.kind === "mesh") {
    if (q.quiz === "currents") {
      return "All resistors are marked. Both meshes are clockwise. Pick $\\mathbf{I}_1$ and $\\mathbf{I}_2$.";
    }
    const tag = q.level === "hard" ? "Hard question. " : "";
    const where =
      q.slot === "shared"
        ? "the shared middle resistor"
        : q.slot === "right"
          ? "the right-top resistor"
          : "the left-top resistor";
    return `${tag}Two meshes, both clockwise. $\\mathbf{I}_1 = ${q.i1}\\ \\mathrm{A}$ and $\\mathbf{I}_2 = ${q.i2}\\ \\mathrm{A}$. Write KVL and drop ${where}.${hardBit}`;
  }
  if (q.kind === "supermesh") {
    const tag = q.level === "hard" ? "Hard question. " : "";
    const where =
      q.slot === "right" ? "the right-top resistor" : "the left-top resistor";
    return `${tag}Supermesh: the shared branch is a ${q.amps} A current source. $\\mathbf{I}_1 = ${q.i1}\\ \\mathrm{A}$, $\\mathbf{I}_2 = ${q.i2}\\ \\mathrm{A}$. Skip the source, write outer KVL, drop ${where}.${hardBit}`;
  }
  if (q.kind === "supernode") {
    const tag = q.level === "hard" ? "Hard question. " : "";
    const where =
      q.slot === "r1"
        ? "the resistor from the battery to A"
        : q.slot === "ra"
          ? "the resistor from A to ground"
          : "the resistor from B to ground";
    return `${tag}Supernode: A and B are joined by a ${q.vs} V source. Va = ${q.nodeVolts} V, Vb = ${q.nodeVolts2} V. Write blob KCL, drop ${where}.${hardBit}`;
  }
  if (q.kind === "superpos") {
    const tag = q.level === "hard" ? "Hard question. " : "";
    return `${tag}Superposition: left source alone gives ${q.vLeft} V at the node. Right source alone gives ${q.vRight} V. Add them. Drop R so the current down is ${q.amps} A.${hardBit}`;
  }
  if (q.kind === "vdiv") {
    return `Voltage divider: Vs = ${q.volts} V, R1 = ${q.knownOhm} Ω, Vo across R2 is ${q.nodeVolts} V. Drop R2.${hardBit}`;
  }
  if (q.kind === "idiv") {
    return `Current divider: source current is ${q.amps} A. The known branch is ${q.knownOhm} Ω. Drop R so its branch takes ${q.branchAmps} A.${hardBit}`;
  }
  if (q.kind === "power") {
    if (q.shape === "i2r") {
      return `Power: current is ${q.amps} A through ${q.ohms} Ω. Pick $P = I^2 R$.`;
    }
    if (q.shape === "v2r") {
      return `Power: ${q.volts} V across ${q.ohms} Ω. Pick $P = V^2 / R$.`;
    }
    return `Power: ${q.volts} V and ${q.amps} A on the resistor. Pick $P = VI$.`;
  }
  if (q.kind === "mpt") {
    if (q.shape === "pmax") {
      return `Max power: $V = ${q.volts}\\ \\mathrm{V}$ and $R_s = ${q.rs}\\ \\Omega$. $R_L$ is matched. Pick $P_{\\max} = V^2 / (4 R_s)$.`;
    }
    if (q.shape === "match") {
      return `Max power: $V = ${q.volts}\\ \\mathrm{V}$ and $R_s = ${q.rs}\\ \\Omega$. Pick $R_L$ for maximum power in the load.`;
    }
    return "Max power: what do you set $R_L$ to for the largest $P_L$?";
  }
  if (q.kind === "dep") {
    if (q.shape === "keep") {
      return "Finding $R_{th}$: the 12 V is off. What do you do with the diamond?";
    }
    if (q.shape === "solve") {
      return "VCVS: the diamond is $2 v_x$, and $v_x$ is across the 2 Ω. Pick the loop current $I$.";
    }
    if (q.shape === "vccs") {
      return "The diamond has an arrow and is labelled $0.5 v_x$. What kind of source is it?";
    }
    return "A diamond in a schematic is which of these?";
  }
  return `Series: one loop. V = IR. Current is ${q.amps} A and the battery is ${q.volts} V. Drop the resistor.${hardBit}`;
}
