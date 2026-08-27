function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function u(value, unit) {
  return `$${value}\\ \\mathrm{${unit}}$`;
}

function makeMcq(id, question, correct, distractors, explanation) {
  const pool = [];
  const seen = new Set([correct]);
  pool.push(correct);
  for (const item of distractors) {
    if (seen.has(item)) continue;
    seen.add(item);
    pool.push(item);
    if (pool.length === 4) break;
  }
  let n = 2;
  while (pool.length < 4) {
    const filler = `${correct}`.replace(/\d+/, String(n));
    n += 1;
    if (seen.has(filler) || filler === correct) continue;
    seen.add(filler);
    pool.push(filler);
  }
  const mixed = shuffle(pool);
  const letters = ["a", "b", "c", "d"];
  const options = {};
  mixed.forEach((text, i) => {
    options[letters[i]] = text;
  });
  return {
    id,
    question,
    options,
    answer: letters[mixed.indexOf(correct)],
    explanation,
  };
}

function shuffleConcept(id, question, choices, correctIndex, explanation) {
  const order = shuffle([0, 1, 2, 3]);
  const letters = ["a", "b", "c", "d"];
  const options = {};
  order.forEach((src, i) => {
    options[letters[i]] = choices[src];
  });
  return {
    id,
    question,
    options,
    answer: letters[order.indexOf(correctIndex)],
    explanation,
  };
}

const WARMUPS = {
  1: [
    () => {
      const r = pick([2, 3, 4, 5, 6, 8, 10]);
      const i = pick([1, 2, 3, 4, 5]);
      const v = r * i;
      return {
        concept: "Ohm's law",
        ...makeMcq(
          "w1-ohm",
          `A ${u(r, "\\Omega")} resistor carries ${u(i, "A")}. What is the voltage across it?`,
          u(v, "V"),
          [u(r + i, "V"), u(i, "V"), u(v / 2 || r, "V")],
          `Ohm: $V = IR = ${i} \\times ${r} = ${v}\\ \\mathrm{V}$.`
        ),
      };
    },
    () => {
      const i1 = pick([1, 2, 3, 4, 5]);
      const i2 = pick([1, 2, 3, 4]);
      const out = i1 + i2;
      return {
        concept: "KCL",
        ...makeMcq(
          "w1-kcl",
          `Two currents ${u(i1, "A")} and ${u(i2, "A")} enter a node. One current leaves. What is that leaving current?`,
          u(out, "A"),
          [u(Math.abs(i1 - i2) || i1, "A"), u(i1, "A"), u(i2, "A")],
          `KCL: current in equals current out, so $${i1} + ${i2} = ${out}\\ \\mathrm{A}$ leaves.`
        ),
      };
    },
    () => {
      const v1 = pick([4, 5, 6, 8, 10, 12]);
      const v2 = pick([2, 3, 4, 5, 7]);
      const v3 = v1 + v2;
      return {
        concept: "KVL",
        ...makeMcq(
          "w1-kvl",
          `A loop has a ${u(v3, "V")} source and drops of ${u(v1, "V")} and $v_x$. What is $v_x$?`,
          u(v2, "V"),
          [u(v3, "V"), u(v1, "V"), u(v1 + v3, "V")],
          `KVL: around the loop, $${v3} = ${v1} + v_x$, so $v_x = ${v2}\\ \\mathrm{V}$.`
        ),
      };
    },
    () => {
      const r1 = pick([2, 3, 4, 5, 6]);
      let r2 = pick([2, 3, 4, 5, 7, 8]);
      if (r2 === r1) r2 += 1;
      const series = r1 + r2;
      const parallel = Math.round((r1 * r2 * 10) / (r1 + r2)) / 10;
      return {
        concept: "Series",
        ...makeMcq(
          "w1-series",
          `Two resistors ${u(r1, "\\Omega")} and ${u(r2, "\\Omega")} are in series. What is $R_{eq}$?`,
          u(series, "\\Omega"),
          [
            u(parallel, "\\Omega"),
            u(r1 * r2, "\\Omega"),
            u(Math.abs(r1 - r2) || 1, "\\Omega"),
          ],
          `Series resistances add: $${r1} + ${r2} = ${series}\\ \\Omega$.`
        ),
      };
    },
    () => {
      const pair = pick([
        [6, 3, 2],
        [8, 8, 4],
        [10, 10, 5],
        [12, 4, 3],
        [6, 6, 3],
        [4, 4, 2],
      ]);
      const [r1, r2, req] = pair;
      return {
        concept: "Parallel",
        ...makeMcq(
          "w1-parallel",
          `Two resistors ${u(r1, "\\Omega")} and ${u(r2, "\\Omega")} are in parallel. What is $R_{eq}$?`,
          u(req, "\\Omega"),
          [u(r1 + r2, "\\Omega"), u(r1 * r2, "\\Omega"), u(Math.abs(r1 - r2) || r1, "\\Omega")],
          `Parallel: $1/R_{eq} = 1/${r1} + 1/${r2}$, so $R_{eq} = ${req}\\ \\Omega$.`
        ),
      };
    },
  ],
  2: [
    () => {
      const c = pick([1, 2, 4]);
      const dvdt = pick([2, 3, 5, 6]);
      const i = c * dvdt;
      return makeMcq(
        "w2-ic",
        `$C = ${c}\\ \\mathrm{F}$ and $dv/dt = ${dvdt}\\ \\mathrm{V/s}$. What is $i_C$?`,
        u(i, "A"),
        [u(c / dvdt, "A"), u(dvdt / c, "A"), u(c + dvdt, "A")],
        `$i_C = C\\,dv/dt = ${c} \\times ${dvdt} = ${i}\\ \\mathrm{A}$.`
      );
    },
    () => {
      const l = pick([1, 2, 4]);
      const didt = pick([2, 3, 5]);
      const v = l * didt;
      return makeMcq(
        "w2-vl",
        `$L = ${l}\\ \\mathrm{H}$ and $di/dt = ${didt}\\ \\mathrm{A/s}$. What is $v_L$?`,
        u(v, "V"),
        [u(l / didt, "V"), u(didt, "V"), u(l + didt, "V")],
        `$v_L = L\\,di/dt = ${l} \\times ${didt} = ${v}\\ \\mathrm{V}$.`
      );
    },
    () => {
      const c = pick([1, 2, 4]);
      const v = pick([2, 3, 4, 5, 6]);
      const w = 0.5 * c * v * v;
      return makeMcq(
        "w2-cenergy",
        `A ${u(c, "F")} capacitor is charged to ${u(v, "V")}. Stored energy?`,
        u(w, "J"),
        [u(c * v, "J"), u(c * v * v, "J"), u(0.5 * c * v, "J")],
        `$w = \\frac{1}{2}CV^2 = \\frac{1}{2}(${c})(${v * v}) = ${w}\\ \\mathrm{J}$.`
      );
    },
    () => {
      const l = pick([1, 2, 4]);
      const i = pick([2, 3, 4, 5]);
      const w = 0.5 * l * i * i;
      return makeMcq(
        "w2-lenergy",
        `An inductor $L = ${l}\\ \\mathrm{H}$ carries ${u(i, "A")}. Stored energy?`,
        u(w, "J"),
        [u(l * i, "J"), u(l * i * i, "J"), u(0.5 * l * i, "J")],
        `$w = \\frac{1}{2}LI^2 = \\frac{1}{2}(${l})(${i * i}) = ${w}\\ \\mathrm{J}$.`
      );
    },
    () =>
      shuffleConcept(
        "w2-dc",
        "In DC steady state, a capacitor behaves like which element?",
        ["A short", "An open", `A $1\\ \\Omega$ resistor`, "An inductor"],
        1,
        "After transients die, $dv/dt = 0$, so $i_C = 0$: an open circuit."
      ),
  ],
  3: [
    () => {
      const rk = pick([1, 2, 4, 5]);
      const cu = pick([1, 2, 5]);
      const ms = rk * cu;
      return makeMcq(
        "w3-tau-rc",
        `An RC circuit has $R = ${rk}\\ \\mathrm{k}\\Omega$ and $C = ${cu}\\ \\mathrm{\\mu F}$. What is $\\tau$?`,
        u(ms, "ms"),
        [u(rk / cu, "ms"), u(ms, "s"), u(ms, "\\mu s")],
        `$\\tau = RC = ${rk * 1000} \\times ${cu}\\times 10^{-6} = ${ms}\\ \\mathrm{ms}$.`
      );
    },
    () => {
      const l = pick([2, 4, 5, 8]);
      const r = pick([2, 4, 5, 10]);
      const tau = l / r;
      return makeMcq(
        "w3-tau-rl",
        `An RL circuit has $L = ${l}\\ \\mathrm{H}$ and $R = ${r}\\ \\Omega$. What is $\\tau$?`,
        u(tau, "s"),
        [u(l * r, "s"), u(r / l, "s"), u(l, "s")],
        `$\\tau = L/R = ${l}/${r} = ${tau}\\ \\mathrm{s}$.`
      );
    },
    () => {
      const v0 = pick([5, 8, 10, 12, 20]);
      const vt = Math.round(v0 * 0.368 * 10) / 10;
      return makeMcq(
        "w3-exp",
        `A voltage starts at ${u(v0, "V")} and decays toward $0$ with time constant $\\tau$. What is $v(\\tau)$?`,
        `about ${u(vt, "V")}`,
        [u(v0, "V"), u(v0 / 2, "V"), u(0, "V")],
        `$e^{-1} \\approx 0.368$, so $v(\\tau) \\approx ${(v0 * 0.368).toFixed(2)}\\ \\mathrm{V}$.`
      );
    },
    () => {
      const [w, c, mag] = pick([
        [100, 0.01, 1],
        [50, 0.02, 1],
        [100, 0.02, 0.5],
        [20, 0.05, 1],
      ]);
      return makeMcq(
        "w3-zc",
        `At $\\omega = ${w}\\ \\mathrm{rad/s}$, $C = ${c}\\ \\mathrm{F}$. What is $Z_C$?`,
        `$-j${mag}\\ \\Omega$`,
        [`$j${mag}\\ \\Omega$`, u(mag, "\\Omega"), `$j${w * c}\\ \\Omega$`],
        `$Z_C = 1/(j\\omega C) = -j/(\\omega C) = -j${mag}\\ \\Omega$.`
      );
    },
    () => {
      const w = pick([20, 50, 100, 200]);
      const l = pick([0.02, 0.05, 0.1, 0.2]);
      const xl = Math.round(w * l * 100) / 100;
      return makeMcq(
        "w3-zl",
        `At $\\omega = ${w}\\ \\mathrm{rad/s}$, $L = ${l}\\ \\mathrm{H}$. What is $Z_L$?`,
        `$j${xl}\\ \\Omega$`,
        [`$${xl}\\ \\Omega$`, `$j${l}\\ \\Omega$`, `$j${w}\\ \\Omega$`],
        `$Z_L = j\\omega L = j(${w})(${l}) = j${xl}\\ \\Omega$.`
      );
    },
  ],
  4: [
    () =>
      shuffleConcept(
        "w4-ideal",
        "For an ideal op-amp with negative feedback, current into the $+$ input is",
        [
          "huge",
          "equal to $i_-$ and both are $0$",
          "equal to the load current",
          "$v_+/R$",
        ],
        1,
        "Ideal input currents are zero. Negative feedback forces $v_+ = v_-$."
      ),
    () => {
      const vp = pick([1, 2, 3, 4, 5]);
      return makeMcq(
        "w4-virtual",
        `Ideal op-amp in negative feedback. If $v_+ = ${vp}\\ \\mathrm{V}$, what is $v_-$?`,
        u(vp, "V"),
        [u(0, "V"), u(-vp, "V"), u(2 * vp, "V")],
        `Virtual short: $v_- = v_+ = ${vp}\\ \\mathrm{V}$.`
      );
    },
    () => {
      const rin = pick([1, 2, 4]);
      const rf = rin * pick([2, 3, 4, 5]);
      const gain = -(rf / rin);
      return makeMcq(
        "w4-inv",
        `Inverting amp: $R_{in} = ${rin}\\ \\mathrm{k}\\Omega$, $R_f = ${rf}\\ \\mathrm{k}\\Omega$. Closed-loop gain?`,
        `$${gain}$`,
        [`$${Math.abs(gain)}$`, `$${gain - 1}$`, `$${1 + rf / rin}$`],
        `$A = -R_f/R_{in} = -${rf}/${rin} = ${gain}$.`
      );
    },
    () => {
      const rg = pick([1, 2]);
      const rf = rg * pick([2, 3, 4, 5]);
      const gain = 1 + rf / rg;
      return makeMcq(
        "w4-ninv",
        `Non-inverting amp: $R_f = ${rf}\\ \\mathrm{k}\\Omega$, $R_g = ${rg}\\ \\mathrm{k}\\Omega$. Gain?`,
        `$${gain}$`,
        [`$${rf / rg}$`, `$${-gain}$`, `$1$`],
        `$A = 1 + R_f/R_g = 1 + ${rf / rg} = ${gain}$.`
      );
    },
  ],
  5: [
    () => {
      const r = pick([2, 4, 5, 8, 10]);
      return makeMcq(
        "w5-r",
        `s-domain impedance of $R = ${r}\\ \\Omega$?`,
        u(r, "\\Omega"),
        [`$${r}s$`, `$${r}/s$`, `$1/${r}$`],
        `A resistor is unchanged: $Z_R = R = ${r}\\ \\Omega$.`
      );
    },
    () => {
      const l = pick([2, 3, 4, 5, 8]);
      return makeMcq(
        "w5-l",
        `s-domain impedance of $L = ${l}\\ \\mathrm{H}$ with zero IC?`,
        `$${l}s$`,
        [`$${l}/s$`, `$s/${l}$`, `$1/(${l}s)$`],
        `$Z_L = sL = ${l}s$.`
      );
    },
    () => {
      const c = pick([0.25, 0.5, 2, 4]);
      const inv = 1 / c;
      const zText = `$${inv}/s$`;
      return makeMcq(
        "w5-c",
        `s-domain impedance of $C = ${c}\\ \\mathrm{F}$ with zero IC?`,
        zText,
        [`$${c}s$`, `$s/${c}$`, `$1/(${2 * c}s)$`],
        `$Z_C = 1/(sC) = 1/(${c}s) = ${inv}/s$.`
      );
    },
    () => {
      const k = pick([2, 3, 4, 5]);
      return makeMcq(
        "w5-ohm",
        `If $I(s) = ${k}/s$ through $Z = s$, what is $V(s)$?`,
        `$${k}$`,
        [`$${k}s$`, `$${k}/s^2$`, `$s/${k}$`],
        `$V(s) = I(s)Z(s) = (${k}/s)\\cdot s = ${k}$.`
      );
    },
  ],
  6: [
    () => {
      const num = pick([2, 3, 4, 5]);
      const pole = pick([1, 2, 4, 5, 6]);
      const h = `${num}/(s+${pole})`;
      return makeMcq(
        "w6-h",
        `If $Y(s) = ${h}$ and $X(s) = 1$ (zero ICs), what is $H(s)$?`,
        `$${h}$`,
        [`$s+${pole}$`, `$(s+${pole})/${num}$`, `$${num}$`],
        `$H(s) = Y(s)/X(s) = ${h}$.`
      );
    },
    () => {
      const gain = pick([2, 3, 4, 5]);
      const vin = pick([2, 3, 4]);
      const vout = gain * vin;
      return makeMcq(
        "w6-gain",
        `$H(s) = ${gain}$ (constant). If $V_{in} = ${vin}\\ \\mathrm{V}$, what is $V_{out}$?`,
        u(vout, "V"),
        [u(gain, "V"), u(vin, "V"), u(gain + vin, "V")],
        `$V_{out} = H\\,V_{in} = ${gain} \\times ${vin} = ${vout}\\ \\mathrm{V}$.`
      );
    },
    () =>
      shuffleConcept(
        "w6-z",
        "A driving-point impedance is",
        [
          "$V/I$ at the same port",
          "always $sL$",
          "only for DC",
          "output over input at two ports",
        ],
        0,
        "Driving-point $Z(s)$ is voltage over current at one port."
      ),
    () => {
      const num = pick([2, 3, 4]);
      const p = pick([2, 3, 4, 5, 8]);
      return makeMcq(
        "w6-pole",
        `For $H(s) = ${num}/(s+${p})$, the pole is at`,
        `$s = -${p}$`,
        [`$s = ${num}$`, `$s = ${p}$`, `$s = -${num}$`],
        `Denominator zero at $s+${p} = 0$, so the pole is $s = -${p}$.`
      );
    },
  ],
  7: [
    () => {
      const vm = pick([6, 8, 10, 12, 14, 20]);
      const rms = Math.round((vm / Math.SQRT2) * 100) / 100;
      return makeMcq(
        "w7-rms",
        `A sine has peak ${u(vm, "V")}. What is $V_{rms}$?`,
        `about ${u(rms, "V")}`,
        [u(vm, "V"), u(vm / 2, "V"), u(vm * 2, "V")],
        `$V_{rms} = ${vm}/\\sqrt{2} \\approx ${rms}\\ \\mathrm{V}$.`
      );
    },
    () => {
      const i = pick([1, 2, 4]);
      const z = pick([3, 5, 6, 8]);
      const v = i * z;
      return makeMcq(
        "w7-ohm",
        `Phasor current ${u(i, "A")} through $Z = ${z}\\ \\Omega$ (resistive). What is $V$?`,
        u(v, "V"),
        [u(i + z, "V"), u(z / i, "V"), u(i, "V")],
        `$\\mathbf{V} = \\mathbf{I}Z = ${i} \\times ${z} = ${v}\\ \\mathrm{V}$.`
      );
    },
    () => {
      const vrms = pick([4, 6, 8, 10]);
      const irms = pick([1, 2, 3]);
      const p = vrms * irms;
      return makeMcq(
        "w7-power",
        `Resistive load: $V_{rms} = ${vrms}\\ \\mathrm{V}$, $I_{rms} = ${irms}\\ \\mathrm{A}$. Average power?`,
        u(p, "W"),
        [u(vrms + irms, "W"), u(vrms / irms, "W"), u(0.5 * vrms * irms, "W")],
        `$P = V_{rms} I_{rms} \\cos 0^\\circ = ${vrms} \\times ${irms} = ${p}\\ \\mathrm{W}$.`
      );
    },
    () => {
      const w = pick([20, 40, 50, 100]);
      const l = pick([0.1, 0.2, 0.25, 0.5]);
      const xl = Math.round(w * l * 100) / 100;
      return makeMcq(
        "w7-xl",
        `$\\omega = ${w}\\ \\mathrm{rad/s}$, $L = ${l}\\ \\mathrm{H}$. What is $X_L$?`,
        u(xl, "\\Omega"),
        [u(l / w, "\\Omega"), u(w / l, "\\Omega"), `$j${l}\\ \\Omega$`],
        `$X_L = \\omega L = ${w} \\times ${l} = ${xl}\\ \\Omega$.`
      );
    },
  ],
};

const PRIMERS = {
  1: {
    title: "Basic laws",
    intro:
      "Use these before you touch the question bank. Name the law, then plug in numbers.",
    formulas: [
      { name: "Ohm's law", expr: "$V = IR$" },
      { name: "KCL", expr: "Sum of currents into a node is $0$" },
      { name: "KVL", expr: "Sum of voltages around a loop is $0$" },
      { name: "Series", expr: "$R_{eq} = R_1 + R_2$" },
      { name: "Parallel", expr: "$1/R_{eq} = 1/R_1 + 1/R_2$" },
    ],
  },
  2: {
    title: "Energy storage",
    intro:
      "Capacitors store voltage, inductors store current. At DC steady state, treat C as open and L as a short.",
    formulas: [
      { name: "Capacitor current", expr: "$i_C = C\\,dv/dt$" },
      { name: "Inductor voltage", expr: "$v_L = L\\,di/dt$" },
      { name: "Capacitor energy", expr: "$w_C = \\frac{1}{2}CV^2$" },
      { name: "Inductor energy", expr: "$w_L = \\frac{1}{2}LI^2$" },
      { name: "DC steady state", expr: "C → open circuit, L → short circuit" },
    ],
  },
  3: {
    title: "Transients and AC",
    intro:
      "First find the time constant. For sinusoids, switch to phasors and impedances.",
    formulas: [
      { name: "RC time constant", expr: "$\\tau = RC$" },
      { name: "RL time constant", expr: "$\\tau = L/R$" },
      { name: "First-order form", expr: "$x(t) = x_\\infty + (x_0 - x_\\infty)e^{-t/\\tau}$" },
      { name: "Capacitor impedance", expr: "$Z_C = 1/(j\\omega C)$" },
      { name: "Inductor impedance", expr: "$Z_L = j\\omega L$" },
    ],
  },
  4: {
    title: "Op-amps",
    intro:
      "Ideal op-amp in linear negative feedback: no input current, and the two input pins sit at the same voltage.",
    formulas: [
      { name: "Ideal inputs", expr: "$i_+ = i_- = 0$" },
      { name: "Virtual short", expr: "$v_+ = v_-$ (with negative feedback)" },
      { name: "Inverting gain", expr: "$v_o/v_i = -R_f/R_{in}$" },
      { name: "Non-inverting gain", expr: "$v_o/v_i = 1 + R_f/R_g$" },
    ],
  },
  5: {
    title: "Laplace",
    intro:
      "Replace each element with its s-domain model, then do circuit algebra in $s$. Zero initial conditions unless the problem states otherwise.",
    formulas: [
      { name: "Resistor", expr: "$Z_R = R$" },
      { name: "Inductor", expr: "$Z_L = sL$ (plus $Li(0)$ source if IC ≠ 0)" },
      { name: "Capacitor", expr: "$Z_C = 1/(sC)$ (plus $v(0)/s$ if IC ≠ 0)" },
      { name: "Ohm in s", expr: "$V(s) = I(s)Z(s)$" },
    ],
  },
  6: {
    title: "Network functions",
    intro:
      "$H(s)$ is output over input with zero initial conditions. Two-port parameters are just organized ways to write port voltages and currents.",
    formulas: [
      { name: "Transfer function", expr: "$H(s) = Y(s)/X(s)$ (zero ICs)" },
      { name: "Voltage gain", expr: "$H(s) = V_{out}(s)/V_{in}(s)$" },
      { name: "Impedance function", expr: "$Z(s) = V(s)/I(s)$" },
      { name: "Poles", expr: "roots of the denominator of $H(s)$" },
    ],
  },
  7: {
    title: "Frequency domain",
    intro:
      "Sinusoids become phasors. Use RMS for average power. Superposition if DC and AC sources share a circuit.",
    formulas: [
      { name: "RMS of a sine", expr: "$V_{rms} = V_m / \\sqrt{2}$" },
      { name: "Ohm (phasors)", expr: "$\\mathbf{V} = \\mathbf{I}Z$" },
      { name: "Average power", expr: "$P = V_{rms} I_{rms} \\cos\\theta$" },
      { name: "Reactance", expr: "$X_L = \\omega L$, $X_C = 1/(\\omega C)$" },
    ],
  },
};

export function primerForLesson(topicId) {
  const primer = PRIMERS[Number(topicId)];
  const makers = WARMUPS[Number(topicId)];
  if (!primer || !makers) return null;
  return {
    ...primer,
    warmups: makers.map((make, index) => {
      const question = make();
      return {
        ...question,
        concept: primer.formulas[index]?.name || question.concept,
      };
    }),
  };
}
