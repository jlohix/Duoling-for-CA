import { TROPHY_TIERS } from "../data/trophies";

export default function TrophyTiersModal({
  open,
  currentId,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="overlay trophy-overlay" onClick={onClose} role="presentation">
      <div
        className="event-sheet trophy-guide"
        role="dialog"
        aria-labelledby="trophy-guide-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="trophy-guide-title">Trophy leagues</h2>
        <p>
          Everyone starts in Bronze. Every 3 days, the top 20% in a league
          promote and the bottom 20% demote. XP does not skip you ahead.
        </p>
        <ol className="trophy-guide-list">
          {TROPHY_TIERS.map((tier) => {
            const here = tier.id === currentId;
            return (
              <li
                key={tier.id}
                className={here ? "on" : ""}
                data-tier={tier.id}
              >
                <span className="trophy-gem" aria-hidden="true">
                  ◆
                </span>
                <span className="trophy-guide-name">
                  {tier.name}
                  {here ? " · you" : ""}
                </span>
              </li>
            );
          })}
        </ol>
        <button type="button" className="ghost sheet-cancel" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
