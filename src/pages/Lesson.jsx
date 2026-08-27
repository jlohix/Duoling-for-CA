import { useMemo, useState } from "react";
import { questionsForLesson, isAnswerCorrect } from "../data/loadQuestions";
import { DIFFICULTIES, TOPICS, lessonKey } from "../data/topics";
import { addXp, completeLesson, visibleStreak, wouldExtendStreak, xpForCorrect, xpForLessonBonus, recordFirstTry } from "../state/progress";
import { useQuizQueue } from "../hooks/useQuizQueue";
import QuestionCard from "../components/QuestionCard";
import ReviewGate from "../components/ReviewGate";
import StreakChip from "../components/StreakChip";
import FeedbackBanner from "../components/FeedbackBanner";
import CloseWarning from "../components/CloseWarning";
import ThemeSwitch from "../components/ThemeSwitch";
import HintControl from "../components/HintControl";
import LessonWarmup from "../components/LessonWarmup";

export default function Lesson({
  allQuestions,
  topicId,
  difficulty,
  progress,
  setProgress,
  onExit,
  onFinished,
}) {
  const key = lessonKey(topicId, difficulty);
  const alreadyDone = Boolean(progress.completed?.includes(key));
  const xpEach = alreadyDone ? 0 : xpForCorrect(difficulty);
  const xpBonus = alreadyDone ? 0 : xpForLessonBonus(difficulty);

  const initial = useMemo(
    () => questionsForLesson(allQuestions, topicId, difficulty),
    [allQuestions, topicId, difficulty]
  );
  const quiz = useQuizQueue(initial, xpEach);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [stage, setStage] = useState("teach");

  const topic = TOPICS.find((t) => t.id === topicId);
  const diff = DIFFICULTIES.find((d) => d.id === difficulty);

  if (stage === "teach") {
    return (
      <LessonWarmup
        topic={topic}
        difficulty={difficulty}
        difficultyName={diff?.name}
        bankCount={initial.length}
        onReady={() => setStage("quiz")}
        onExit={onExit}
      />
    );
  }

  function finish() {
    const grew = wouldExtendStreak(progress);
    const streakFrom = visibleStreak(progress);
    let next = progress;
    setProgress((p) => {
      next = completeLesson(p, key, xpBonus);
      return next;
    });
    onFinished({
      status: "complete",
      correct: quiz.firstPassCorrect,
      total: quiz.originalTotal,
      xpGained: quiz.xpGained + xpBonus,
      streak: visibleStreak(next),
      streakFrom,
      streakGrew: grew,
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
        {topic?.name} · {diff?.name} · {quiz.index + 1}/{quiz.queueLength}
        {xpEach ? ` · +${xpEach} XP` : " · practice"}
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
            <div className="quiz-actions">
              <HintControl question={quiz.question} />
              <button
                type="button"
                className="primary check"
                disabled={!quiz.selected}
                onClick={() =>
                  quiz.check(({ ok, firstTry, awardXp, question }) => {
                    setProgress((p) => {
                      let next = p;
                      if (awardXp && xpEach) next = addXp(next, xpEach);
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
              willRepeat={
                !isAnswerCorrect(quiz.question, quiz.selected) &&
                quiz.index < quiz.originalTotal
              }
              onContinue={continueLesson}
            />
          )}
        </>
      )}
      <CloseWarning
        open={leaveOpen}
        onStay={() => setLeaveOpen(false)}
        onLeave={onExit}
      />
    </div>
  );
}
