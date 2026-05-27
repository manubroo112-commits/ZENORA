import { BarChart3, Bot, CalendarDays, CheckSquare, Clock3, Crown, Flag, Focus, Home, Moon, NotebookPen, Settings, Sparkles, Target, Wrench, BookOpenCheck } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  ["Dashboard", Home],
  ["Today\u2019s Mission", Flag],
  ["Tasks", CheckSquare],
  ["Habits", Target],
  ["Subjects", BookOpenCheck],
  ["Calendar", CalendarDays],
  ["Focus Mode", Focus],
  ["Exams", Clock3],
  ["AI Assistant", Bot],
  ["Notes", NotebookPen],
  ["Analytics", BarChart3],
  ["Tools", Wrench],
  ["Premium", Crown],
  ["Settings", Settings]
];

export default function Sidebar({ active, setActive, profile }) {
  return (
    <aside className="app-sidebar">
      <div className="glass app-sidebar-inner">
        <div className="app-brand">
          <div className="brand-mark">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-lg font-semibold text-white">ZENORA</div>
            <div className="text-xs text-white/45">Student OS</div>
          </div>
        </div>

        <nav className="app-nav">
          {items.map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => setActive(name)}
              className={`nav-item ${active === name ? "is-active" : ""}`}
              title={name}
            >
              {active === name && <motion.span layoutId="activeTab" className="nav-active-pill" />}
              <Icon className="relative z-10 h-5 w-5 shrink-0" />
              <span className="app-nav-label relative z-10">{name}</span>
            </button>
          ))}
        </nav>

        <div className="app-focus-card">
          <div className="mb-3 flex items-center gap-2 text-sm text-white">
            <Moon size={16} /> Focus mood
          </div>
          <p className="text-xs leading-5 text-white/48">{profile.goal}</p>
        </div>
      </div>
    </aside>
  );
}
