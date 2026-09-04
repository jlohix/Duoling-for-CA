import { todayKey, visibleStreak } from "./progress";
import {
  DEFAULT_CLASS,
  normalizeClassId,
  syntheticStudents,
} from "../data/classes";

const STORAGE_KEY = "circuito-roster-v1";

export const CLASSMATES = [
  {
    username: "aisha",
    display: "Aisha",
    classId: "EE01",
    xp: 340,
    streak: 6,
    topicStats: {
      1: { correct: 28, attempts: 32 },
      2: { correct: 9, attempts: 12 },
      3: { correct: 4, attempts: 8 },
    },
    completed: ["1-1", "1-2", "1-3", "2-1"],
  },
  {
    username: "leo",
    display: "Leo",
    classId: "EE01",
    xp: 210,
    streak: 3,
    topicStats: {
      1: { correct: 14, attempts: 22 },
      2: { correct: 2, attempts: 7 },
    },
    completed: ["1-1", "1-2", "2-1"],
  },
  {
    username: "nina",
    display: "Nina",
    classId: "EE02",
    xp: 150,
    streak: 12,
    topicStats: {
      1: { correct: 18, attempts: 20 },
      3: { correct: 6, attempts: 6 },
    },
    completed: ["1-1", "1-2", "3-1"],
  },
  {
    username: "omar",
    display: "Omar",
    classId: "EE03",
    xp: 80,
    streak: 4,
    topicStats: {
      1: { correct: 5, attempts: 11 },
    },
    completed: ["1-1"],
  },
  {
    username: "priya",
    display: "Priya",
    classId: "EE04",
    xp: 40,
    streak: 1,
    topicStats: {
      1: { correct: 2, attempts: 4 },
    },
    completed: [],
  },
];

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { overlays: {}, extras: [] };
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return { overlays: {}, extras: [] };
    if (Array.isArray(data.extras) || data.overlays) {
      return {
        overlays:
          data.overlays && typeof data.overlays === "object"
            ? data.overlays
            : {},
        extras: Array.isArray(data.extras) ? data.extras : [],
      };
    }
    return { overlays: data, extras: [] };
  } catch {
    return { overlays: {}, extras: [] };
  }
}

function saveStore(store) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ overlays: store.overlays, extras: store.extras })
  );
}

function loadOverlays() {
  return loadStore().overlays;
}

function saveOverlays(overlays) {
  const store = loadStore();
  saveStore({ ...store, overlays });
}

function slugName(display) {
  const base =
    String(display)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 18) || "student";
  return base;
}

function takenNames(store) {
  return new Set([
    "student1",
    "admin",
    ...CLASSMATES.map((row) => row.username.toLowerCase()),
    ...store.extras.map((row) => String(row.username).toLowerCase()),
  ]);
}

export function addStudent(display, classId = DEFAULT_CLASS) {
  const name = String(display || "").trim();
  if (!name) return { ok: false, error: "Enter a name." };
  const store = loadStore();
  const taken = takenNames(store);
  let username = slugName(name);
  let n = 2;
  while (taken.has(username)) {
    username = `${slugName(name)}${n}`;
    n += 1;
  }
  const student = {
    username,
    display: name,
    classId: normalizeClassId(classId),
    xp: 0,
    streak: 0,
    topicStats: {},
    completed: [],
  };
  store.extras.push(student);
  saveStore(store);
  return { ok: true, student };
}

function cloneStats(stats) {
  const out = {};
  for (const [id, val] of Object.entries(stats || {})) {
    out[id] = {
      correct: Number(val?.correct) || 0,
      attempts: Number(val?.attempts) || 0,
    };
  }
  return out;
}

function applyOverlay(base, overlay) {
  if (!overlay) {
    return {
      ...base,
      classId: normalizeClassId(base.classId),
      topicStats: cloneStats(base.topicStats),
      completed: Array.isArray(base.completed) ? [...base.completed] : [],
    };
  }
  return {
    ...base,
    display: overlay.display || base.display,
    classId: normalizeClassId(
      overlay.classId != null ? overlay.classId : base.classId
    ),
    xp: overlay.xp != null ? Number(overlay.xp) || 0 : base.xp,
    streak: overlay.streak != null ? Number(overlay.streak) || 0 : base.streak,
    topicStats: overlay.topicStats
      ? cloneStats(overlay.topicStats)
      : cloneStats(base.topicStats),
    completed: Array.isArray(overlay.completed)
      ? overlay.completed
      : Array.isArray(base.completed)
        ? base.completed
        : [],
  };
}

export function listStudents(liveProgress, options = {}) {
  const includeSynthetic = Boolean(options.includeSynthetic);
  const store = loadStore();
  const student1 = {
    username: "student1",
    display: "student1",
    classId: normalizeClassId(liveProgress.classId),
    xp: Number(liveProgress.xp) || 0,
    streak: visibleStreak(liveProgress),
    topicStats: cloneStats(liveProgress.topicStats),
    completed: liveProgress.completed || [],
    walkFeedback: liveProgress.walkFeedback || {},
    live: true,
  };

  const others = CLASSMATES.map((row) => ({
    ...applyOverlay(row, store.overlays[row.username]),
    live: false,
  }));

  const extras = store.extras.map((row) => ({
    ...applyOverlay(
      {
        username: row.username,
        display: row.display || row.username,
        classId: row.classId || DEFAULT_CLASS,
        xp: Number(row.xp) || 0,
        streak: Number(row.streak) || 0,
        topicStats: row.topicStats || {},
        completed: Array.isArray(row.completed) ? row.completed : [],
      },
      store.overlays[row.username]
    ),
    live: false,
    custom: true,
  }));

  const roster = [student1, ...others, ...extras].map((row) => ({
    ...row,
    classId: normalizeClassId(row.classId),
  }));

  if (!includeSynthetic) return roster;

  const taken = new Set(roster.map((row) => row.username.toLowerCase()));
  const extra = syntheticStudents().filter(
    (row) => !taken.has(row.username.toLowerCase())
  );
  return [...roster, ...extra];
}

export function studentToProgress(student) {
  return {
    xp: Number(student.xp) || 0,
    streak: Number(student.streak) || 0,
    lastPracticeDate: student.streak ? todayKey() : "",
    completed: student.completed || [],
    unlockedBySkip: [],
    topicStats: cloneStats(student.topicStats),
  };
}

export function saveStudentRecord(username, edits, liveProgress) {
  const xp = Math.max(0, Number(edits.xp) || 0);
  const streak = Math.max(0, Number(edits.streak) || 0);
  const topicStats = cloneStats(edits.topicStats);
  const completed = Array.isArray(edits.completed)
    ? edits.completed.filter((key) => typeof key === "string")
    : [];
  const overlays = loadOverlays();
  overlays[username] = {
    display: edits.display,
    classId: normalizeClassId(edits.classId),
    xp,
    streak,
    topicStats,
    completed,
  };
  saveOverlays(overlays);

  const store = loadStore();
  const extraIndex = store.extras.findIndex(
    (row) => row.username.toLowerCase() === username.toLowerCase()
  );
  if (extraIndex >= 0) {
    store.extras[extraIndex] = {
      ...store.extras[extraIndex],
      display: edits.display || store.extras[extraIndex].display,
      classId: normalizeClassId(edits.classId),
      xp,
      streak,
      topicStats,
      completed,
    };
    saveStore(store);
  }

  if (username === "student1") {
    const next = {
      ...liveProgress,
      xp,
      streak,
      lastPracticeDate: streak ? todayKey() : "",
      topicStats,
      completed,
      classId: normalizeClassId(edits.classId),
    };
    return next;
  }
  return liveProgress;
}
