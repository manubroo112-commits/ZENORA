import { Flame, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import Card from "../components/Card";
import ProgressRing from "../components/ProgressRing";

export default function Habits({ habits, setData }) {
  const [name, setName] = useState("");
  const percent = Math.round((habits.filter((habit) => habit.doneToday).length / Math.max(1, habits.length)) * 100);

  const addHabit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setData((data) => ({
      ...data,
      habits: [...data.habits, { id: crypto.randomUUID(), name, color: "var(--button-b)", streak: 0, bestStreak: 0, missed: 0, doneToday: false, history: Array(30).fill(0) }]
    }));
    setName("");
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <Card>
        <h2 className="section-title"><TrendingUp size={18} /> Habit pulse</h2>
        <div className="mt-5 flex items-center justify-center"><ProgressRing value={percent} size={174} sublabel="completed today" color="var(--button-b)" /></div>
        <form onSubmit={addHabit} className="mt-6 grid gap-2 sm:grid-cols-[1fr_3.25rem] sm:items-end">
          <div className="form-field">
            <label>Habit name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Example: 30 min revision daily" />
          </div>
          <button className="primary-button px-4" aria-label="Add habit"><Plus size={18} /></button>
          <p className="field-help sm:col-span-2">Add a habit you want to check off once per day.</p>
        </form>
      </Card>
      <div className="grid gap-4">
        {habits.map((habit) => (
          <Card key={habit.id} className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-white">{habit.name}</h3>
                <p className="mt-1 text-xs text-white/42">{habit.streak} day streak · best {habit.bestStreak || habit.streak}</p>
              </div>
              <button
                onClick={() => setData((data) => ({ ...data, habits: data.habits.map((item) => item.id === habit.id ? { ...item, doneToday: !item.doneToday, streak: Math.max(0, item.streak + (item.doneToday ? -1 : 1)), bestStreak: Math.max(item.bestStreak || 0, item.streak + (item.doneToday ? -1 : 1)), history: [...item.history.slice(1), item.doneToday ? 0 : 1] } : item) }))}
                className={`pill ${habit.doneToday ? "is-complete" : ""}`}
              >
                {habit.doneToday ? "Completed" : "Mark done"}
              </button>
            </div>
            <div className="mt-4 grid grid-cols-14 gap-1">
              {habit.history.slice(-28).map((done, index) => (
                <span
                  key={index}
                  className="h-6 rounded-md"
                  style={{
                    background: done ? habit.color : "rgba(var(--line-rgb), .07)",
                    boxShadow: done ? `0 0 12px ${habit.color?.startsWith("var(") ? `color-mix(in srgb, ${habit.color} 45%, transparent)` : `${habit.color}55`}` : "none"
                  }}
                />
              ))}
            </div>
            <div className="mt-4 grid gap-2 text-xs text-white/45 sm:grid-cols-3">
              <span className="rounded-xl bg-white/[.045] p-3"><Flame size={14} className="mb-1" /> Missed {habit.history.filter((day) => !day).length} days</span>
              <span className="rounded-xl bg-white/[.045] p-3">Weekly {Math.round((habit.history.slice(-7).filter(Boolean).length / 7) * 100)}%</span>
              <span className="rounded-xl bg-white/[.045] p-3">{habit.doneToday ? "Momentum secured" : "One check-in away"}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
