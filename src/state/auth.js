const DEMO_USERS = [
  { username: "student1", password: "password", role: "student" },
  { username: "admin", password: "meowmeow", role: "admin" },
];

const STORAGE_KEY = "circuito-session-v1";

function withRole(data) {
  const username = data.username;
  const role =
    data.role || (username === "admin" ? "admin" : "student");
  return { username, role };
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.username) return withRole(data);
  } catch {
    /* ignore */
  }
  return null;
}

export function login(username, password) {
  const user = DEMO_USERS.find(
    (entry) =>
      entry.username.toLowerCase() === String(username).trim().toLowerCase() &&
      entry.password === String(password)
  );
  if (!user) return null;
  const session = { username: user.username, role: user.role };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isAdmin(session) {
  return session?.role === "admin";
}
