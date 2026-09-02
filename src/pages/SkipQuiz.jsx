import { useMemo, useState } from "react";
import { questionsForSkip, isAnswerCorrect } from "../data/loadQuestions";
import { TOPICS } from "../data/topics";
import {
  XP_CORRECT,
  SKIP_QUIZ_SIZE,
  SKIP_PASS_RATIO,
  addXp,
  unlockTopicBySkip,
  visibleStreak,
  wouldExtendStreak,
  recordFirstTry,
} from "../state/progress";
import { useQuizQueue } from "../hooks/useQuizQueue";
import QuestionCard from "../components/QuestionCard";
import FeedbackBanner from "../components/FeedbackBanner";
import CloseWarning from "../components/CloseWarning";
import ThemeSwitch from "../components/ThemeSwitch";
import HintControl from "../components/HintControl";
import StreakChip from "../components/StreakChip";

function SkipFail({ topicName, misses, needed, total, onRetry, onHome }) {
  return (
    <div className="page results">
      <header className="topbar">
        <h1>Skip not unlocked</h1>
        <ThemeSwitch />
      </header>
      <p className="skip-result">
        {topicName} stays locked. You got {misses} wrong. A skip needs{" "}
        {needed}/{total} correct on the first try, so one miss is the limit.
      </p>
      <p>Try the earlier lessons, then take the skip again.</p>
      <div className="opamp-nav">
        <button type="button" className="ghost" onClick={onHome}>
          Back to Learn
        </button>
        <button type="button" className="primary" onClick={onRetry}>
          Try skip again
        </button>
      </div>
    </div>
  );
}

function SkipRound({
  allQuestions,
  targetTopicId,
  progress,
  setProgress,
  onExit,
  onFinished,
  onFail,
}) {
  const initial = useMemo(
    () => questionsForSkip(allQuestions, targetTopicId, SKIP_QUIZ_SIZE),
    [allQuestions, targetTopicId]
  );
  const quiz = useQuizQueue(initial, XP_CORRECT, { recycleMissed: false });
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [firstMisses, setFirstMisses] = useState(0);

  const target = TOPICS.find((t) => t.id === targetTopicId);
  const sourceNames = TOPICS.filter((t) => t.id < targetTopicId)
    .map((t) => t.name)
    .join(", ");
  const needed = Math.max(1, Math.ceil(quiz.originalTotal * SKIP_PASS_RATIO));
  const allowedMisses = Math.max(0, quiz.originalTotal - needed);
  const skipFailed = firstMisses > allowedMisses;

  function finishPass() {
    const grew = wouldExtendStreak(progress);
    const streakFrom = visibleStreak(progress);
    let next = progress;
    setProgress((p) => {
      next = unlockTopicBySkip(p, targetTopicId);
      return next;
    });
    onFinished({
      kind: "skip",
      passed: true,
      correct: quiz.firstPassCorrect,
      total: quiz.originalTotal,
      needed,
      xpGained: quiz.xpGained + 20,
      streak: visibleStreak(next),
      streakFrom,
      streakGrew: grew,
      topicName: target?.name,
      difficultyName: "Skip quiz",
    });
  }

  function continueQuiz() {
    if (skipFailed) {
      onFail({
        misses: firstMisses,
        needed,
        total: quiz.originalTotal,
        topicName: target?.name,
      });
      return;
    }
    const { done } = quiz.goNext();
    if (done) {
      if (quiz.firstPassCorrect >= needed) finishPass();
      else
        onFail({
          misses: firstMisses,
          needed,
          total: quiz.originalTotal,
          topicName: target?.name,
        });
    }
  }

  if (!quiz.question) {
    return (
      <div className="page">
        <p>Not enough earlier questions for a skip quiz.</p>
        <button type="button" className="primary" onClick={onExit}>
          Back
        </button>
      </div>
    );
  }

  const meter = quiz.originalTotal
    ? ((quiz.index + (quiz.revealed ? 1 : 0)) / quiz.originalTotal) * 100
    : 0;

  return (
    <div className="page lesson">
      <header className="lesson-bar">
        <button type="button" className="ghost" onClick={() => setLeaveOpen(true)}>
          Close
        </button>
        <div className="meter">
          <div className="meter-fill" style={{ width: `${meter}%` }} />
        </div>
        <StreakChip progress={progress} />
        <ThemeSwitch compact />
      </header>
      <p className="lesson-meta">
        Skip to {target?.name} · Get {needed}/{quiz.originalTotal} first try ·{" "}
        {quiz.index + 1}/{quiz.originalTotal}
      </p>
      <p className="skip-sources">From: {sourceNames}</p>
      <QuestionCard
        question={quiz.question}
        selected={quiz.selected}
        revealed={quiz.revealed}
        onSelect={quiz.setSelected}
      />
      {!quiz.revealed ? (
        <div className="quiz-actions">
          <HintControl question={quiz.question} />
          <button
            type="button"
            className="primary check"
            disabled={!quiz.selected}
            onClick={() =>
              quiz.check(({ ok, firstTry, awardXp, question }) => {
                if (firstTry && !ok) setFirstMisses((n) => n + 1);
                setProgress((p) => {
                  let next = p;
                  if (awardXp) next = addXp(next, XP_CORRECT);
                  if (firstTry)
                    next = recordFirstTry(next, question.topicId, ok);
                  return next;
                });
              })
            }
          >
            Check
          </button>
        </div>
      ) : (
        <FeedbackBanner
          correct={isAnswerCorrect(quiz.question, quiz.selected)}
          explanation={quiz.question.explanation}
          willRepeat={false}
          failOut={skipFailed}
          onContinue={continueQuiz}
        />
      )}
      <CloseWarning
        open={leaveOpen}
        onStay={() => setLeaveOpen(false)}
        onLeave={onExit}
      />
    </div>
  );
}

export default function SkipQuiz({
  allQuestions,
  targetTopicId,
  progress,
  setProgress,
  onExit,
  onFinished,
}) {
  const [runId, setRunId] = useState(0);
  const [fail, setFail] = useState(null);

  if (fail) {
    return (
      <SkipFail
        topicName={fail.topicName}
        misses={fail.misses}
        needed={fail.needed}
        total={fail.total}
        onHome={onExit}
        onRetry={() => {
          setFail(null);
          setRunId((n) => n + 1);
        }}
      />
    );
  }

  return (
    <SkipRound
      key={runId}
      allQuestions={allQuestions}
      targetTopicId={targetTopicId}
      progress={progress}
      setProgress={setProgress}
      onExit={onExit}
      onFinished={onFinished}
      onFail={setFail}
    />
  );
}
