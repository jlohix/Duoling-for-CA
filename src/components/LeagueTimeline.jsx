import { useState } from "react";
import { TROPHY_TIERS, trophyFromIndex } from "../data/trophies";
import TrophyTiersModal from "./TrophyTiersModal";

export default function LeagueTimeline({ leagueIndex, onPickIndex }) {
  const [open, setOpen] = useState(false);
  const { current, index } = trophyFromIndex(leagueIndex);

  return (
    <section
      className="league-path-wrap"
      aria-label={`League path. You are in ${current.name}.`}
    >
      <ol className="league-path">
        {TROPHY_TIERS.map((tier, i) => {
          const here = i === index;
          const passed = i < index;
          return (
            <li
              key={tier.id}
              className={`league-node ${here ? "here" : passed ? "passed" : "ahead"}`}
              data-tier={tier.id}
            >
              <button
                type="button"
                className="league-node-btn"
                aria-current={here ? "step" : undefined}
                aria-haspopup={onPickIndex ? undefined : "dialog"}
                aria-label={
                  onPickIndex
                    ? `Show ${tier.name} league ranks`
                    : `${tier.name} league. Show all leagues.`
                }
                onClick={() => {
                  if (onPickIndex) onPickIndex(i);
                  else setOpen(true);
                }}
              >
                <span className="tl-track">
                  <span className="tl-dot" aria-hidden="true" />
                </span>
                <span className="tl-name">{tier.name}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <TrophyTiersModal
        open={open}
        currentId={current.id}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
