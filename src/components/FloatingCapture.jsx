import { BookOpenCheck, CalendarClock, CheckSquare, Flame, NotebookPen, Plus, TimerReset, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function FloatingCapture({ setData, setActive, isPro = false }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const closeMenu = () => {
    setOpen(false);
    setTimeout(() => triggerRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!open) return undefined;
    const firstButton = menuRef.current?.querySelector("button");
    firstButton?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const capture = (type) => {
    const today = todayIso();
    setOpen(false);
    if (type === "task") {
      setData((data) => ({
        ...data,
        tasks: [{ id: crypto.randomUUID(), title: "New study task", category: "Study", priority: "Medium", due: today, time: "18:00", completed: false }, ...data.tasks]
      }));
      setActive("Tasks");
    }
    if (type === "note") {
      setData((data) => ({
        ...data,
        notes: [{ id: crypto.randomUUID(), title: "Quick note", category: "Study", body: "", pinned: false }, ...data.notes]
      }));
      setActive("Notes");
    }
    if (type === "exam") {
      setData((data) => ({
        ...data,
        exams: !isPro && data.exams.length >= 3
          ? data.exams
          : [{ id: crypto.randomUUID(), name: "New exam", date: today, type: data.profile.examType || "Exam", syllabusProgress: 0 }, ...data.exams]
      }));
      setActive("Exams");
    }
    if (type === "habit") {
      setData((data) => ({
        ...data,
        habits: [{ id: crypto.randomUUID(), name: "New study habit", color: "var(--button-b)", streak: 0, bestStreak: 0, missed: 0, history: Array(30).fill(0), doneToday: false }, ...data.habits]
      }));
      setActive("Habits");
    }
    if (type === "session") {
      setData((data) => ({
        ...data,
        focusStats: { sessions: data.focusStats.sessions + 1, minutes: data.focusStats.minutes + 25 },
        focusSessions: [{ id: crypto.randomUUID(), mode: "Study session", minutes: 25, date: today }, ...data.focusSessions].slice(0, 30)
      }));
      setActive("Focus Mode");
    }
    if (type === "subject") {
      setData((data) => ({
        ...data,
        subjects: !isPro && data.subjects.length >= 3
          ? data.subjects
          : [{ id: crypto.randomUUID(), name: "New subject", chapters: 10, completed: 0, targetHours: 20, studiedHours: 0, examDate: today, revisionStatus: "Not started", weakTopics: [] }, ...data.subjects]
      }));
      setActive("Subjects");
    }
  };

  const freeActions = [
    ["task", "Task", CheckSquare],
    ["note", "Note", NotebookPen],
    ["exam", "Exam", CalendarClock],
    ["subject", "Subject", BookOpenCheck]
  ];
  const proActions = [
    ["habit", "Habit", Flame],
    ["session", "Study session", TimerReset]
  ];
  const actions = isPro ? [...freeActions, ...proActions] : freeActions;

  return (
    <div className="quick-capture">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="zenora-quick-capture-menu"
            role="menu"
            aria-label="Quick capture actions"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="glass quick-capture-menu"
          >
            {actions.map(([type, label, Icon]) => (
              <button key={type} role="menuitem" onClick={() => capture(type)} aria-label={`Add ${label.toLowerCase()}`}>
                <Icon size={17} />
                <span>{label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        ref={triggerRef}
        className="quick-capture-button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close quick capture" : "Open quick capture"}
        aria-expanded={open}
        aria-controls="zenora-quick-capture-menu"
        aria-haspopup="menu"
      >
        {open ? <X size={22} /> : <Plus size={24} />}
      </button>
    </div>
  );
}
