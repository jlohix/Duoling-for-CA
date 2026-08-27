export const CLASS_IDS = Array.from(
  { length: 16 },
  (_, i) => `EE${String(i + 1).padStart(2, "0")}`
);

export const DEFAULT_CLASS = "EE01";

export function normalizeClassId(value) {
  const raw = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
  const match = raw.match(/^EE0*([1-9]|1[0-6])$/);
  if (!match) return DEFAULT_CLASS;
  return `EE${String(Number(match[1])).padStart(2, "0")}`;
}

function hashString(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 33 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const SYNTH_NAMES = [
  ["ada", "Ada"],
  ["ben", "Ben"],
  ["cory", "Cory"],
  ["dev", "Dev"],
  ["eva", "Eva"],
  ["finn", "Finn"],
  ["gia", "Gia"],
  ["hugo", "Hugo"],
  ["ivy", "Ivy"],
  ["jax", "Jax"],
  ["koi", "Koi"],
  ["lux", "Lux"],
];

export function syntheticStudents() {
  const out = [];
  CLASS_IDS.forEach((classId, classIndex) => {
    for (let slot = 0; slot < 3; slot += 1) {
      const nameIndex = (classIndex * 3 + slot) % SYNTH_NAMES.length;
      const [slug, display] = SYNTH_NAMES[nameIndex];
      const username = `${classId.toLowerCase()}-${slug}${slot}`;
      const hash = hashString(username);
      out.push({
        username,
        display,
        classId,
        xp: 25 + (hash % 380),
        streak: 1 + (hash % 14),
        topicStats: {},
        completed: [],
        synthetic: true,
      });
    }
  });
  return out;
}
