import { Fragment, useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import TrophyBadge from "./TrophyBadge";
import StreakNotice from "./StreakNotice";
import { visibleStreak } from "../state/progress";
import { isAdmin } from "../state/auth";

const STUDENT_LINKS = [
  { id: "home", label: "Learn", group: "Study", icon: "fa-book" },
  { id: "progress", label: "Progress", group: "Study", icon: "fa-line-chart" },
  { id: "profile", label: "Profile", group: "You", icon: "fa-user" },
  { id: "leagues", label: "Trophy leagues", group: "Leagues", icon: "fa-trophy" },
  { id: "classboard", label: "Class board", group: "Compete", icon: "fa-users" },
  { id: "cohortboard", label: "Cohort board", group: "Compete", icon: "fa-sitemap" },
  { id: "individualboard", label: "Individual", group: "Compete", icon: "fa-user" },
  { id: "guide", label: "How to use", group: "Help", icon: "fa-question-circle" },
  { id: "updates", label: "Updates", group: "Help", icon: "fa-bullhorn" },
];

const ADMIN_LINKS = [
  { id: "home", label: "Learn", group: "Study", icon: "fa-book" },
  { id: "admin", label: "Students", group: "Staff", icon: "fa-users" },
  { id: "updates", label: "Updates", group: "Staff", icon: "fa-bullhorn" },
  { id: "guide", label: "How to use", group: "Staff", icon: "fa-question-circle" },
  { id: "leagues", label: "Trophy leagues", group: "Leagues", icon: "fa-trophy" },
  { id: "classboard", label: "Class board", group: "Compete", icon: "fa-list-ol" },
  { id: "cohortboard", label: "Cohort board", group: "Compete", icon: "fa-sitemap" },
  { id: "individualboard", label: "Individual", group: "Compete", icon: "fa-user" },
];

export default function AppShell({
  nav,
  onNav,
  user,
  progress,
  onLogout,
  children,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const streak = visibleStreak(progress);
  const admin = isAdmin(user);
  const links = admin ? ADMIN_LINKS : STUDENT_LINKS;

  function go(id) {
    onNav(id);
    setMenuOpen(false);
  }

  return (
    <div className={`app-shell ${menuOpen ? "menu-open" : ""}`}>
      <button
        type="button"
        className="menu-btn"
        aria-expanded={menuOpen}
        aria-controls="app-sidebar"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? (
          <>
            <i className="fa fa-times" aria-hidden="true" /> Close
          </>
        ) : (
          <>
            <i className="fa fa-bars" aria-hidden="true" /> Menu
          </>
        )}
      </button>
      {menuOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
      <aside className="sidebar" id="app-sidebar">
        <div className="sidebar-brand">
          <p className="eyebrow">Circuit analysis</p>
          <h1>Circuito</h1>
          <p className="login-user">Hi, {user.username}</p>
          {admin ? (
            <p className="sidebar-stats">Staff tools · preview, no XP</p>
          ) : (
            <p className="sidebar-stats">
              {progress.xp} XP · {streak} day streak
            </p>
          )}
        </div>
        <nav className="sidebar-nav" aria-label="App">
          {links.map((link, index) => (
            <Fragment key={link.id}>
              {link.group !== links[index - 1]?.group ? (
                <p className="nav-group">{link.group}</p>
              ) : null}
              <button
                type="button"
                className={nav === link.id ? "on" : ""}
                aria-current={nav === link.id ? "page" : undefined}
                onClick={() => go(link.id)}
              >
                <span className="nav-label">
                  <i className={`fa ${link.icon}`} aria-hidden="true" />
                  {link.label}
                </span>
                {link.id === "leagues" && !admin ? (
                  <TrophyBadge index={progress.leagueIndex} compact />
                ) : null}
              </button>
            </Fragment>
          ))}
        </nav>
        <div className="sidebar-foot">
          <ThemeSwitch />
          <button type="button" className="ghost logout-btn" onClick={onLogout}>
            <i className="fa fa-sign-out" aria-hidden="true" /> Log out
          </button>
        </div>
      </aside>
      <div className="shell-main">
        {admin || nav === "profile" ? null : (
          <StreakNotice
            progress={progress}
            onPractice={() => go("home")}
          />
        )}
        {children}
      </div>
    </div>
  );
}
