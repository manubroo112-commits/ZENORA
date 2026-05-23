import { Plus, TrendingUp } from "lucide-react";
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
      habits: [...data.habits, { id: crypto.randomUUID(), name, color: "#d5b47a", streak: 0, doneToday: false, history: Array(14).fill(0) }]
    }));
    setName("");
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <Card>
        <h2 className="section-title"><TrendingUp size={18} /> Habit pulse</h2>
        <div className="mt-5 flex items-center justify-center"><ProgressRing value={percent} size={174} sublabel="completed today" color="#d5b47a" /></div>
        <form onSubmit={addHabit} className="mt-6 flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Add a new habit" />
          <button className="primary-button px-4"><Plus size={18} /></button>
        </form>
      </Card>
      <div className="grid gap-4">
        {habits.map((habit) => (
          <Card key={habit.id} className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-white">{habit.name}</h3>
                <p className="mt-1 text-xs text-white/42">{habit.streak} day streak</p>
              </div>
              <button
                onClick={() => setData((data) => ({ ...data, habits: data.habits.map((item) => item.id === habit.id ? { ...item, doneToday: !item.doneToday, streak: Math.max(0, item.streak + (item.doneToday ? -1 : 1)) } : item) }))}
                className={`pill ${habit.doneToday ? "bg-[#d5b47a] text-black" : ""}`}
              >
                {habit.doneToday ? "Completed" : "Mark done"}
              </button>
            </div>
            <div className="mt-4 grid grid-cols-14 gap-1">
              {habit.history.map((done, index) => (
                <span key={index} className="h-6 rounded-md" style={{ background: done ? habit.color : "rgba(255,255,255,.07)", boxShadow: done ? `0 0 12px ${habit.color}55` : "none" }} />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
