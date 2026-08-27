import { useEffect, useMemo, useState } from "react";
import { loadQuestions } from "./data/loadQuestions";
import { TOPICS, lessonKey } from "./data/topics";
import { loadProgress } from "./state/progress";
import { skipLeagueDays, syncLeagueSeason } from "./state/league";
import { loadSession, logout, isAdmin } from "./state/auth";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import ProgressPage from "./pages/Progress";
import Leagues from "./pages/Leagues";
import Admin from "./pages/Admin";
import Guide from "./pages/Guide";
import Updates from "./pages/Updates";
import Lesson from "./pages/Lesson";
import SkipQuiz from "./pages/SkipQuiz";
import Results from "./pages/Results";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(() => {
    const loaded = loadProgress();
    const skipKey = "circuito-league-skip-15d";
    try {
      if (!localStorage.getItem(skipKey)) {
        localStorage.setItem(skipKey, "1");
        return skipLeagueDays(loaded, 15).progress;
      }
    } catch {
      /* ignore */
    }
    return syncLeagueSeason(loaded).progress;
  });
  const [screen, setScreen] = useState("home");
  const [lesson, setLesson] = useState(null);
  const [skipTarget, setSkipTarget] = useState(null);
  const [summary, setSummary] = useState(null);
  const [session, setSession] = useState(() => loadSession());

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

  if (!session) {
    return <Login onLogin={setSession} />;
  }

  function handleLogout() {
    logout();
    setSession(null);
    setScreen("home");
  }

  if (isAdmin(session)) {
    const adminNav = [
      "classboard",
      "cohortboard",
      "leagues",
      "guide",
      "updates",
    ].includes(screen)
      ? screen
      : "admin";
    return (
      <AppShell
        nav={adminNav}
        onNav={setScreen}
        user={session}
        progress={progress}
        onLogout={handleLogout}
      >
        {adminNav === "classboard" ? (
          <Leaderboard user={session} progress={progress} mode="class" />
        ) : adminNav === "cohortboard" ? (
          <Leaderboard user={session} progress={progress} mode="cohort" />
        ) : adminNav === "leagues" ? (
          <Leagues
            user={session}
            progress={progress}
            onSkipDays={(days) =>
              setProgress(skipLeagueDays(progress, days).progress)
            }
          />
        ) : adminNav === "guide" ? (
          <Guide />
        ) : adminNav === "updates" ? (
          <Updates canEdit />
        ) : (
          <Admin
            progress={progress}
            setProgress={setProgress}
            counts={counts}
          />
        )}
      </AppShell>
    );
  }

  if (error) {
    if (screen === "guide" || screen === "updates") {
      return (
        <AppShell
          nav={screen}
          onNav={setScreen}
          user={session}
          progress={progress}
          onLogout={handleLogout}
        >
          {screen === "guide" ? <Guide /> : <Updates />}
        </AppShell>
      );
    }
    return (
      <AppShell
        nav="home"
        onNav={setScreen}
        user={session}
        progress={progress}
        onLogout={handleLogout}
      >
        <div className="page">
          <h1>Could not load questions</h1>
          <p>{error}</p>
        </div>
      </AppShell>
    );
  }

  if (!questions.length) {
    if (screen === "guide" || screen === "updates") {
      return (
        <AppShell
          nav={screen}
          onNav={setScreen}
          user={session}
          progress={progress}
          onLogout={handleLogout}
        >
          {screen === "guide" ? <Guide /> : <Updates />}
        </AppShell>
      );
    }
    return (
      <AppShell
        nav="home"
        onNav={setScreen}
        user={session}
        progress={progress}
        onLogout={handleLogout}
      >
        <div className="page">
          <p>Loading question bank…</p>
        </div>
      </AppShell>
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

  let main = (
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

  if (screen === "classboard") {
    main = <Leaderboard user={session} progress={progress} mode="class" />;
  } else if (screen === "cohortboard") {
    main = <Leaderboard user={session} progress={progress} mode="cohort" />;
  } else if (screen === "leagues") {
    main = (
      <Leagues
        user={session}
        progress={progress}
        onSkipDays={(days) =>
          setProgress(skipLeagueDays(progress, days).progress)
        }
      />
    );
  } else if (screen === "profile") {
    main = (
      <Profile
        user={session}
        topics={TOPICS}
        progress={progress}
        onPractice={() => setScreen("home")}
      />
    );
  } else if (screen === "progress") {
    main = (
      <ProgressPage topics={TOPICS} progress={progress} counts={counts} />
    );
  } else if (screen === "guide") {
    main = <Guide />;
  } else if (screen === "updates") {
    main = <Updates />;
  }

  const nav = [
    "classboard",
    "cohortboard",
    "progress",
    "profile",
    "leagues",
    "guide",
    "updates",
  ].includes(screen)
    ? screen
    : "home";

  return (
    <AppShell
      nav={nav}
      onNav={setScreen}
      user={session}
      progress={progress}
      onLogout={handleLogout}
    >
      {main}
    </AppShell>
  );
}
