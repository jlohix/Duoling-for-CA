import { useState } from "react";
import { DIFFICULTIES, lessonKey } from "../data/topics";
import { LAPLACE_LABS } from "../section5";
import { SECTION2_LABS } from "../section2/index.jsx";
import { SECTION3_LABS } from "../section3/index.jsx";
import { SECTION4_LABS } from "../section4/index.jsx";
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
  showMeter = true,
  onOpen,
  onJump,
}) {
  const cta = !showMeter
    ? "Open"
    : !unlocked
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
        {showMeter && unlocked ? (
          <div className="section-meter">
            <div className="meter">
              <div className="meter-fill" style={{ width: `${meter.pct}%` }} />
            </div>
            <span className="section-pct">{meter.pct}%</span>
            <span className="section-trophy" aria-hidden="true">
              🏆
            </span>
          </div>
        ) : showMeter ? (
          <p className="section-lock-meta">
            🔒 {meter.total} {meter.total === 1 ? "unit" : "units"}
          </p>
        ) : null}
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
      <button type="button" className={`node ${off}`} disabled={!unlocked} onClick={labs.onBranchLab}>
        <span className="node-icon">÷∥</span>
        <span className="node-name">Branch dividers</span>
        <span className="node-count">10 Qs</span>
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

function SectionWalks({ labs, unlocked, onOpen }) {
  const off = unlocked ? "" : "off";
  return (
    <>
      {labs.map((lab) => (
        <button
          key={lab.id}
          type="button"
          className={`node ${off}`}
          disabled={!unlocked}
          onClick={() => onOpen(lab.id)}
        >
          <span className="node-icon">{lab.icon}</span>
          <span className="node-name">{lab.title}</span>
          <span className="node-count">{lab.count}</span>
        </button>
      ))}
    </>
  );
}

const SECTION_LAB_LISTS = {
  2: SECTION2_LABS,
  3: SECTION3_LABS,
  4: SECTION4_LABS,
};

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
  onLaplaceLab,
  onSectionWalk,
  labs,
  allOpen = false,
}) {
  const firstAvailable = DIFFICULTIES.find(
    (d) => (counts[lessonKey(topic.id, d.id)] || 0) > 0
  );
  const showLawsLabs = topic.id === 1;
  const showLaplaceWalks = topic.id === 5;
  const sectionWalks = SECTION_LAB_LISTS[topic.id];
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
      {allOpen ? null : (
        <TopicInsight insight={topicInsight(progress, topic.id)} compact />
      )}
      <ol className="path ladder-path">
        <li className={`unit ${unlocked ? "" : "locked"} ${isSkipTarget ? "skip-ready" : ""}`}>
          <div className="nodes">
            {showLawsLabs ? <LawsLabs unlocked={unlocked} labs={labs} /> : null}
            {sectionWalks ? (
              <SectionWalks
                labs={sectionWalks}
                unlocked={unlocked}
                onOpen={(id) => onSectionWalk(topic.id, id)}
              />
            ) : null}
            {showLaplaceWalks ? (
              <LaplaceLabs unlocked={unlocked} onLaplaceLab={onLaplaceLab} />
            ) : null}
            {showLawsLabs || showLaplaceWalks || sectionWalks ? (
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
  onBranchLab,
  onPowerLab,
  onMaxPowerLab,
  onDcLab,
  onInvOpAmp,
  onNonInvOpAmp,
  onLaplaceLab,
  onSectionWalk,
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

  if (section === "labs") {
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
            <p className="eyebrow">Try it</p>
            <h1>Try-it labs</h1>
          </div>
        </header>
        <p className="login-hint">
          No XP. DC capacitors and inductors.
        </p>
        <ol className="path ladder-path">
          <li className="unit lab-unit">
            <div className="nodes">
              <button type="button" className="node" onClick={onDcLab}>
                <span className="node-icon">DC</span>
                <span className="node-name">C and L</span>
                <span className="node-count">4 Qs</span>
              </button>
            </div>
          </li>
        </ol>
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
            onLaplaceLab={onLaplaceLab}
            onSectionWalk={onSectionWalk}
            labs={{
              onLab,
              onDividerLab,
              onBranchLab,
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
        <SectionCard
          kicker="Try it"
          title="Try-it labs"
          blurb="DC C and L."
          index={0}
          badge="★"
          unlocked
          showMeter={!allOpen}
          meter={{ done: 0, total: 1, pct: 0 }}
          current
          skipReady={false}
          onOpen={() => setSection("labs")}
          onJump={() => setSection("labs")}
        />
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
              showMeter={!allOpen}
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
          showMeter={!allOpen}
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
