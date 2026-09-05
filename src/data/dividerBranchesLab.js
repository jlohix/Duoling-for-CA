export const DIVIDER_BRANCH_STEPS = [
  {
    id: "vload",
    view: "teach-vload",
    highlight: "vo",
    title: "Voltage divider with a parallel load",
    body: "The tap is no longer one resistor. Two (or three) resistors sit in parallel at the bottom. Collapse that pair first: $R_{eq}=R_2\\parallel R_3$. Then the usual divider gives the tap: $V_o=V_s\\times R_{eq}/(R_1+R_{eq})$.",
    eq: "$V_o = V_s \\times \\dfrac{R_{eq}}{R_1 + R_{eq}}$",
    boardHint: "R2 and R3 share the same voltage Vo.",
    check: {
      prompt: "Vs is 12 V, R1 is 4 Ω, and the load is 8 Ω ∥ 8 Ω. Vo is",
      options: {
        a: "8 V, as if the load were one 8 Ω.",
        b: "6 V, because 8 ∥ 8 is 4 Ω, then 12 × 4 / 8.",
        c: "4 V, half of the source no matter the resistors.",
      },
      answer: "b",
      why: "8 ∥ 8 = 4 Ω. Divider: 12 × 4 / (4 + 4) = 6 V. Do not ignore the extra parallel path.",
    },
  },
  {
    id: "idiv3",
    view: "teach-idiv3",
    highlight: "r3",
    title: "Current divider with three branches",
    body: "Current splits among every parallel path. The branch with the smallest R takes the largest share. For any branch $k$, $I_k = I_s \\times (1/R_k)\\,/\\,\\sum(1/R_i)$. Two-branch $I_2=I_s\\times R_1/(R_1+R_2)$ is the same idea with only two conductances.",
    eq: "$I_k = I_s \\times \\dfrac{1/R_k}{\\sum 1/R_i}$",
    boardHint: "Is = 12 A. The 2 Ω, 3 Ω, and 6 Ω take 6 A, 4 A, and 2 A.",
    check: {
      prompt: "Is is 12 A through 2 Ω, 3 Ω, and 6 Ω in parallel. Current in the 6 Ω is",
      options: {
        a: "6 A, the same as the 2 Ω.",
        b: "4 A, because 6 is twice 3.",
        c: "2 A, because 1/6 is one sixth of the total conductance.",
      },
      answer: "c",
      why: "1/2 + 1/3 + 1/6 = 1 S. The 6 Ω share is 12 × (1/6) / 1 = 2 A.",
    },
  },
  {
    id: "lab",
    view: "teach-vload",
    highlight: "all",
    title: "Your turn",
    body: "Five quiz boards come first: read Vo or a branch current from the sketch. Then five drag boards: drop the missing voltage, current, or resistor.",
    eq: "Reduce parallels, then divide",
  },
];

export const DIVIDER_BRANCH_PRACTICE = [
  {
    id: "p-vo-88",
    view: "q-vload2",
    highlight: "vo",
    boardHint: "Collapse 8 Ω ∥ 8 Ω, then divide with the 4 Ω.",
    prompt: "What is $V_o$ across the parallel pair?",
    options: {
      a: "$8\\ \\mathrm{V}$",
      b: "$6\\ \\mathrm{V}$",
      c: "$4\\ \\mathrm{V}$",
      d: "$12\\ \\mathrm{V}$",
    },
    answer: "b",
    why: "8 ∥ 8 = 4 Ω. $V_o=12\\times 4/(4+4)=6\\ \\mathrm{V}$. 8 V treats the load as one 8 Ω.",
  },
  {
    id: "p-i-6ohm",
    view: "q-idiv3",
    highlight: "r3",
    boardHint: "Smaller R takes more current. The 6 Ω is the largest.",
    prompt: "Current through the $6\\ \\Omega$ branch is",
    options: {
      a: "$6\\ \\mathrm{A}$",
      b: "$4\\ \\mathrm{A}$",
      c: "$2\\ \\mathrm{A}$",
      d: "$12\\ \\mathrm{A}$",
    },
    answer: "c",
    why: "$1/2+1/3+1/6=1$. $I_3=12\\times(1/6)=2\\ \\mathrm{A}$. 6 A is the 2 Ω branch.",
  },
  {
    id: "p-most",
    view: "q-idiv3most",
    highlight: "all",
    boardHint: "Three paths share 12 A. Current likes the smallest R.",
    prompt: "Which branch takes the most current?",
    options: {
      a: "The $2\\ \\Omega$.",
      b: "The left $4\\ \\Omega$.",
      c: "The right $4\\ \\Omega$.",
      d: "All three take 4 A.",
    },
    answer: "a",
    why: "$1/2+1/4+1/4=1$. The 2 Ω takes $12\\times(1/2)=6\\ \\mathrm{A}$. Each 4 Ω takes 3 A.",
  },
  {
    id: "p-vo-666",
    view: "q-vload3",
    highlight: "vo",
    boardHint: "Three equal 6 Ω loads. Req is 2 Ω.",
    prompt: "What is $V_o$ across the three parallel 6 Ω resistors?",
    options: {
      a: "$6\\ \\mathrm{V}$",
      b: "$4\\ \\mathrm{V}$",
      c: "$3\\ \\mathrm{V}$",
      d: "$2\\ \\mathrm{V}$",
    },
    answer: "c",
    why: "6 ∥ 6 ∥ 6 = 2 Ω. $V_o=12\\times 2/(6+2)=3\\ \\mathrm{V}$. 6 V forgets the extra loads.",
  },
  {
    id: "p-i-2par",
    view: "q-idiv2",
    highlight: "r2",
    boardHint: "Two branches. I2 = Is × R1 / (R1 + R2).",
    prompt: "Current through the $4\\ \\Omega$ is",
    options: {
      a: "$4\\ \\mathrm{A}$",
      b: "$3\\ \\mathrm{A}$",
      c: "$2\\ \\mathrm{A}$",
      d: "$1\\ \\mathrm{A}$",
    },
    answer: "c",
    why: "$I_2=6\\times 2/(2+4)=2\\ \\mathrm{A}$. The 2 Ω takes the leftover 4 A.",
  },
];

export const DIVIDER_BRANCH_DRAG = [
  {
    id: "d-vo-88",
    kind: "vdiv",
    vs: 12,
    series: 4,
    branches: [{ ohm: 8 }, { ohm: 8 }],
    drop: "vo",
    correct: 6,
    choices: [3, 4, 6, 8],
    unit: "V",
    why: "8 ∥ 8 = 4 Ω. $V_o=12\\times 4/8=6\\ \\mathrm{V}$.",
  },
  {
    id: "d-i-3ohm",
    kind: "idiv",
    is: 12,
    branches: [{ ohm: 2 }, { ohm: 3 }, { ohm: 6 }],
    drop: "amp",
    dropIndex: 1,
    correct: 4,
    choices: [2, 4, 6, 8],
    unit: "A",
    why: "$1/2+1/3+1/6=1$. The 3 Ω takes $12\\times(1/3)=4\\ \\mathrm{A}$.",
  },
  {
    id: "d-vo-126",
    kind: "vdiv",
    vs: 24,
    series: 8,
    branches: [{ ohm: 12 }, { ohm: 6 }],
    drop: "vo",
    correct: 8,
    choices: [4, 6, 8, 12],
    unit: "V",
    why: "12 ∥ 6 = 4 Ω. $V_o=24\\times 4/(8+4)=8\\ \\mathrm{V}$.",
  },
  {
    id: "d-i-2par",
    kind: "idiv",
    is: 9,
    branches: [{ ohm: 3 }, { ohm: 6 }],
    drop: "amp",
    dropIndex: 1,
    correct: 3,
    choices: [2, 3, 6, 9],
    unit: "A",
    why: "$I_2=9\\times 3/(3+6)=3\\ \\mathrm{A}$ through the 6 Ω.",
  },
  {
    id: "d-r-load",
    kind: "vdiv",
    vs: 18,
    series: 6,
    branches: [{ ohm: 12 }, { ohm: null }],
    vo: 6,
    drop: "ohm",
    dropIndex: 1,
    correct: 4,
    choices: [2, 3, 4, 12],
    unit: "Ω",
    why: "Need $R_{eq}=6\\times 6/(18-6)=3\\ \\Omega$. Then 12 ∥ R = 3, so R = 4 Ω.",
  },
];

export function dividerBranchDragPrompt(question) {
  if (question.drop === "vo") {
    return `Voltage divider: $V_s=${question.vs}\\ \\mathrm{V}$. Drop $V_o$ across the parallel load.`;
  }
  if (question.drop === "amp") {
    const branch = question.branches[question.dropIndex];
    return `Current divider: $I_s=${question.is}\\ \\mathrm{A}$. Drop the current through the ${branch.ohm} Ω branch.`;
  }
  return `Voltage divider: $V_s=${question.vs}\\ \\mathrm{V}$ and $V_o=${question.vo}\\ \\mathrm{V}$. Drop the missing load resistor.`;
}

export function dividerBranchDragLabel(question, value) {
  const unit = question.unit || "Ω";
  return `${value} ${unit}`;
}
