import { walkLessonKey } from "../state/progress";

const SECTION1 = [
  ["walk-lab-ohm", "R = V/I"],
  ["walk-lab-dividers", "Dividers"],
  ["walk-lab-branches", "Branch dividers"],
  ["walk-lab-power", "Power"],
  ["walk-lab-maxpower", "Max power"],
  ["walk-lab-nodal", "Nodal"],
];

const SECTION2 = [
  ["opamp", "Op-amp: Real, Ideal, Feedback"],
  ["inverting", "Inverting Amp"],
  ["noninv", "Non-inverting Amp"],
  ["walk-lab-thevenin", "Thevenin"],
  ["walk-lab-norton", "Norton"],
  ["walk-lab-dependent", "Dependent sources"],
  ["walk-lab-mesh", "Mesh"],
  ["walk-lab-supermesh", "Supermesh"],
  ["walk-lab-supernode", "Supernode"],
  ["walk-lab-superposition", "Superposition"],
  ["walk-lab-invopamp", "Inverting Amp lab"],
  ["walk-lab-ninvopamp", "Non-inverting Amp lab"],
];

const SECTION3 = [
  ["capacitor", "Capacitor"],
  ["inductor", "Inductor"],
  ["freec", "Source-Free Capacitor"],
  ["lsource", "Inductor with a Source"],
  ["walk-lab-dc", "DC capacitors and inductors"],
];

const SECTION4 = [
  ["freec", "Source-Free Capacitor"],
  ["freel", "Source-Free Inductor"],
  ["stepc", "Step Response of RC"],
  ["stepl", "Step Response of RL"],
];

const SECTION5 = [
  ["basics", "Laplace Transform Basics"],
  ["properties", "Properties of LT"],
  ["summary", "Laplace Transform Summary"],
  ["poles", "Poles & Zeros"],
  ["simple", "Simple Real Poles"],
  ["repeated", "Repeated Real Poles"],
  ["complex", "Distinct Complex Poles"],
  ["pfe", "Partial Fraction Expansion"],
  ["worked", "Worked examples"],
];

function fromPairs(section, pairs) {
  return pairs.map(([idOrKey, title]) => {
    const key = idOrKey.startsWith("walk-")
      ? idOrKey
      : walkLessonKey(section, idOrKey);
    return { key, title, section };
  });
}

export const WALK_TITLES = [
  ...fromPairs(1, SECTION1),
  ...fromPairs(2, SECTION2),
  ...fromPairs(3, SECTION3.filter(([id]) => !id.startsWith("walk-"))),
  ...SECTION3.filter(([id]) => id.startsWith("walk-")).map(([key, title]) => ({
    key,
    title,
    section: 3,
  })),
  ...fromPairs(4, SECTION4),
  ...fromPairs(5, SECTION5),
];

const TITLE_BY_KEY = new Map(WALK_TITLES.map((row) => [row.key, row]));

export function walkTitleForKey(key) {
  return TITLE_BY_KEY.get(key)?.title || key;
}

export function summarizeWalkFeedback(students) {
  const tallies = new Map(
    WALK_TITLES.map((row) => [
      row.key,
      { ...row, up: 0, down: 0, voters: [] },
    ])
  );
  for (const student of students || []) {
    const votes = student.walkFeedback || {};
    for (const [key, vote] of Object.entries(votes)) {
      if (vote !== "up" && vote !== "down") continue;
      if (!tallies.has(key)) {
        tallies.set(key, {
          key,
          title: walkTitleForKey(key),
          section: "",
          up: 0,
          down: 0,
          voters: [],
        });
      }
      const row = tallies.get(key);
      if (vote === "up") row.up += 1;
      else row.down += 1;
      row.voters.push({
        name: student.display || student.username,
        vote,
      });
    }
  }
  return [...tallies.values()].sort((a, b) => {
    const aN = a.up + a.down;
    const bN = b.up + b.down;
    if (bN !== aN) return bN - aN;
    const sec = Number(a.section) - Number(b.section);
    if (sec) return sec;
    return a.title.localeCompare(b.title);
  });
}
