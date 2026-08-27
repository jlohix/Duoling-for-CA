import { useState } from "react";
import { DIFFICULTIES, lessonKey } from "../data/topics";
import {
  isTopicUnlocked,
  isLessonUnlocked,
  SKIP_QUIZ_SIZE,
  SKIP_PASS_RATIO,
  topicInsight,
} from "../state/progress";
import StreakChip from "../components/StreakChip";
import TopicInsight from "../components/TopicInsight";
import TrophyBadge from "../components/TrophyBadge";

export default function Home({
  topics,
  progress,
  counts,
  onStart,
  onSkip,
}) {
  const [eventOpen, setEventOpen] = useState(false);
  const firstLockedIndex = topics.findIndex(
    (_, index) => !isTopicUnlocked(index, progress, counts)
  );
  const skipTopic =
    firstLockedIndex >= 0 ? topics[firstLockedIndex] : null;
  const needed = Math.ceil(SKIP_QUIZ_SIZE * SKIP_PASS_RATIO);

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Your path</p>
          <h1>Learn</h1>
        </div>
        <div className="stat-row">
          <TrophyBadge index={progress.leagueIndex} compact />
          <StreakChip progress={progress} />
          <div className="xp-chip" title="Experience points">
            {progress.xp} XP
          </div>
        </div>
      </header>
      <ol className="path">
        {topics.map((topic, index) => {
          const unlocked = isTopicUnlocked(index, progress, counts);
          const isSkipTarget = skipTopic && index === firstLockedIndex;
          const firstAvailable = DIFFICULTIES.find(
            (d) => (counts[lessonKey(topic.id, d.id)] || 0) > 0
          );
          return (
            <li
              key={topic.id}
              className={`unit ${unlocked ? "" : "locked"} ${isSkipTarget ? "skip-ready" : ""}`}
            >
              <div className="unit-label">
                <h2>{topic.name}</h2>
                <p>{topic.blurb}</p>
                <TopicInsight
                  insight={topicInsight(progress, topic.id)}
                  compact
                />
              </div>
              <div className="nodes">
                {DIFFICULTIES.map((diff) => {
                  const key = lessonKey(topic.id, diff.id);
                  const n = counts[key] || 0;
                  const done = progress.completed?.includes(key);
                  const lessonOpen =
                    unlocked &&
                    (done ||
                      isLessonUnlocked(topic.id, diff.id, progress, counts));
                  const canPlay = lessonOpen && n > 0;
                  const skipClick =
                    isSkipTarget &&
                    !unlocked &&
                    firstAvailable?.id === diff.id;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`node ${done ? "done" : ""} ${canPlay ? "" : "off"} ${skipClick ? "opens-skip" : ""}`}
                      disabled={!canPlay && !skipClick}
                      onClick={() => {
                        if (canPlay) onStart(topic.id, diff.id);
                        else if (skipClick) setEventOpen(true);
                      }}
                    >
                      <span className="node-icon">{done ? "✓" : diff.icon}</span>
                      <span className="node-name">{diff.name}</span>
                      <span className="node-count">
                        {!n
                          ? "No questions"
                          : canPlay
                            ? `${n} Qs`
                            : skipClick
                              ? `${n} Qs`
                              : "Locked"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      {eventOpen && skipTopic ? (
        <div
          className="overlay"
          onClick={() => setEventOpen(false)}
          role="presentation"
        >
          <div
            className="event-sheet"
            role="dialog"
            aria-labelledby="skip-event-title"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="eyebrow">Path event</p>
            <h2 id="skip-event-title">Skip to {skipTopic.name}</h2>
            <p>
              Pass a quick assessment of {SKIP_QUIZ_SIZE} questions from earlier
              topics. You need {needed}/{SKIP_QUIZ_SIZE} to unlock this unit.
            </p>
            <button
              type="button"
              className="skip-btn"
              onClick={() => onSkip(skipTopic.id)}
            >
              Start assessment
            </button>
            <button
              type="button"
              className="ghost sheet-cancel"
              onClick={() => setEventOpen(false)}
            >
              Not now
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
