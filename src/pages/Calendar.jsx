import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import Card from "../components/Card";
import { monthDays } from "../utils/date";

export default function Calendar({ tasks, setData }) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const days = monthDays(cursor);
  const selectedTasks = tasks.filter((task) => task.due === selected);

  const add = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    setData((data) => ({ ...data, tasks: [{ id: crypto.randomUUID(), title, due: selected, category: "Study", priority: "Medium", completed: false }, ...data.tasks] }));
    setTitle("");
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
      <Card>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{cursor.toLocaleString("en", { month: "long", year: "numeric" })}</h2>
          <div className="flex gap-2">
            <button className="icon-button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><ChevronLeft size={17} /></button>
            <button className="icon-button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><ChevronRight size={17} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-white/35">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const iso = day?.toISOString().slice(0, 10);
            const count = tasks.filter((task) => task.due === iso).length;
            return (
              <button key={index} disabled={!day} onClick={() => setSelected(iso)} className={`calendar-cell ${selected === iso ? "ring-2 ring-[#d5b47a]" : ""}`}>
                {day && <><span>{day.getDate()}</span>{count > 0 && <b>{count}</b>}</>}
              </button>
            );
          })}
        </div>
      </Card>
      <Card>
        <h3 className="section-title">Planner for {selected}</h3>
        <form onSubmit={add} className="mt-4 flex gap-2">
          <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add event or task" />
          <button className="primary-button px-4"><Plus size={18} /></button>
        </form>
        <div className="mt-5 space-y-3">
          {selectedTasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-white/10 bg-white/[.045] p-4">
              <div className="font-medium text-white">{task.title}</div>
              <div className="mt-1 text-xs text-white/42">{task.category} · {task.priority}</div>
            </div>
          ))}
          {!selectedTasks.length && <div className="empty-state">No plans on this date. Add one when the day earns it.</div>}
        </div>
      </Card>
    </div>
  );
}
