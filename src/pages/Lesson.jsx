import { useMemo } from "react";
import { questionsForLesson, isAnswerCorrect } from "../data/loadQuestions";
import { DIFFICULTIES, TOPICS, lessonKey } from "../data/topics";
import { addXp, completeLesson, visibleStreak, XP_CORRECT } from "../state/progress";
import { useQuizQueue } from "../hooks/useQuizQueue";
import QuestionCard from "../components/QuestionCard";
import ReviewGate from "../components/ReviewGate";
import StreakChip from "../components/StreakChip";
import FeedbackBanner from "../components/FeedbackBanner";

export default function Lesson({
  allQuestions,
  topicId,
  difficulty,
  progress,
  setProgress,
  onExit,
  onFinished,
}) {
  const initial = useMemo(
    () => questionsForLesson(allQuestions, topicId, difficulty),
    [allQuestions, topicId, difficulty]
  );
  const quiz = useQuizQueue(initial);

  const topic = TOPICS.find((t) => t.id === topicId);
  const diff = DIFFICULTIES.find((d) => d.id === difficulty);

  function finish() {
    let next = progress;
    setProgress((p) => {
      next = completeLesson(p, lessonKey(topicId, difficulty));
      return next;
    });
    onFinished({
      status: "complete",
      correct: quiz.firstPassCorrect,
      total: quiz.originalTotal,
      xpGained: quiz.xpGained + 20,
      streak: visibleStreak(next),
      topicName: topic?.name,
      difficultyName: diff?.name,
    });
  }

  function continueLesson() {
    const { done } = quiz.goNext();
    if (done) finish();
  }

  if (!quiz.question) {
    return (
      <div className="page">
        <p>No usable questions in this lesson.</p>
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
        {topic?.name} · {diff?.name} · {quiz.index + 1}/{quiz.queueLength}
      </p>
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
              onContinue={continueLesson}
            />
          )}
        </>
      )}
    </div>
  );
}
