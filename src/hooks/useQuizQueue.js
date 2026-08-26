import { useState } from "react";
import { isAnswerCorrect } from "../data/loadQuestions";
import { XP_CORRECT } from "../state/progress";

export function useQuizQueue(initialQuestions) {
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

  function check(onXp) {
    if (!selected || revealed || !question) return;
    const ok = isAnswerCorrect(question, selected);
    const firstTry = !attemptedIds.has(question.id);
    setAttemptedIds((ids) => new Set(ids).add(question.id));
    setRevealed(true);
    if (!ok) return;
    if (firstTry) setFirstPassCorrect((n) => n + 1);
    if (!solvedIds.has(question.id)) {
      setSolvedIds((ids) => new Set(ids).add(question.id));
      setXpGained((n) => n + XP_CORRECT);
      onXp?.();
    }
  }

  function goNext() {
    if (!question) return { done: true };
    const ok = isAnswerCorrect(question, selected);
    const nextQueue = ok ? queue : [...queue, question];
    if (!ok) setQueue(nextQueue);
    if (index + 1 >= nextQueue.length) {
      return { done: true };
    }
    const enteringReview =
      index + 1 === originalTotal && nextQueue.length > originalTotal;
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
