import Papa from "papaparse";

const LETTERS = ["a", "b", "c", "d"];

function clean(value) {
  return String(value ?? "").trim();
}

function normalizeImage(url) {
  const src = clean(url);
  if (!src) return "";
  const blob = src.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+?)(?:\?.*)?$/
  );
  if (blob) {
    return `https://raw.githubusercontent.com/${blob[1]}/${blob[2]}/${blob[3]}/${blob[4]}`;
  }
  return src;
}

function parseDifficulty(value) {
  const n = Number(value);
  if (n === 1 || n === 2 || n === 3) return n;
  return 2;
}

export function isAnswerCorrect(question, choice) {
  const letter = clean(choice).toLowerCase();
  const answer = question.answer;
  if (letter === answer) return true;
  const chosen = question.options[letter];
  const correct = question.options[answer];
  return Boolean(chosen && correct && chosen === correct);
}

export async function loadQuestions() {
  const res = await fetch("/QuestionBank.csv");
  if (!res.ok) {
    throw new Error("Could not load QuestionBank.csv");
  }
  const text = await res.text();
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  const questions = [];
  for (const row of parsed.data) {
    const question = clean(row.question);
    const answer = clean(row.answer).toLowerCase();
    if (!question || !LETTERS.includes(answer)) continue;

    const options = {
      a: clean(row.optionA),
      b: clean(row.optionB),
      c: clean(row.optionC),
      d: clean(row.optionD),
    };
    if (!options[answer]) continue;

    questions.push({
      id: clean(row.id) || `${row.topicId}-${questions.length}`,
      topicId: Number(row.topicId),
      question,
      options,
      answer,
      image: normalizeImage(row.image),
      explanation: clean(row.explanation),
      difficulty: parseDifficulty(row.difficulty),
    });
  }
  return questions;
}

function shuffle(list) {
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function questionsForLesson(all, topicId, difficulty) {
  return shuffle(
    all.filter((q) => q.topicId === topicId && q.difficulty === difficulty)
  );
}

export function questionsForSkip(all, targetTopicId, count = 5) {
  const pool = all.filter((q) => q.topicId < targetTopicId);
  const byTopic = new Map();
  for (const q of shuffle(pool)) {
    if (!byTopic.has(q.topicId)) byTopic.set(q.topicId, []);
    byTopic.get(q.topicId).push(q);
  }
  const picked = [];
  const topics = [...byTopic.keys()];
  while (picked.length < count) {
    let added = false;
    for (const topicId of topics) {
      const list = byTopic.get(topicId);
      if (list.length) {
        picked.push(list.shift());
        added = true;
        if (picked.length >= count) break;
      }
    }
    if (!added) break;
  }
  return picked;
}
