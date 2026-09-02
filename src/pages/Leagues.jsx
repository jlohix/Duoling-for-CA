import { Fragment, useEffect, useState } from "react";
import { buildLeagueBoard, formatRemain, SEASON_DAYS } from "../state/league";
import { TROPHY_TIERS } from "../data/trophies";
import { isAdmin } from "../state/auth";
import TrophyCard from "../components/TrophyCard";

function StreakCell({ streak }) {
  const days = Number(streak) || 0;
  return (
    <span
      className={`streak-chip board-streak ${days > 0 ? "hot" : ""}`}
      title="Days practiced in a row"
    >
      <span aria-hidden="true">🔥</span>
      {days} day{days === 1 ? "" : "s"}
    </span>
  );
}

export default function Leagues({ user, progress, onSkipDays }) {
  const admin = isAdmin(user);
  const [now, setNow] = useState(Date.now());
  const [viewIndex, setViewIndex] = useState(
    Number.isFinite(Number(progress.leagueIndex))
      ? Number(progress.leagueIndex)
      : 0
  );
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const board = buildLeagueBoard(
    user,
    progress,
    admin ? viewIndex : undefined
  );
  const you = board.rows.find((row) => row.isYou);
  const zoneLabel =
    you?.zone === "promote"
      ? "You are in the promotion zone."
      : you?.zone === "demote"
        ? "You are in the demotion zone."
        : you
          ? "You are in the safe zone."
          : "";

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">{board.league.name} league</p>
          <h1>Trophy leagues</h1>
        </div>
        <div className="league-timer">
          {formatRemain(Math.max(0, board.remainMs - (Date.now() - now)))}
          {onSkipDays ? (
            <button
              type="button"
              className="ghost"
              onClick={() => {
                onSkipDays(15);
                setNow(Date.now());
              }}
            >
              Skip 15 days
            </button>
          ) : null}
        </div>
      </header>
      <TrophyCard
        leagueIndex={admin ? viewIndex : progress.leagueIndex}
        staffView={admin}
        onPickIndex={admin ? setViewIndex : undefined}
      />
      {admin ? (
        <label className="class-picker">
          View league
          <select
            value={viewIndex}
            onChange={(e) => setViewIndex(Number(e.target.value))}
          >
            {TROPHY_TIERS.map((tier, index) => (
              <option key={tier.id} value={index}>
                {tier.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <p className="login-hint">
        Everyone here is in {board.league.name}. Ranked by XP earned this{" "}
        {SEASON_DAYS}-day round. Top 20% ({board.counts.promote}) promote.
        Bottom 20% ({board.counts.demote}) demote when time runs out.{" "}
        {admin
          ? "Staff can open any league. Filler rivals fill empty boards."
          : `${zoneLabel} ${you ? `You are #${you.rank}.` : ""}`}
      </p>
      <ol className="board">
        {board.rows.map((row, index) => {
          const prev = board.rows[index - 1];
          const showPromo =
            prev && prev.zone === "promote" && row.zone !== "promote";
          const showDemo = row.zone === "demote" && prev?.zone !== "demote";
          return (
            <Fragment key={row.username}>
              {showPromo ? (
                <li className="zone-banner promote">
                  <span aria-hidden="true">▲</span>
                  Promotion zone
                  <span aria-hidden="true">▲</span>
                </li>
              ) : null}
              {showDemo ? (
                <li className="zone-banner demote">
                  <span aria-hidden="true">▼</span>
                  Demotion zone
                  <span aria-hidden="true">▼</span>
                </li>
              ) : null}
              <li className={`board-row ${row.isYou ? "you" : ""} ${row.zone}`}>
                <span className={`board-rank ${row.zone}`}>{row.rank}</span>
                <span className="board-name">
                  {row.display}
                  {row.isYou ? " (you)" : ""}
                </span>
                <span className="board-xp">{row.seasonXp} XP</span>
                <StreakCell streak={row.streak} />
              </li>
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
