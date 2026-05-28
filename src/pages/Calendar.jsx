import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import Card from "../components/Card";
import { monthDays } from "../utils/date";

export default function Calendar({ tasks, setData, data }) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const events = data?.events || [];
  const exams = data?.exams || [];
  const days = monthDays(cursor);
  const selectedTasks = tasks.filter((task) => task.due === selected);
  const selectedEvents = events.filter((event) => event.date === selected);
  const selectedExams = exams.filter((exam) => exam.date === selected);
  const weekStart = new Date(selected);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const iso = date.toISOString().slice(0, 10);
    return {
      day: date.toLocaleDateString("en", { weekday: "short" }),
      date: iso,
      items: [
        ...tasks.filter((task) => task.due === iso).map((task) => ({ ...task, type: task.category || "Task" })),
        ...events.filter((event) => event.date === iso),
        ...exams.filter((exam) => exam.date === iso).map((exam) => ({ ...exam, title: exam.name, type: exam.type || "Exam", time: "Countdown" }))
      ]
    };
  });

  const add = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    setData((current) => ({
      ...current,
      events: [{ id: crypto.randomUUID(), title, date: selected, time: "17:00", type: "Study", color: "var(--button-b)" }, ...current.events]
    }));
    setTitle("");
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
      <Card>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{cursor.toLocaleString("en", { month: "long", year: "numeric" })}</h2>
          <div className="flex gap-2">
            <button className="icon-button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Previous month"><ChevronLeft size={17} /></button>
            <button className="icon-button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Next month"><ChevronRight size={17} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-white/35">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const iso = day?.toISOString().slice(0, 10);
            const hasExam = exams.some((exam) => exam.date === iso);
            const count = tasks.filter((task) => task.due === iso).length + events.filter((item) => item.date === iso).length + exams.filter((exam) => exam.date === iso).length;
            return (
              <button key={index} disabled={!day} onClick={() => setSelected(iso)} className={`calendar-cell ${selected === iso ? "is-selected" : ""} ${hasExam ? "has-exam" : ""}`} aria-label={day ? `Select ${iso}${count ? `, ${count} plan${count === 1 ? "" : "s"}` : ""}` : "Empty calendar cell"} aria-pressed={selected === iso}>
                {day && <><span>{day.getDate()}</span>{count > 0 && <b>{count}</b>}</>}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="section-title">Planner for {selected}</h3>
        <form onSubmit={add} className="mt-4 grid gap-2 sm:grid-cols-[1fr_3.25rem] sm:items-end">
          <div className="form-field">
            <label>Plan title</label>
            <input className="field" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Example: Maths coaching, mock test, assignment deadline" />
          </div>
          <button className="primary-button px-4" aria-label="Add calendar plan"><Plus size={18} /></button>
          <p className="field-help sm:col-span-2">This adds an event to the selected calendar date.</p>
        </form>
        <div className="mt-5 space-y-3">
          {selectedTasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-white/10 bg-white/[.045] p-4">
              <div className="font-medium text-white">{task.title}</div>
              <div className="mt-1 text-xs text-white/42">{task.category} - {task.priority}{task.time ? ` - ${task.time}` : ""}</div>
            </div>
          ))}
          {selectedEvents.map((event) => (
            <div key={event.id} className="rounded-2xl border border-white/10 bg-white/[.045] p-4">
              <div className="font-medium text-white">{event.title}</div>
              <div className="mt-1 text-xs text-white/42">{event.type} - {event.time}</div>
            </div>
          ))}
          {selectedExams.map((exam) => (
            <div key={exam.id} className="rounded-2xl border border-white/10 bg-white/[.045] p-4">
              <div className="font-medium text-white">{exam.name}</div>
              <div className="mt-1 text-xs text-white/42">{exam.type} exam date</div>
            </div>
          ))}
          {!selectedTasks.length && !selectedEvents.length && !selectedExams.length && <div className="empty-state">No plans on this date. Add one when the day earns it.</div>}
        </div>
      </Card>

      <Card className="xl:col-span-2">
        <h3 className="section-title">Weekly view</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-7">
          {weekDays.map((day) => (
            <div key={day.date} className="rounded-2xl bg-white/[.045] p-3">
              <div className="text-sm font-semibold text-white">{day.day}</div>
              <div className="mt-1 text-[0.68rem] text-white/35">{day.date.slice(5)}</div>
              <div className="mt-3 space-y-2">
                {day.items.slice(0, 3).map((item) => (
                  <button key={item.id} onClick={() => setSelected(day.date)} className="w-full rounded-xl bg-white/[.055] p-2 text-left text-xs leading-4 text-white/62">
                    <span className="block font-semibold text-white/80">{item.title}</span>
                    <span>{item.type}{item.time ? ` - ${item.time}` : ""}</span>
                  </button>
                ))}
                {!day.items.length && <p className="text-xs leading-5 text-white/35">No plans yet</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
