import { trophyFromIndex } from "../data/trophies";
import TrophyBadge from "./TrophyBadge";
import LeagueTimeline from "./LeagueTimeline";

export default function TrophyCard({ leagueIndex }) {
  const { current, next } = trophyFromIndex(leagueIndex);

  return (
    <section className="trophy-card" data-tier={current.id}>
      <p className="eyebrow">League path</p>
      <TrophyBadge index={leagueIndex} />
      <LeagueTimeline leagueIndex={leagueIndex} />
      <p className="login-hint">
        You are in{" "}
        <span className="league-live-name" data-tier={current.id}>
          {current.name}
        </span>
        . The bigger square is your current league. Tap the path to see every
        tier.{" "}
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
      </p>
    </section>
  );
}
