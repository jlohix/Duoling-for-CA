import { trophyFromIndex } from "../data/trophies";
import TrophyBadge from "./TrophyBadge";
import LeagueTimeline from "./LeagueTimeline";

export default function TrophyCard({ leagueIndex, staffView = false, onPickIndex }) {
  const { current, next } = trophyFromIndex(leagueIndex);

  return (
    <section className="trophy-card" data-tier={current.id}>
      <p className="eyebrow">League path</p>
      <TrophyBadge index={leagueIndex} />
      <LeagueTimeline leagueIndex={leagueIndex} onPickIndex={onPickIndex} />
      <p className="login-hint">
        {staffView ? (
          <>
            Viewing{" "}
            <span className="league-live-name" data-tier={current.id}>
              {current.name}
            </span>
            . The bigger square is this league. Tap the path to see every tier.
            Use the list or the path to open any league’s ranks.
          </>
        ) : (
          <>
            You are in{" "}
            <span className="league-live-name" data-tier={current.id}>
              {current.name}
            </span>
            . The bigger square is your current league. Tap the path to see
            every tier.{" "}
            {next ? (
              <>
                Next:{" "}
                <span className="league-hint-tier" data-tier={next.id}>
                  {next.name}
                </span>
                . Finish in the top 20% this round to promote.
              </>
            ) : (
              "Highest league unlocked."
            )}
          </>
        )}
      </p>
    </section>
  );
}
