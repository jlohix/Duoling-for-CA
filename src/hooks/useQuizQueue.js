import { useState } from "react";
import { isAnswerCorrect } from "../data/loadQuestions";
import { XP_CORRECT } from "../state/progress";

export function useQuizQueue(
  initialQuestions,
  xpPerCorrect = XP_CORRECT,
  options = {}
) {
  const recycleMissed = options.recycleMissed !== false;
  const [queue, setQueue] = useState(initialQuestions);
  const originalTotal = initialQuestions.length;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [solvedIds, setSolvedIds] = useState(() => new Set());
  const [attemptedIds, setAttemptedIds] = useState(() => new Set());
  const [firstPassCorrect, setFirstPassCorrect] = useState(0);
  const [xpGained, setXpGained] = useState(0);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);

  const question = queue[index];

  function check(onOutcome) {
    if (!selected || revealed || !question) return;
    const ok = isAnswerCorrect(question, selected);
    const firstTry = !attemptedIds.has(question.id);
    const awardXp = ok && !solvedIds.has(question.id);
    setAttemptedIds((ids) => new Set(ids).add(question.id));
    setRevealed(true);
    if (firstTry && ok) setFirstPassCorrect((n) => n + 1);
    if (awardXp) {
      setSolvedIds((ids) => new Set(ids).add(question.id));
      setXpGained((n) => n + xpPerCorrect);
    }
    onOutcome?.({ ok, firstTry, awardXp, question });
  }

  function goNext() {
    if (!question) return { done: true };
    const ok = isAnswerCorrect(question, selected);
    const nextQueue =
      recycleMissed && !ok ? [...queue, question] : queue;
    if (recycleMissed && !ok) setQueue(nextQueue);
    if (index + 1 >= nextQueue.length) {
      return { done: true };
    }
    const enteringReview =
      recycleMissed &&
      index + 1 === originalTotal &&
      nextQueue.length > originalTotal;
    setSelected("");
    setRevealed(false);
    if (enteringReview) {
      setReviewCount(nextQueue.length - originalTotal);
      setReviewOpen(true);
      return { done: false };
    }
    setIndex((i) => i + 1);
    return { done: false };
  }

  function startReview() {
    setReviewOpen(false);
    setIndex((i) => i + 1);
    setSelected("");
    setRevealed(false);
  }

  return {
    question,
    index,
    queueLength: queue.length,
    originalTotal,
    selected,
    setSelected,
    revealed,
    solvedCount: solvedIds.size,
    firstPassCorrect,
    xpGained,
    reviewOpen,
    reviewCount,
    check,
    goNext,
    startReview,
  };
}
