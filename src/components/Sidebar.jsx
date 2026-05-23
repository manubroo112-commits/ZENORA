import { BarChart3, CalendarDays, CheckSquare, Focus, Home, Moon, NotebookPen, Settings, Sparkles, Target, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  ["Dashboard", Home],
  ["Tasks", CheckSquare],
  ["Habits", Target],
  ["Calendar", CalendarDays],
  ["Focus", Focus],
  ["Notes", NotebookPen],
  ["Analytics", BarChart3],
  ["Tools", Wrench],
  ["Settings", Settings]
];

export default function Sidebar({ active, setActive, profile }) {
  return (
    <aside className="app-sidebar">
      <div className="glass app-sidebar-inner">
        <div className="app-brand">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-black shadow-violet">
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
              className={`nav-item ${active === name ? "text-white" : "text-white/55 hover:text-white"}`}
              title={name}
            >
              {active === name && <motion.span layoutId="activeTab" className="absolute inset-0 rounded-2xl bg-white/10" />}
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
