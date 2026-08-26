import { useEffect, useMemo, useState } from "react";
import { loadQuestions } from "./data/loadQuestions";
import { TOPICS, lessonKey } from "./data/topics";
import { loadProgress } from "./state/progress";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";
import SkipQuiz from "./pages/SkipQuiz";
import Results from "./pages/Results";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(() => loadProgress());
  const [screen, setScreen] = useState("home");
  const [lesson, setLesson] = useState(null);
  const [skipTarget, setSkipTarget] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadQuestions()
      .then(setQuestions)
      .catch((err) => setError(err.message));
  }, []);

  const counts = useMemo(() => {
    const map = {};
    for (const q of questions) {
      const key = lessonKey(q.topicId, q.difficulty);
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }, [questions]);

  if (error) {
    return (
      <div className="page">
        <h1>Could not load questions</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="page">
        <p>Loading question bank…</p>
      </div>
    );
  }

  if (screen === "lesson" && lesson) {
    return (
      <Lesson
        allQuestions={questions}
        topicId={lesson.topicId}
        difficulty={lesson.difficulty}
        progress={progress}
        setProgress={setProgress}
        onExit={() => setScreen("home")}
        onFinished={(result) => {
          setSummary(result);
          setScreen("results");
        }}
      />
    );
  }

  if (screen === "skip" && skipTarget) {
    return (
      <SkipQuiz
        allQuestions={questions}
        targetTopicId={skipTarget}
        progress={progress}
        setProgress={setProgress}
        onExit={() => setScreen("home")}
        onFinished={(result) => {
          setSummary(result);
          setScreen("results");
        }}
      />
    );
  }

  if (screen === "results" && summary) {
    return <Results summary={summary} onHome={() => setScreen("home")} />;
  }

  return (
    <Home
      topics={TOPICS}
      progress={progress}
      counts={counts}
      onStart={(topicId, difficulty) => {
        setLesson({ topicId, difficulty });
        setScreen("lesson");
      }}
      onSkip={(topicId) => {
        setSkipTarget(topicId);
        setScreen("skip");
      }}
    />
  );
}
