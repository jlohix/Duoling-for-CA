import { BUILT_IN_LOGS } from "../data/changelog";
import { todayKey } from "./progress";

const STORAGE_KEY = "circuito-changelog-v1";

export function loadCustomLogs() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((row) => row && row.id && row.title);
  } catch {
    return [];
  }
}

function saveCustomLogs(rows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  return rows;
}

export function addChangeLog({ title, body, date }) {
  const entry = {
    id: `custom-${Date.now()}`,
    title: String(title || "").trim(),
    body: String(body || "").trim(),
    date: String(date || todayKey()),
    custom: true,
  };
  if (!entry.title) return loadCustomLogs();
  return saveCustomLogs([entry, ...loadCustomLogs()]);
}

export function removeChangeLog(id) {
  return saveCustomLogs(loadCustomLogs().filter((row) => row.id !== id));
}

export function listChangeLogs() {
  return [...loadCustomLogs(), ...BUILT_IN_LOGS].sort((a, b) => {
    const byDate = String(b.date).localeCompare(String(a.date));
    if (byDate) return byDate;
    return String(b.id).localeCompare(String(a.id));
  });
}
