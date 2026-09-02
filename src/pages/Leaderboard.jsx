import { useState } from "react";
import {
  buildClassLeaderboard,
  buildCohortLeaderboard,
  buildIndividualLeaderboard,
  studentClassId,
} from "../data/leaderboard";
import { CLASS_IDS } from "../data/classes";
import { isAdmin } from "../state/auth";

function StudentRows({ rows }) {
  return (
    <ol className="board">
      {rows.map((row) => {
        const days = Number(row.streak) || 0;
        return (
          <li
            key={row.username}
            className={`board-row ${row.isYou ? "you" : ""}`}
          >
            <span className="board-rank">{row.rank}</span>
            <span className="board-name">
              {row.display}
              {row.isYou ? " (you)" : ""}
              {row.live ? <span className="login-hint">live</span> : null}
              <span className="class-chip">{row.classId}</span>
              <span
                className="trophy-badge compact"
                data-tier={row.league.id}
              >
                <span className="trophy-gem" aria-hidden="true">
                  ◆
                </span>
                {row.league.name}
              </span>
            </span>
            <span className="board-xp">{row.xp} XP</span>
            <span
              className={`streak-chip board-streak ${days > 0 ? "hot" : ""}`}
              title="Days practiced in a row"
            >
              <span aria-hidden="true">🔥</span>
              {days} day{days === 1 ? "" : "s"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function Leaderboard({ user, progress, mode = "class" }) {
  const yourClass = studentClassId(user, progress);
  const [classId, setClassId] = useState(yourClass);
  const admin = isAdmin(user);
  const focusClass = admin ? classId : yourClass;
  const classBoard = buildClassLeaderboard(user, progress, focusClass);
  const cohort = buildCohortLeaderboard(user, progress);
  const individuals = buildIndividualLeaderboard(user, progress);
  const cohortMode = mode === "cohort";
  const individualMode = mode === "individual";

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">
            {cohortMode
              ? "EE01–EE16"
              : individualMode
                ? "All classes"
                : classBoard.classId}
          </p>
          <h1>
            {cohortMode
              ? "Cohort leaderboard"
              : individualMode
                ? "Individual leaderboard"
                : "Class leaderboard"}
          </h1>
        </div>
      </header>
      {cohortMode ? (
        <>
          <p className="login-hint">
            Classes ranked by total XP. You are in {cohort.yourClass}
            {cohort.youRank ? `, currently #${cohort.youRank}.` : "."}
          </p>
          <ol className="board">
            {cohort.rows.map((row) => (
              <li
                key={row.classId}
                className={`board-row cohort-row ${row.you ? "you" : ""}`}
              >
                <span className="board-rank">{row.rank}</span>
                <span className="board-name">
                  {row.classId}
                  {row.you ? " (your class)" : ""}
                </span>
                <span className="board-xp">{row.members} students</span>
                <span className="board-xp">{row.xp} XP</span>
                <span className="login-hint">avg {row.avg}</span>
              </li>
            ))}
          </ol>
        </>
      ) : individualMode ? (
        <>
          <p className="login-hint">
            Top 10 students in the cohort by total XP.
            {individuals.youRank
              ? ` You are #${individuals.youRank} of ${individuals.total}.`
              : ` ${individuals.total} students.`}
          </p>
          <StudentRows rows={individuals.top} />
          {individuals.you ? (
            <>
              <p className="board-cut">Your place in the cohort</p>
              <StudentRows rows={[individuals.you]} />
            </>
          ) : null}
        </>
      ) : (
        <>
          <p className="login-hint">
            Students in {classBoard.classId}, ranked by total XP.
            {classBoard.youRank
              ? ` You are #${classBoard.youRank} of ${classBoard.total}.`
              : admin
                ? ` ${classBoard.total} students.`
                : ""}
          </p>
          {admin ? (
            <label className="class-picker">
              View class
              <select
                value={focusClass}
                onChange={(e) => setClassId(e.target.value)}
              >
                {CLASS_IDS.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <StudentRows rows={classBoard.rows} />
        </>
      )}
    </div>
  );
}
