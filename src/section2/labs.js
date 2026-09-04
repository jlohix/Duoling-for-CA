export const SUPERPOSITION = {
  steps: [
    {
      id: "lin",
      view: "linear",
      highlight: "all",
      title: "Scaling and additivity",
      body: "A resistor is linear: scale the current by $k$ and the voltage scales by $k$. Add two currents and the voltages add.",
      eq: [
        "$$kv=kRi$$",
        "$$v=R(i_1+i_2)=v_1+v_2$$",
      ],
    },
    {
      id: "what",
      view: "linear",
      highlight: "sum",
      title: "What “linear circuit” means",
      points: [
        "Both additivity and scaling hold.",
        "The output is proportional to the input.",
        "Parts are linear elements, linear dependent sources, and independent sources.",
        "A linear dependent source is proportional to the first power of some $v$ or $i$ in the circuit.",
      ],
    },
    {
      id: "prin",
      view: "super",
      highlight: "sum",
      title: "Superposition",
      body: "In a linear circuit, the voltage across (or current through) an element is the algebraic sum of the pieces from each independent source acting alone.",
      eq: "$$I=I_1+I_2$$",
      check: {
        prompt: "To leave one independent source “on” you",
        options: {
          a: "Replace other voltage sources by shorts (0 V) and other current sources by opens (0 A).",
          b: "Delete every resistor.",
          c: "Set dependent sources to zero as well.",
        },
        answer: "a",
        why: "Independent sources turn off: voltage → short, current → open. Dependent sources stay, because they are not independent.",
      },
    },
    {
      id: "how",
      view: "super",
      highlight: "all",
      title: "The three steps",
      points: [
        "Turn off all independent sources except one. Find the output due to that source.",
        "Repeat for every other independent source.",
        "Add the contributions algebraically.",
      ],
    },
  ],
  practice: [
    {
      id: "p1",
      prompt: "Superposition applies when the circuit is",
      options: {
        a: "Linear (additivity + scaling).",
        b: "Any circuit with a transistor.",
        c: "Only DC.",
      },
      answer: "a",
      why: "A nonlinear device does not superpose. You can linearize around a bias point later; that is a different story.",
    },
    {
      id: "p2",
      prompt: "A 12 V independent source “off” becomes",
      options: {
        a: "An open circuit.",
        b: "A short circuit (0 V).",
        c: "A 12 Ω resistor.",
      },
      answer: "b",
      why: "0 V is a short. 0 A is an open.",
    },
  ],
};

export const TRANSFORM = {
  steps: [
    {
      id: "def",
      view: "xform",
      highlight: "all",
      title: "Source transformation",
      body: "A voltage source $v_s$ in series with $R$ can be replaced by a current source $i_s$ in parallel with the same $R$, or the other way around. Terminals $a$–$b$ must keep the same $v$–$i$.",
      eq: "$$i_s=v_s/R$$",
    },
    {
      id: "why",
      view: "xform",
      highlight: "eq",
      title: "Why they match",
      points: [
        "With sources off, both look like $R$ at $a$–$b$.",
        "With $a$–$b$ shorted, the short-circuit current is the same: $i_{sc}=v_s/R$.",
      ],
      check: {
        prompt: "$v_s=10\\,\\mathrm{V}$ in series with $5\\,\\Omega$ becomes",
        options: {
          a: "$2\\,\\mathrm{A}$ in parallel with $5\\,\\Omega$.",
          b: "$10\\,\\mathrm{A}$ in parallel with $5\\,\\Omega$.",
          c: "$2\\,\\mathrm{A}$ in series with $5\\,\\Omega$.",
        },
        answer: "a",
        why: "$i_s=10/5=2\\,\\mathrm{A}$, still across the same $R$.",
      },
    },
    {
      id: "dep",
      view: "xform",
      highlight: "dep",
      title: "Dependent sources too",
      body: "The same swap works for a dependent source if you keep the controlling variable intact. Example: $A v_s$ in series with $R$ becomes $(A v_s)/R$ in parallel with $R$.",
    },
  ],
  practice: [
    {
      id: "p1",
      prompt: "Source transformation keeps",
      options: {
        a: "The same $v$–$i$ at the two terminals.",
        b: "The same current through every internal node.",
        c: "Power in every element unchanged.",
      },
      answer: "a",
      why: "Equivalent at $a$–$b$. Inside, the original series $R$ is not the same element as the parallel $R$.",
    },
  ],
};

export const THEVENIN = {
  steps: [
    {
      id: "why",
      view: "thev",
      highlight: "load",
      title: "Why bother",
      body: "Usually only the load changes. Re-solving the whole circuit every time is wasteful. Replace the fixed two-terminal piece by $V_{Th}$ in series with $R_{Th}$.",
    },
    {
      id: "def",
      view: "thev",
      highlight: "all",
      title: "Thevenin’s theorem",
      body: "A linear two-terminal circuit equals $V_{Th}$ in series with $R_{Th}$.",
      eq: [
        "$$V_{Th}=v_{oc}$$",
        "$$R_{Th}=R_{in}$$",
      ],
    },
    {
      id: "rth",
      view: "thev",
      highlight: "r",
      title: "Finding $R_{Th}$",
      points: [
        "Independent sources off (voltage → short, current → open). Dependent sources stay.",
        "If that is messy, attach a test $v_o$ (often $1\\,\\mathrm{V}$) and measure $i_o$, or the other way around: $R_{Th}=v_o/i_o$.",
      ],
      check: {
        prompt: "When finding $R_{Th}$ you turn off",
        options: {
          a: "Independent sources only.",
          b: "Every source, including dependent.",
          c: "Only current sources.",
        },
        answer: "a",
        why: "Dependent sources are part of the linear network. Leave them.",
      },
    },
    {
      id: "load",
      view: "thev",
      highlight: "load",
      title: "Then attach $R_L$",
      eq: [
        "$$I_L=V_{Th}/(R_{Th}+R_L)$$",
        "$$V_L=R_L I_L=\\dfrac{R_L}{R_{Th}+R_L}V_{Th}$$",
      ],
    },
  ],
  practice: [
    {
      id: "p1",
      prompt: "$V_{Th}$ is",
      options: {
        a: "The open-circuit voltage at $a$–$b$.",
        b: "The short-circuit current.",
        c: "Always $1\\,\\mathrm{V}$.",
      },
      answer: "a",
      why: "Open $a$–$b$. Norton uses the short-circuit current.",
    },
  ],
};

export const NORTON = {
  steps: [
    {
      id: "def",
      view: "norton",
      highlight: "all",
      title: "Norton’s theorem",
      body: "Same linear two-terminal circuit, now $I_N$ in parallel with $R_N$. It is Thevenin after a source transformation.",
      eq: [
        "$$I_N=i_{sc}$$",
        "$$R_N=R_{Th}$$",
      ],
    },
    {
      id: "link",
      view: "norton",
      highlight: "eq",
      title: "Thevenin $\\leftrightarrow$ Norton",
      eq: [
        "$$V_{Th}=v_{oc}$$",
        "$$R_{Th}=v_{oc}/i_{sc}$$",
        "$$I_N=V_{Th}/R_{Th}=i_{sc}$$",
      ],
      check: {
        prompt: "$R_N$ compared with $R_{Th}$ is",
        options: {
          a: "Equal.",
          b: "Always half.",
          c: "The parallel of every resistor, ignoring sources.",
        },
        answer: "a",
        why: "Same dead-network resistance at $a$–$b$.",
      },
    },
  ],
  practice: [
    {
      id: "p1",
      prompt: "Norton’s $I_N$ is",
      options: {
        a: "The current through a short at $a$–$b$.",
        b: "The current through $R_L$ after you attach it.",
        c: "$V_{Th}\\,R_{Th}$.",
      },
      answer: "a",
      why: "Short the terminals. Then $I_L$ with a real load is a current divider.",
    },
  ],
};

export const MAXPOWER = {
  steps: [
    {
      id: "setup",
      view: "maxp",
      highlight: "all",
      title: "Power into the load",
      body: "Replace everything except $R_L$ by Thevenin. $V_{Th}$ and $R_{Th}$ are fixed. Only $R_L$ varies.",
      eq: "$$p=i^2 R_L=\\left(\\dfrac{V_{Th}}{R_{Th}+R_L}\\right)^2 R_L$$",
    },
    {
      id: "opt",
      view: "maxp",
      highlight: "rl",
      title: "Set $dp/dR_L=0$",
      body: "The peak is resistance match. That is maximum power, not maximum voltage or current at the load.",
      eq: [
        "$$R_L=R_{Th}$$",
        "$$p_{\\max}=V_{Th}^2/(4R_{Th})$$",
      ],
      check: {
        prompt: "Maximum power into $R_L$ needs",
        options: {
          a: "$R_L=R_{Th}$.",
          b: "$R_L=0$ (short).",
          c: "$R_L\\to\\infty$ (open).",
        },
        answer: "a",
        why: "Short gives max current, open gives max voltage. Match gives max $p=i^2 R_L$.",
      },
    },
  ],
  practice: [
    {
      id: "p1",
      prompt: "If $V_{Th}=8\\,\\mathrm{V}$ and $R_{Th}=4\\,\\Omega$, $p_{\\max}$ is",
      options: {
        a: "$4\\,\\mathrm{W}$.",
        b: "$16\\,\\mathrm{W}$.",
        c: "$8\\,\\mathrm{W}$.",
      },
      answer: "a",
      why: "$8^2/(4\\cdot 4)=64/16=4\\,\\mathrm{W}$, with $R_L=4\\,\\Omega$.",
    },
  ],
};
