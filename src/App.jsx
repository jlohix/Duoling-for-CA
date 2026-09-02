import { useEffect, useMemo, useState } from "react";
import { loadQuestions, groupPastPapers, PAST_YEAR_QUESTIONS } from "./data/loadQuestions";
import { TOPICS, lessonKey } from "./data/topics";
import { THEVENIN_LAB_QUESTIONS, NODAL_LAB_QUESTIONS, MESH_LAB_QUESTIONS, SUPERMESH_LAB_QUESTIONS, SUPERNODE_LAB_QUESTIONS, SUPERPOS_LAB_QUESTIONS, DIVIDER_LAB_QUESTIONS, POWER_LAB_QUESTIONS, MAX_POWER_LAB_QUESTIONS, NORTON_LAB_QUESTIONS, DEPENDENT_LAB_QUESTIONS } from "./data/dragCircuits";
import { THEVENIN_STEPS } from "./data/theveninLab";
import { NODAL_STEPS } from "./data/nodalLab";
import { MESH_STEPS } from "./data/meshLab";
import { SUPERMESH_STEPS } from "./data/superMeshLab";
import { SUPERNODE_STEPS } from "./data/superNodeLab";
import { SUPERPOSITION_STEPS } from "./data/superpositionLab";
import { DIVIDER_STEPS } from "./data/dividerLab";
import { POWER_STEPS } from "./data/powerLab";
import { MAX_POWER_STEPS } from "./data/maxPowerLab";
import { NORTON_STEPS } from "./data/nortonLab";
import { DEPENDENT_STEPS } from "./data/dependentLab";
import TheveninSchematic from "./components/TheveninSchematic";
import NortonSchematic from "./components/NortonSchematic";
import DependentSchematic from "./components/DependentSchematic";
import NodalSchematic from "./components/NodalSchematic";
import MeshSchematic from "./components/MeshSchematic";
import SuperMeshSchematic from "./components/SuperMeshSchematic";
import SuperNodeSchematic from "./components/SuperNodeSchematic";
import SuperpositionSchematic from "./components/SuperpositionSchematic";
import DividerSchematic from "./components/DividerSchematic";
import PowerSchematic from "./components/PowerSchematic";
import MaxPowerSchematic from "./components/MaxPowerSchematic";
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
import DragCircuitLab from "./pages/DragCircuitLab";
import DragDcLab from "./pages/DragDcLab";
import InvertingOpAmpLesson from "./pages/InvertingOpAmpLesson";
import NonInvertingOpAmpLesson from "./pages/NonInvertingOpAmpLesson";
import LaplaceLesson from "./section5/LaplaceLesson";
import Results from "./pages/Results";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(
    () => syncLeagueSeason(loadProgress()).progress
  );
  const [screen, setScreen] = useState("home");
  const [lesson, setLesson] = useState(null);
  const [paperPack, setPaperPack] = useState(null);
  const [skipTarget, setSkipTarget] = useState(null);
  const [laplaceLabId, setLaplaceLabId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [session, setSession] = useState(() => loadSession());

  useEffect(() => {
    loadQuestions()
      .then(setQuestions)
      .catch((err) => setError(err.message));
  }, []);

  const pastPapers = useMemo(
    () => groupPastPapers(PAST_YEAR_QUESTIONS),
    []
  );

  const counts = useMemo(() => {
    const map = {};
    for (const q of questions) {
      const key = lessonKey(q.topicId, q.difficulty);
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }, [questions]);

  if (!session) {
    return (
      <Login
        onLogin={(next) => {
          setSession(next);
          setScreen(isAdmin(next) ? "admin" : "home");
        }}
      />
    );
  }

  function handleLogout() {
    logout();
    setSession(null);
    setScreen("home");
  }

  const previewing =
    isAdmin(session) &&
    [
      "home",
      "lesson",
      "skip",
      "results",
      "draglab",
      "dragthevlab",
      "dragnortonlab",
      "dragdeplab",
      "dragnodallab",
      "dragmeshlab",
      "dragsuperlab",
      "dragsnlab",
      "dragsuperposlab",
      "dragdivlab",
      "dragpowerlab",
      "dragmptlab",
      "dragdclab",
      "invopamp",
      "ninvopamp",
      "laplacelab",
      "paper",
    ].includes(screen);

  if (isAdmin(session) && !previewing) {
    const adminNav = [
      "classboard",
      "cohortboard",
      "individualboard",
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
        ) : adminNav === "individualboard" ? (
          <Leaderboard user={session} progress={progress} mode="individual" />
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

  const boardScreens = ["classboard", "cohortboard", "individualboard", "leagues", "profile", "guide", "updates"];

  if (error) {
    if (boardScreens.includes(screen)) {
      return (
        <AppShell
          nav={screen}
          onNav={setScreen}
          user={session}
          progress={progress}
          onLogout={handleLogout}
        >
          {screen === "classboard" ? (
            <Leaderboard user={session} progress={progress} mode="class" />
          ) : screen === "cohortboard" ? (
            <Leaderboard user={session} progress={progress} mode="cohort" />
          ) : screen === "individualboard" ? (
            <Leaderboard user={session} progress={progress} mode="individual" />
          ) : screen === "leagues" ? (
            <Leagues user={session} progress={progress} />
          ) : screen === "profile" ? (
            <Profile
              user={session}
              topics={TOPICS}
              progress={progress}
              setProgress={setProgress}
              onPractice={() => setScreen("home")}
            />
          ) : screen === "guide" ? (
            <Guide />
          ) : (
            <Updates />
          )}
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
    if (boardScreens.includes(screen)) {
      return (
        <AppShell
          nav={screen}
          onNav={setScreen}
          user={session}
          progress={progress}
          onLogout={handleLogout}
        >
          {screen === "classboard" ? (
            <Leaderboard user={session} progress={progress} mode="class" />
          ) : screen === "cohortboard" ? (
            <Leaderboard user={session} progress={progress} mode="cohort" />
          ) : screen === "individualboard" ? (
            <Leaderboard user={session} progress={progress} mode="individual" />
          ) : screen === "leagues" ? (
            <Leagues user={session} progress={progress} />
          ) : screen === "profile" ? (
            <Profile
              user={session}
              topics={TOPICS}
              progress={progress}
              setProgress={setProgress}
              onPractice={() => setScreen("home")}
            />
          ) : screen === "guide" ? (
            <Guide />
          ) : (
            <Updates />
          )}
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

  if (screen === "draglab") {
    return <DragCircuitLab onExit={() => setScreen("home")} />;
  }

  if (screen === "dragthevlab") {
    return (
      <DragCircuitLab
        onExit={() => setScreen("home")}
        questions={THEVENIN_LAB_QUESTIONS}
        walkthrough={{
          title: "Thevenin",
          steps: THEVENIN_STEPS,
          Schematic: TheveninSchematic,
        }}
      />
    );
  }

  if (screen === "dragnortonlab") {
    return (
      <DragCircuitLab
        onExit={() => setScreen("home")}
        questions={NORTON_LAB_QUESTIONS}
        walkthrough={{
          title: "Norton",
          steps: NORTON_STEPS,
          Schematic: NortonSchematic,
        }}
      />
    );
  }

  if (screen === "dragdeplab") {
    return (
      <DragCircuitLab
        onExit={() => setScreen("home")}
        questions={DEPENDENT_LAB_QUESTIONS}
        walkthrough={{
          title: "Dependent sources",
          steps: DEPENDENT_STEPS,
          Schematic: DependentSchematic,
        }}
      />
    );
  }

  if (screen === "dragnodallab") {
    return (
      <DragCircuitLab
        onExit={() => setScreen("home")}
        questions={NODAL_LAB_QUESTIONS}
        walkthrough={{
          title: "Nodal",
          steps: NODAL_STEPS,
          Schematic: NodalSchematic,
        }}
      />
    );
  }

  if (screen === "dragmeshlab") {
    return (
      <DragCircuitLab
        onExit={() => setScreen("home")}
        questions={MESH_LAB_QUESTIONS}
        walkthrough={{
          title: "Mesh",
          steps: MESH_STEPS,
          Schematic: MeshSchematic,
        }}
      />
    );
  }

  if (screen === "dragsuperlab") {
    return (
      <DragCircuitLab
        onExit={() => setScreen("home")}
        questions={SUPERMESH_LAB_QUESTIONS}
        walkthrough={{
          title: "Supermesh",
          steps: SUPERMESH_STEPS,
          Schematic: SuperMeshSchematic,
        }}
      />
    );
  }

  if (screen === "dragsnlab") {
    return (
      <DragCircuitLab
        onExit={() => setScreen("home")}
        questions={SUPERNODE_LAB_QUESTIONS}
        walkthrough={{
          title: "Supernode",
          steps: SUPERNODE_STEPS,
          Schematic: SuperNodeSchematic,
        }}
      />
    );
  }

  if (screen === "dragsuperposlab") {
    return (
      <DragCircuitLab
        onExit={() => setScreen("home")}
        questions={SUPERPOS_LAB_QUESTIONS}
        walkthrough={{
          title: "Superposition",
          steps: SUPERPOSITION_STEPS,
          Schematic: SuperpositionSchematic,
        }}
      />
    );
  }

  if (screen === "dragdivlab") {
    return (
      <DragCircuitLab
        onExit={() => setScreen("home")}
        questions={DIVIDER_LAB_QUESTIONS}
        walkthrough={{
          title: "Dividers",
          steps: DIVIDER_STEPS,
          Schematic: DividerSchematic,
        }}
      />
    );
  }

  if (screen === "dragpowerlab") {
    return (
      <DragCircuitLab
        onExit={() => setScreen("home")}
        questions={POWER_LAB_QUESTIONS}
        walkthrough={{
          title: "Power",
          steps: POWER_STEPS,
          Schematic: PowerSchematic,
        }}
      />
    );
  }

  if (screen === "dragmptlab") {
    return (
      <DragCircuitLab
        onExit={() => setScreen("home")}
        questions={MAX_POWER_LAB_QUESTIONS}
        walkthrough={{
          title: "Max power",
          steps: MAX_POWER_STEPS,
          Schematic: MaxPowerSchematic,
        }}
      />
    );
  }

  if (screen === "dragdclab") {
    return <DragDcLab onExit={() => setScreen("home")} />;
  }

  if (screen === "invopamp") {
    return <InvertingOpAmpLesson onExit={() => setScreen("home")} />;
  }

  if (screen === "ninvopamp") {
    return <NonInvertingOpAmpLesson onExit={() => setScreen("home")} />;
  }

  if (screen === "laplacelab" && laplaceLabId) {
    return (
      <LaplaceLesson
        key={laplaceLabId}
        labId={laplaceLabId}
        onExit={() => {
          setLaplaceLabId(null);
          setScreen("home");
        }}
        onContinue={(id) => setLaplaceLabId(id)}
      />
    );
  }

  if (screen === "paper" && paperPack) {
    return (
      <Lesson
        allQuestions={paperPack.questions}
        pack={paperPack}
        progress={progress}
        setProgress={setProgress}
        preview={isAdmin(session)}
        onExit={() => {
          setPaperPack(null);
          setScreen("home");
        }}
        onFinished={(result) => {
          setPaperPack(null);
          setSummary(result);
          setScreen("results");
        }}
      />
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
        preview={isAdmin(session)}
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
      pastPapers={pastPapers}
      onStart={(topicId, difficulty) => {
        setLesson({ topicId, difficulty });
        setScreen("lesson");
      }}
      onStartPaper={(pack) => {
        setPaperPack(pack);
        setScreen("paper");
      }}
      onSkip={(topicId) => {
        setSkipTarget(topicId);
        setScreen("skip");
      }}
      onLab={() => setScreen("draglab")}
      onThevLab={() => setScreen("dragthevlab")}
      onNortonLab={() => setScreen("dragnortonlab")}
      onDepLab={() => setScreen("dragdeplab")}
      onNodalLab={() => setScreen("dragnodallab")}
      onMeshLab={() => setScreen("dragmeshlab")}
      onSuperMeshLab={() => setScreen("dragsuperlab")}
      onSuperNodeLab={() => setScreen("dragsnlab")}
      onSuperposLab={() => setScreen("dragsuperposlab")}
      onDividerLab={() => setScreen("dragdivlab")}
      onPowerLab={() => setScreen("dragpowerlab")}
      onMaxPowerLab={() => setScreen("dragmptlab")}
      onDcLab={() => setScreen("dragdclab")}
      onInvOpAmp={() => setScreen("invopamp")}
      onNonInvOpAmp={() => setScreen("ninvopamp")}
      onLaplaceLab={(id) => {
        setLaplaceLabId(id);
        setScreen("laplacelab");
      }}
      allOpen={isAdmin(session)}
    />
  );

  if (screen === "classboard") {
    main = <Leaderboard user={session} progress={progress} mode="class" />;
  } else if (screen === "cohortboard") {
    main = <Leaderboard user={session} progress={progress} mode="cohort" />;
  } else if (screen === "individualboard") {
    main = <Leaderboard user={session} progress={progress} mode="individual" />;
  } else if (screen === "leagues") {
    main = <Leagues user={session} progress={progress} />;
  } else if (screen === "profile") {
    main = (
      <Profile
        user={session}
        topics={TOPICS}
        progress={progress}
        setProgress={setProgress}
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
    "individualboard",
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
