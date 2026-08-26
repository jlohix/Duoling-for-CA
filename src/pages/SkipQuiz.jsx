import { useMemo } from "react";
import { questionsForSkip, isAnswerCorrect } from "../data/loadQuestions";
import { TOPICS } from "../data/topics";
import {
  XP_CORRECT,
  SKIP_QUIZ_SIZE,
  SKIP_PASS_RATIO,
  addXp,
  unlockTopicBySkip,
  visibleStreak,
} from "../state/progress";
import { useQuizQueue } from "../hooks/useQuizQueue";
import QuestionCard from "../components/QuestionCard";
import ReviewGate from "../components/ReviewGate";
import StreakChip from "../components/StreakChip";
import FeedbackBanner from "../components/FeedbackBanner";

export default function SkipQuiz({
  allQuestions,
  targetTopicId,
  progress,
  setProgress,
  onExit,
  onFinished,
}) {
  const initial = useMemo(
    () => questionsForSkip(allQuestions, targetTopicId, SKIP_QUIZ_SIZE),
    [allQuestions, targetTopicId]
  );
  const quiz = useQuizQueue(initial);

  const target = TOPICS.find((t) => t.id === targetTopicId);
  const sourceNames = TOPICS.filter((t) => t.id < targetTopicId)
    .map((t) => t.name)
    .join(", ");
  const needed = Math.max(1, Math.ceil(quiz.originalTotal * SKIP_PASS_RATIO));

  function finish() {
    const passed = quiz.firstPassCorrect >= needed;
    let next = progress;
    if (passed) {
      setProgress((p) => {
        next = unlockTopicBySkip(p, targetTopicId);
        return next;
      });
    }
    onFinished({
      kind: "skip",
      passed,
      correct: quiz.firstPassCorrect,
      total: quiz.originalTotal,
      needed,
      xpGained: passed ? quiz.xpGained + 20 : quiz.xpGained,
      streak: visibleStreak(next),
      topicName: target?.name,
      difficultyName: "Skip quiz",
    });
  }

  function continueQuiz() {
    const { done } = quiz.goNext();
    if (done) finish();
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
    ? (quiz.solvedCount / quiz.originalTotal) * 100
    : 0;

  return (
    <div className="page lesson">
      <header className="lesson-bar">
        <button type="button" className="ghost" onClick={onExit}>
          Close
        </button>
        <div className="meter">
          <div className="meter-fill" style={{ width: `${meter}%` }} />
        </div>
        <StreakChip progress={progress} />
      </header>
      <p className="lesson-meta">
        Skip to {target?.name} · Get {needed}/{quiz.originalTotal} first try ·{" "}
        {quiz.index + 1}/{quiz.queueLength}
      </p>
      <p className="skip-sources">From: {sourceNames}</p>
      {quiz.reviewOpen ? (
        <ReviewGate count={quiz.reviewCount} onContinue={quiz.startReview} />
      ) : (
        <>
          <QuestionCard
            question={quiz.question}
            selected={quiz.selected}
            revealed={quiz.revealed}
            onSelect={quiz.setSelected}
          />
          {!quiz.revealed ? (
            <button
              type="button"
              className="primary check"
              disabled={!quiz.selected}
              onClick={() =>
                quiz.check(() => setProgress((p) => addXp(p, XP_CORRECT)))
              }
            >
              Check
            </button>
          ) : (
            <FeedbackBanner
              correct={isAnswerCorrect(quiz.question, quiz.selected)}
              explanation={quiz.question.explanation}
              willRepeat={
                !isAnswerCorrect(quiz.question, quiz.selected) &&
                quiz.index < quiz.originalTotal
              }
              onContinue={continueQuiz}
            />
          )}
        </>
      )}
    </div>
  );
}
