import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import GlowBackground from "./components/GlowBackground";
import FloatingCapture from "./components/FloatingCapture";
import InstallPrompt from "./components/InstallPrompt";
import LoginGate from "./components/LoginGate";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { seedData } from "./data/seed";
import { useCloudSync } from "./hooks/useCloudSync";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { hasProAccess } from "./utils/proAccess";
import Analytics from "./pages/Analytics";
import Assistant from "./pages/Assistant";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import Exams from "./pages/Exams";
import Focus from "./pages/Focus";
import Habits from "./pages/Habits";
import Notes from "./pages/Notes";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import StudyPlanner from "./pages/StudyPlanner";
import Tasks from "./pages/Tasks";
import TodayMission from "./pages/TodayMission";
import Tools from "./pages/Tools";

const pageVariants = {
  initial: { opacity: 0, y: 16, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(8px)" }
};

const sections = [
  "Dashboard",
  "Today\u2019s Mission",
  "Tasks",
  "Habits",
  "Subjects",
  "Calendar",
  "Focus Mode",
  "Exams",
  "AI Assistant",
  "Notes",
  "Analytics",
  "Tools",
  "Premium",
  "Settings"
];
const starterContent = {
  tasks: new Set(["Revise organic chemistry mechanisms", "Submit calculus assignment", "Read 20 pages of economics", "Prepare exam flashcards", "Physics: revise current electricity formulas", "Solve 50 mixed MCQs", "Analyze last mock test mistakes", "New serious study task"]),
  habits: new Set(["Morning revision", "No phone study block", "Drink water", "Daily revision block", "Mock test review", "Daily revision habit"]),
  notes: new Set(["Physics insight", "Essay structure", "Weak topics"]),
  events: new Set(["Group study", "Physics lab deadline", "Mock exam"]),
  subjects: new Set(["Physics", "Calculus", "Economics", "Chemistry", "Math"]),
  assignments: new Set(["Calculus worksheet", "Economics case study"]),
  goals: new Set(["Study 20 focused hours this week", "Finish physics revision before mock exam", "Complete 300 MCQs this week", "Finish one full mock analysis"]),
  exams: new Set(["Physics Midterm", "Statistics Quiz", "JEE Main Practice Target", "Full Mock Test"]),
  missionGoals: new Set(["Physics revision", "50 MCQs", "2 Pomodoro sessions"])
};
const emptyWeek = [
  { day: "Mon", hours: 0, tasks: 0, habits: 0 },
  { day: "Tue", hours: 0, tasks: 0, habits: 0 },
  { day: "Wed", hours: 0, tasks: 0, habits: 0 },
  { day: "Thu", hours: 0, tasks: 0, habits: 0 },
  { day: "Fri", hours: 0, tasks: 0, habits: 0 },
  { day: "Sat", hours: 0, tasks: 0, habits: 0 },
  { day: "Sun", hours: 0, tasks: 0, habits: 0 }
];

function normalizeData(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    ...seedData,
    ...source,
    profile: { ...seedData.profile, ...(source.profile || {}) },
    tasks: Array.isArray(source.tasks) ? source.tasks : seedData.tasks,
    habits: Array.isArray(source.habits) ? source.habits : seedData.habits,
    notes: Array.isArray(source.notes) ? source.notes : seedData.notes,
    events: Array.isArray(source.events) ? source.events : seedData.events,
    subjects: Array.isArray(source.subjects) ? source.subjects : seedData.subjects,
    assignments: Array.isArray(source.assignments) ? source.assignments : seedData.assignments,
    goals: Array.isArray(source.goals) ? source.goals : seedData.goals,
    focusSessions: Array.isArray(source.focusSessions) ? source.focusSessions : seedData.focusSessions,
    sessions: Array.isArray(source.sessions) ? source.sessions : seedData.sessions,
    exams: Array.isArray(source.exams) ? source.exams : seedData.exams,
    todayMission: {
      ...seedData.todayMission,
      ...(source.todayMission || {}),
      goals: Array.isArray(source.todayMission?.goals) ? source.todayMission.goals : seedData.todayMission.goals
    },
    gamification: {
      ...seedData.gamification,
      ...(source.gamification || {}),
      badges: Array.isArray(source.gamification?.badges) ? source.gamification.badges : seedData.gamification.badges
    },
    ai: {
      ...seedData.ai,
      ...(source.ai || {}),
      history: Array.isArray(source.ai?.history) ? source.ai.history : seedData.ai.history
    },
    focusStats: { ...seedData.focusStats, ...(source.focusStats || {}) },
    preferences: { ...seedData.preferences, ...(source.preferences || {}) },
    water: Number.isFinite(source.water) ? source.water : seedData.water
  };
}

export default function App() {
  const [storedData, setStoredData] = useLocalStorage("zenora-data-v1", seedData);
  const data = useMemo(() => normalizeData(storedData), [storedData]);
  const setData = useCallback((updater) => {
    setStoredData((current) => {
      const normalized = normalizeData(current);
      const next = typeof updater === "function" ? updater(normalized) : updater;
      return normalizeData(next);
    });
  }, [setStoredData]);
  const [active, setActive] = useState(() => {
    const section = new URLSearchParams(window.location.search).get("section");
    return sections.includes(section) ? section : "Dashboard";
  });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [localAccess, setLocalAccess] = useState(() => sessionStorage.getItem("zenora-local-access") === "true");
  const cloud = useCloudSync(data, setData);
  const proTester = hasProAccess(cloud.user?.email) || data.profile.proOverride || data.profile.plan === "pro";
  const effectiveData = useMemo(() => {
    if (!proTester) return data;
    return {
      ...data,
      profile: {
        ...data.profile,
        plan: "pro",
        role: "Founder tester"
      }
    };
  }, [data, proTester]);

  useEffect(() => {
    if (!hasProAccess(cloud.user?.email) || data.profile.plan === "pro") return;
    setData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        plan: "pro",
        role: "Founder tester"
      }
    }));
  }, [cloud.user?.email, data.profile.plan, setData]);

  useEffect(() => {
    if (data.preferences.defaultsCleared) return;
    setData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        name: current.profile.name === "Aarav" ? "Student" : current.profile.name
      },
      tasks: current.tasks.filter((item) => !starterContent.tasks.has(item.title)),
      habits: current.habits.filter((item) => !starterContent.habits.has(item.name)),
      notes: current.notes.filter((item) => !starterContent.notes.has(item.title)),
      events: current.events.filter((item) => !starterContent.events.has(item.title)),
      subjects: current.subjects.filter((item) => !starterContent.subjects.has(item.name)),
      assignments: current.assignments.filter((item) => !starterContent.assignments.has(item.title)),
      goals: current.goals.filter((item) => !starterContent.goals.has(item.title)),
      exams: current.exams.filter((item) => !starterContent.exams.has(item.name)),
      focusSessions: current.focusStats.sessions === 9 && current.focusStats.minutes === 225 ? [] : current.focusSessions,
      sessions: emptyWeek,
      water: current.water === 5 ? 0 : current.water,
      focusStats: current.focusStats.sessions === 9 && current.focusStats.minutes === 225 ? { sessions: 0, minutes: 0 } : current.focusStats,
      preferences: { ...current.preferences, defaultsCleared: true }
    }));
  }, [data.preferences.defaultsCleared, setData]);

  useEffect(() => {
    if (data.preferences.globalBlankDefaultsV2) return;
    setData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        goal: current.profile.goal === "Crack my target exam with calm consistency" ? seedData.profile.goal : current.profile.goal,
        examGoal: current.profile.examGoal === "JEE Main 2027" ? "" : current.profile.examGoal,
        examType: ["JEE", "NEET", "UPSC", "SSC", "CUET"].includes(current.profile.examType) ? "General" : current.profile.examType
      },
      tasks: current.tasks.filter((item) => !starterContent.tasks.has(item.title)),
      habits: current.habits.filter((item) => !starterContent.habits.has(item.name)),
      notes: current.notes.filter((item) => !starterContent.notes.has(item.title)),
      events: current.events.filter((item) => !starterContent.events.has(item.title)),
      subjects: current.subjects.filter((item) => !starterContent.subjects.has(item.name)),
      goals: current.goals.filter((item) => !starterContent.goals.has(item.title)),
      exams: current.exams.filter((item) => !starterContent.exams.has(item.name)),
      todayMission: {
        ...current.todayMission,
        goals: current.todayMission.goals.filter((item) => !starterContent.missionGoals.has(item.text)),
        mcqTarget: current.todayMission.mcqTarget === 50 ? 0 : current.todayMission.mcqTarget,
        mcqDone: 0,
        revisionTarget: current.todayMission.revisionTarget === "Revise formulas + mistakes" ? "" : current.todayMission.revisionTarget,
        mockTest: current.todayMission.mockTest === "Mock Test at 7 PM" ? "" : current.todayMission.mockTest,
        revisionDone: false,
        mockDone: false
      },
      sessions: emptyWeek,
      focusSessions: current.focusSessions.filter((item) => !["25/5", "Study timer"].includes(item.mode)),
      focusStats: current.focusStats.minutes === 70 || current.focusStats.minutes === 225 ? { sessions: 0, minutes: 0 } : current.focusStats,
      gamification: current.gamification.xp === 220 ? { xp: 0, level: 1, streak: 0, badges: [] } : current.gamification,
      preferences: { ...current.preferences, globalBlankDefaultsV2: true }
    }));
  }, [data.preferences.globalBlankDefaultsV2, setData]);

  useEffect(() => {
    const oldAccents = new Set(["#7c5cff", "#22d3ee", "#f472b6", "#34d399", "#f59e0b"]);
    const oldHabitColors = new Set(["#60a5fa", "#a78bfa", "#22d3ee", "#7dd3fc"]);
    if (!oldAccents.has(data.profile.accent) && !data.habits.some((habit) => oldHabitColors.has(habit.color))) return;

    setData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        accent: oldAccents.has(current.profile.accent) ? "#9b6f43" : current.profile.accent
      },
      habits: current.habits.map((habit, index) => ({
        ...habit,
        color: oldHabitColors.has(habit.color) ? ["#d5b47a", "#9aa77e", "#b8795b"][index % 3] : habit.color
      }))
    }));
  }, [data.habits, data.profile.accent, setData]);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", effectiveData.profile.dark);
    document.documentElement.dataset.theme = effectiveData.profile.theme || "sakura";
    document.documentElement.style.setProperty("--accent", effectiveData.profile.accent);
  }, [effectiveData.profile.dark, effectiveData.profile.theme, effectiveData.profile.accent]);

  useEffect(() => {
    const handler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector("input[placeholder='Search tasks, notes, goals']")?.focus();
      }
      if (event.key === "Escape") setQuery("");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const page = useMemo(() => {
    const props = { data: effectiveData, setData, query };
    return {
      Dashboard: <Dashboard {...props} setActive={setActive} />,
      "Today\u2019s Mission": <TodayMission data={effectiveData} setData={setData} setActive={setActive} />,
      Tasks: <Tasks tasks={effectiveData.tasks} setData={setData} query={query} />,
      Habits: <Habits habits={effectiveData.habits} setData={setData} />,
      Calendar: <Calendar tasks={effectiveData.tasks} setData={setData} data={effectiveData} />,
      "Focus Mode": <Focus data={effectiveData} setData={setData} setActive={setActive} />,
      Notes: <Notes notes={effectiveData.notes} setData={setData} query={query} />,
      Subjects: <StudyPlanner data={effectiveData} setData={setData} />,
      Exams: <Exams data={effectiveData} setData={setData} />,
      "AI Assistant": <Assistant data={effectiveData} setData={setData} setActive={setActive} />,
      Analytics: <Analytics data={effectiveData} />,
      Tools: <Tools data={effectiveData} setData={setData} />,
      Premium: <Pricing setActive={setActive} profile={effectiveData.profile} user={cloud.user} />,
      Settings: <Settings data={effectiveData} profile={effectiveData.profile} preferences={effectiveData.preferences} setData={setData} cloud={cloud} />
    }[active];
  }, [active, effectiveData, query, setData, cloud]);

  return (
    <div className={effectiveData.profile.dark ? "dark" : ""}>
      <GlowBackground />
      {loading && (
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] grid place-items-center bg-obsidian">
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <div className="splash-mark mx-auto mb-5">
              <Sparkles size={28} strokeWidth={2.35} />
            </div>
            <div className="text-3xl font-semibold tracking-tight text-white">ZENORA</div>
            <div className="mt-2 text-sm text-white/42">Assembling your student OS</div>
          </motion.div>
        </motion.div>
      )}
      {!loading && !cloud.user && !localAccess ? (
        <LoginGate
          cloud={cloud}
          onLocalAccess={() => {
            sessionStorage.setItem("zenora-local-access", "true");
            setLocalAccess(true);
          }}
        />
      ) : (
        <>
          <Sidebar active={active} setActive={setActive} profile={effectiveData.profile} />
          <main className="app-main">
            <TopBar active={active} query={query} setQuery={setQuery} />
            <AnimatePresence mode="wait">
              <motion.div key={active} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.32 }}>
                {page}
              </motion.div>
            </AnimatePresence>
          </main>
          <FloatingCapture setData={setData} setActive={setActive} />
          <InstallPrompt />
        </>
      )}
    </div>
  );
}
