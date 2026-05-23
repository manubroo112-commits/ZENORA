import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import GlowBackground from "./components/GlowBackground";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { seedData } from "./data/seed";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import Focus from "./pages/Focus";
import Habits from "./pages/Habits";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import Tools from "./pages/Tools";

const pageVariants = {
  initial: { opacity: 0, y: 16, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(8px)" }
};

export default function App() {
  const [data, setData] = useLocalStorage("zenora-data-v1", seedData);
  const [active, setActive] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

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
    document.documentElement.classList.toggle("dark", data.profile.dark);
    document.documentElement.style.setProperty("--accent", data.profile.accent);
  }, [data.profile.dark, data.profile.accent]);

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
    const props = { data, setData, query };
    return {
      Dashboard: <Dashboard {...props} setActive={setActive} />,
      Tasks: <Tasks tasks={data.tasks} setData={setData} query={query} />,
      Habits: <Habits habits={data.habits} setData={setData} />,
      Calendar: <Calendar tasks={data.tasks} setData={setData} />,
      Focus: <Focus data={data} setData={setData} />,
      Notes: <Notes notes={data.notes} setData={setData} query={query} />,
      Analytics: <Analytics sessions={data.sessions} />,
      Tools: <Tools data={data} setData={setData} />,
      Settings: <Settings profile={data.profile} setData={setData} />
    }[active];
  }, [active, data, query, setData]);

  return (
    <div className={data.profile.dark ? "dark" : ""}>
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
      <Sidebar active={active} setActive={setActive} profile={data.profile} />
      <main className="app-main">
        <TopBar active={active} query={query} setQuery={setQuery} />
        <AnimatePresence mode="wait">
          <motion.div key={active} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.32 }}>
            {page}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
