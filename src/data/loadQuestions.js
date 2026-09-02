import Papa from "papaparse";
import pastYearCsv from "./pastYearPapers.csv?raw";

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

function parseAnswerLetter(value) {
  const raw = clean(value).toLowerCase();
  if (LETTERS.includes(raw)) return raw;
  const opt = raw.match(/^option\s*([abcd])$/);
  if (opt) return opt[1];
  return "";
}

function cell(row, ...names) {
  for (const name of names) {
    if (row[name] != null && String(row[name]).trim()) return row[name];
    const hit = Object.keys(row).find(
      (key) => key.toLowerCase() === name.toLowerCase()
    );
    if (hit && String(row[hit]).trim()) return row[hit];
  }
  return "";
}

function paperFromImage(url) {
  const file = String(url).split("/").pop() || "";
  const match = file.match(/^(\d{2})(\d{2})(s[12])?/i);
  if (!match) return "";
  const sem = match[3] ? ` ${match[3].toUpperCase()}` : "";
  return `PYP · AY ${match[1]}/${match[2]}${sem}`;
}

function dressLatex(text) {
  const raw = clean(text);
  if (!raw) return raw;
  if (/\$|\\\(|\\\[/.test(raw)) return raw;
  if (/\\frac|\\mathrm|\\text|\\left|\\right/.test(raw)) return `$${raw}$`;
  return raw;
}

function parseQuestionRows(text, { withPaper = false } = {}) {
  const parsed = Papa.parse(String(text ?? "").replace(/^\uFEFF/, ""), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => String(h ?? "").replace(/^\uFEFF/, "").trim(),
  });

  const questions = [];
  for (const row of parsed.data) {
    const question = dressLatex(cell(row, "question"));
    const answer = parseAnswerLetter(cell(row, "answer"));
    if (!question || !LETTERS.includes(answer)) continue;

    const options = {
      a: dressLatex(cell(row, "optionA")),
      b: dressLatex(cell(row, "optionB")),
      c: dressLatex(cell(row, "optionC")),
      d: dressLatex(cell(row, "optionD")),
    };
    if (!options[answer]) continue;

    const image = normalizeImage(cell(row, "image"));
    const topicRaw = cell(row, "topicId", "topicid");
    const item = {
      id: clean(cell(row, "id")) || `${topicRaw || "p"}-${questions.length}`,
      topicId: Number(topicRaw) || 0,
      question,
      options,
      answer,
      image,
      explanation: dressLatex(cell(row, "explanation")),
      difficulty: parseDifficulty(cell(row, "difficulty")),
    };
    if (withPaper) {
      item.paper =
        clean(cell(row, "paper", "year")) ||
        paperFromImage(image) ||
        "Past papers";
    }
    questions.push(item);
  }
  return questions;
}

export async function loadQuestions() {
  const res = await fetch("/QuestionBank.csv");
  if (!res.ok) {
    throw new Error("Could not load QuestionBank.csv");
  }
  const text = await res.text();
  return parseQuestionRows(text);
}

export const PAST_YEAR_QUESTIONS = parseQuestionRows(pastYearCsv, {
  withPaper: true,
});

export function loadPastYearQuestions() {
  return Promise.resolve(PAST_YEAR_QUESTIONS);
}

export function groupPastPapers(questions) {
  const map = new Map();
  for (const q of questions) {
    const title = q.paper || "Past papers";
    if (!map.has(title)) map.set(title, []);
    map.get(title).push(q);
  }
  return [...map.entries()].map(([title, list]) => {
    const key = paperKey(title);
    return {
      id: key,
      key,
      title,
      questions: list,
    };
  });
}

function paperKey(title) {
  const slug = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `paper-${slug || "set"}`;
}

export function shuffle(list) {
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
