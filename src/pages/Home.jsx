import { useState } from "react";
import { DIFFICULTIES, lessonKey } from "../data/topics";
import { LAPLACE_LABS } from "../section5";
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
import LabDoodles from "../components/LabDoodles";

function DoodlePage({ children }) {
  return (
    <div className="labs-fun-wrap">
      <LabDoodles />
      {children}
    </div>
  );
}

function topicMeter(topic, progress, counts) {
  const keys = DIFFICULTIES.map((d) => lessonKey(topic.id, d.id)).filter(
    (key) => (counts[key] || 0) > 0
  );
  const done = keys.filter((key) => progress.completed?.includes(key)).length;
  const total = keys.length || DIFFICULTIES.length;
  return {
    done,
    total,
    pct: total ? Math.round((100 * done) / total) : 0,
  };
}

function SkipSheet({ topic, needed, onSkip, onClose }) {
  return (
    <div
      className="overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="event-sheet"
        role="dialog"
        aria-labelledby="skip-event-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="eyebrow">Path event</p>
        <h2 id="skip-event-title">Skip to {topic.name}</h2>
        <p>
          Pass a quick assessment of {SKIP_QUIZ_SIZE} questions from earlier
          topics. You need {needed}/{SKIP_QUIZ_SIZE} correct on the first try.
          A second miss ends the quiz — you cannot retry.
        </p>
        <button type="button" className="skip-btn" onClick={() => onSkip(topic.id)}>
          Start assessment
        </button>
        <button type="button" className="ghost sheet-cancel" onClick={onClose}>
          Not now
        </button>
      </div>
    </div>
  );
}

function SectionCard({
  kicker,
  title,
  blurb,
  index,
  badge,
  unlocked,
  meter,
  current,
  skipReady,
  onOpen,
  onJump,
}) {
  const cta = !unlocked
    ? `Jump to section ${index}`
    : meter.pct >= 100
      ? "Review"
      : meter.pct > 0
        ? "Continue"
        : "Start";
  return (
    <article
      className={`section-card ${unlocked ? "" : "locked"} ${current ? "current" : ""}`}
    >
      <div className="section-copy">
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
        {unlocked ? (
          <div className="section-meter">
            <div className="meter">
              <div className="meter-fill" style={{ width: `${meter.pct}%` }} />
            </div>
            <span className="section-pct">{meter.pct}%</span>
            <span className="section-trophy" aria-hidden="true">
              🏆
            </span>
          </div>
        ) : (
          <p className="section-lock-meta">
            🔒 {meter.total} {meter.total === 1 ? "unit" : "units"}
          </p>
        )}
        <button
          type="button"
          className={unlocked && current ? "section-cta" : "section-cta ghost"}
          onClick={() => {
            if (!unlocked && skipReady) onJump();
            else onOpen();
          }}
        >
          {cta}
        </button>
      </div>
      <div className="section-aside">
        <div className="section-speech">
          <p className="section-bubble">{blurb}</p>
          <img
            className="section-mascot"
            src="/mascot.png"
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}

function LawsLabs({ unlocked, labs }) {
  const off = unlocked ? "" : "off";
  return (
    <>
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onLab}>
        <span className="node-icon">↔</span>
        <span className="node-name">R = V/I</span>
        <span className="node-count">6 Qs</span>
      </button>
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onDividerLab}>
        <span className="node-icon">÷</span>
        <span className="node-name">Dividers</span>
        <span className="node-count">V and I</span>
      </button>
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onPowerLab}>
        <span className="node-icon">P</span>
        <span className="node-name">Power</span>
        <span className="node-count">Walkthrough</span>
      </button>
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onMaxPowerLab}>
        <span className="node-icon">P↑</span>
        <span className="node-name">Max power</span>
        <span className="node-count">Walkthrough</span>
      </button>
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onThevLab}>
        <span className="node-icon">≡</span>
        <span className="node-name">Thevenin</span>
        <span className="node-count">Walkthrough</span>
      </button>
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onNortonLab}>
        <span className="node-icon">∥</span>
        <span className="node-name">Norton</span>
        <span className="node-count">Walkthrough</span>
      </button>
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onDepLab}>
        <span className="node-icon">◇</span>
        <span className="node-name">Dependent</span>
        <span className="node-count">Walkthrough</span>
      </button>
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onNodalLab}>
        <span className="node-icon">N</span>
        <span className="node-name">Nodal</span>
        <span className="node-count">2 + 3 hard</span>
      </button>
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onMeshLab}>
        <span className="node-icon">M</span>
        <span className="node-name">Mesh</span>
        <span className="node-count">I1 and I2</span>
      </button>
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onSuperMeshLab}>
        <span className="node-icon">SM</span>
        <span className="node-name">Supermesh</span>
        <span className="node-count">Walkthrough</span>
      </button>
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onSuperNodeLab}>
        <span className="node-icon">SN</span>
        <span className="node-name">Supernode</span>
        <span className="node-count">Walkthrough</span>
      </button>
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onSuperposLab}>
        <span className="node-icon">Σ</span>
        <span className="node-name">Superposition</span>
        <span className="node-count">Walkthrough</span>
      </button>
    </>
  );
}

function LaplaceLabs({ unlocked, onLaplaceLab }) {
  const off = unlocked ? "" : "off";
  return (
    <>
      {LAPLACE_LABS.map((lab) => (
        <button
          key={lab.id}
          type="button"
          className={`node ${off}`}
          disabled={!unlocked}
          onClick={() => onLaplaceLab(lab.id)}
        >
          <span className="node-icon">{lab.icon}</span>
          <span className="node-name">{lab.title}</span>
          <span className="node-count">{lab.count}</span>
        </button>
      ))}
    </>
  );
}

function TopicLadder({
  topic,
  index,
  unlocked,
  isSkipTarget,
  progress,
  counts,
  onStart,
  onBack,
  onAskSkip,
  onInvOpAmp,
  onNonInvOpAmp,
  onDcLab,
  onLaplaceLab,
  labs,
  allOpen = false,
}) {
  const firstAvailable = DIFFICULTIES.find(
    (d) => (counts[lessonKey(topic.id, d.id)] || 0) > 0
  );
  const showOpAmpWalks = topic.id === 4;
  const showLawsLabs = topic.id === 1;
  const showEnergyLabs = topic.id === 2;
  const showLaplaceWalks = topic.id === 5;
  return (
    <DoodlePage>
    <div className="page">
      <header className="topbar">
        <div>
          <button type="button" className="ghost back-link" onClick={onBack}>
            ← Back
          </button>
          <p className="eyebrow">Section {index}</p>
          <h1>{topic.name}</h1>
        </div>
      </header>
      <p className="login-hint">{topic.blurb}</p>
      <TopicInsight insight={topicInsight(progress, topic.id)} compact />
      <ol className="path ladder-path">
        <li className={`unit ${unlocked ? "" : "locked"} ${isSkipTarget ? "skip-ready" : ""}`}>
          <div className="nodes">
            {showLawsLabs ? <LawsLabs unlocked={unlocked} labs={labs} /> : null}
            {showEnergyLabs ? (
              <button
                type="button"
                className={`node ${unlocked ? "" : "off"}`}
                disabled={!unlocked}
                onClick={onDcLab}
              >
                <span className="node-icon">DC</span>
                <span className="node-name">C and L</span>
                <span className="node-count">4 Qs</span>
              </button>
            ) : null}
            {showLaplaceWalks ? (
              <LaplaceLabs unlocked={unlocked} onLaplaceLab={onLaplaceLab} />
            ) : null}
            {showOpAmpWalks ? (
              <>
                <button
                  type="button"
                  className={`node ${unlocked ? "" : "off"}`}
                  disabled={!unlocked}
                  onClick={onInvOpAmp}
                >
                  <span className="node-icon">−G</span>
                  <span className="node-name">Inverting amp</span>
                  <span className="node-count">Walkthrough</span>
                </button>
                <button
                  type="button"
                  className={`node ${unlocked ? "" : "off"}`}
                  disabled={!unlocked}
                  onClick={onNonInvOpAmp}
                >
                  <span className="node-icon">+G</span>
                  <span className="node-name">Non-inv. amp</span>
                  <span className="node-count">Walkthrough</span>
                </button>
              </>
            ) : null}
            {showLawsLabs || showEnergyLabs || showLaplaceWalks || showOpAmpWalks ? (
              <p className="path-quiz-mark">
                Test your knowledge for all the walkthroughs
              </p>
            ) : null}
            {DIFFICULTIES.map((diff) => {
              const key = lessonKey(topic.id, diff.id);
              const n = counts[key] || 0;
              const done = progress.completed?.includes(key);
              const lessonOpen =
                unlocked &&
                (allOpen ||
                  done ||
                  isLessonUnlocked(topic.id, diff.id, progress, counts));
              const canPlay = lessonOpen && n > 0;
              const skipClick =
                isSkipTarget && !unlocked && firstAvailable?.id === diff.id;
              return (
                <button
                  key={key}
                  type="button"
                  className={`node ${done ? "done" : ""} ${canPlay ? "" : "off"} ${skipClick ? "opens-skip" : ""}`}
                  disabled={!canPlay && !skipClick}
                  onClick={() => {
                    if (canPlay) onStart(topic.id, diff.id);
                    else if (skipClick) onAskSkip();
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
      </ol>
    </div>
    </DoodlePage>
  );
}

export default function Home({
  topics,
  progress,
  counts,
  pastPapers = [],
  onStart,
  onStartPaper,
  onSkip,
  onLab,
  onThevLab,
  onNortonLab,
  onDepLab,
  onNodalLab,
  onMeshLab,
  onSuperMeshLab,
  onSuperNodeLab,
  onSuperposLab,
  onDividerLab,
  onPowerLab,
  onMaxPowerLab,
  onDcLab,
  onInvOpAmp,
  onNonInvOpAmp,
  onLaplaceLab,
  allOpen = false,
}) {
  const [section, setSection] = useState(null);
  const [eventOpen, setEventOpen] = useState(false);
  const firstLockedIndex = allOpen
    ? -1
    : topics.findIndex(
        (_, index) => !isTopicUnlocked(index, progress, counts)
      );
  const skipTopic =
    firstLockedIndex >= 0 ? topics[firstLockedIndex] : null;
  const needed = Math.ceil(SKIP_QUIZ_SIZE * SKIP_PASS_RATIO);
  const currentIndex = topics.findIndex((topic, index) => {
    if (!isTopicUnlocked(index, progress, counts)) return false;
    return topicMeter(topic, progress, counts).pct < 100;
  });

  const skipSheet =
    eventOpen && skipTopic ? (
      <SkipSheet
        topic={skipTopic}
        needed={needed}
        onSkip={onSkip}
        onClose={() => setEventOpen(false)}
      />
    ) : null;

  if (section === "papers") {
    return (
      <DoodlePage>
      <div className="page">
        <header className="topbar">
          <div>
            <button
              type="button"
              className="ghost back-link"
              onClick={() => setSection(null)}
            >
              ← Back
            </button>
            <p className="eyebrow">Exam practice</p>
            <h1>Past year papers</h1>
          </div>
        </header>
        {pastPapers.length === 0 ? (
          <p className="login-hint">
            This section is ready. The question bank is not in yet — sit tight
            and it will show up here as papers you can attempt.
          </p>
        ) : (
          <>
            <p className="login-hint">
              Sit a past paper like a lesson. First finish awards XP like
              Average. Replay is practice only.
            </p>
            <ul className="paper-list">
              {pastPapers.map((pack) => {
                const done = progress.completed?.includes(pack.id);
                const n = pack.questions.length;
                return (
                  <li key={pack.id}>
                    <button
                      type="button"
                      className={`paper-row ${done ? "done" : ""}`}
                      onClick={() => onStartPaper(pack)}
                    >
                      <span className="node-icon">{done ? "✓" : "PY"}</span>
                      <span className="paper-row-copy">
                        <span className="paper-row-title">{pack.title}</span>
                        <span className="paper-row-count">
                          {n} {n === 1 ? "question" : "questions"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
      </DoodlePage>
    );
  }

  if (section != null) {
    const index = topics.findIndex((t) => t.id === section);
    const topic = topics[index];
    if (topic) {
      return (
        <>
          <TopicLadder
            topic={topic}
            index={index + 1}
            unlocked={allOpen || isTopicUnlocked(index, progress, counts)}
            isSkipTarget={!allOpen && skipTopic && index === firstLockedIndex}
            progress={progress}
            counts={counts}
            onStart={onStart}
            onBack={() => setSection(null)}
            onAskSkip={() => setEventOpen(true)}
            onInvOpAmp={onInvOpAmp}
            onNonInvOpAmp={onNonInvOpAmp}
            onDcLab={onDcLab}
            onLaplaceLab={onLaplaceLab}
            labs={{
              onLab,
              onDividerLab,
              onPowerLab,
              onMaxPowerLab,
              onThevLab,
              onNortonLab,
              onDepLab,
              onNodalLab,
              onMeshLab,
              onSuperMeshLab,
              onSuperNodeLab,
              onSuperposLab,
            }}
            allOpen={allOpen}
          />
          {skipSheet}
        </>
      );
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Your path</p>
          <h1>Learn</h1>
        </div>
        {allOpen ? null : (
        <div className="stat-row">
          <TrophyBadge index={progress.leagueIndex} compact />
          <StreakChip progress={progress} />
          <div className="xp-chip" title="Experience points">
            {progress.xp} XP
          </div>
        </div>
        )}
      </header>
      {allOpen ? (
        <p className="login-hint">
          Staff preview. Every section is open. Playing a lesson does not add
          XP or change student progress.
        </p>
      ) : null}
      <div className="section-list">
        {topics.map((topic, index) => {
          const unlocked = allOpen || isTopicUnlocked(index, progress, counts);
          const meter = topicMeter(topic, progress, counts);
          const skipReady = !allOpen && skipTopic && index === firstLockedIndex;
          return (
            <SectionCard
              key={topic.id}
              kicker={`Section ${index + 1}`}
              title={topic.name}
              blurb={topic.blurb}
              index={index + 1}
              unlocked={unlocked}
              meter={meter}
              current={index === currentIndex}
              skipReady={skipReady}
              onOpen={() => setSection(topic.id)}
              onJump={() => setEventOpen(true)}
            />
          );
        })}
        <SectionCard
          kicker="Exam practice"
          title="Past year papers"
          blurb={
            pastPapers.length
              ? `${pastPapers.length} ${pastPapers.length === 1 ? "paper" : "papers"} ready to sit.`
              : "Question bank coming soon. Open this section when it is in."
          }
          index={topics.length + 1}
          badge="PY"
          unlocked
          meter={{
            done: pastPapers.filter((p) => progress.completed?.includes(p.id))
              .length,
            total: Math.max(pastPapers.length, 1),
            pct: pastPapers.length
              ? Math.round(
                  (100 *
                    pastPapers.filter((p) =>
                      progress.completed?.includes(p.id)
                    ).length) /
                    pastPapers.length
                )
              : 0,
          }}
          current={false}
          skipReady={false}
          onOpen={() => setSection("papers")}
          onJump={() => setSection("papers")}
        />
      </div>
      {skipSheet}
    </div>
  );
}
