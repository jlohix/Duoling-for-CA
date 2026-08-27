import { useTheme } from "../state/theme";

export default function ThemeSwitch({ compact = false }) {
  const { theme, setTheme } = useTheme();
  return (
    <div
      className={`theme-switch ${compact ? "compact" : ""}`}
      role="group"
      aria-label="Color theme"
    >
      <button
        type="button"
        className={theme === "light" ? "on" : ""}
        aria-pressed={theme === "light"}
        aria-label="Light"
        onClick={() => setTheme("light")}
      >
        <span aria-hidden="true">☀️</span>
        {compact ? null : "Light"}
      </button>
      <button
        type="button"
        className={theme === "dark" ? "on" : ""}
        aria-pressed={theme === "dark"}
        aria-label="Dark"
        onClick={() => setTheme("dark")}
      >
        <span aria-hidden="true">🌙</span>
        {compact ? null : "Dark"}
      </button>
    </div>
  );
}
