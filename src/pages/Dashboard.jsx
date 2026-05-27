import { BookOpen, CalendarClock, Flame, Quote, TimerReset, Trophy } from "lucide-react";
import Card from "../components/Card";
import ProgressRing from "../components/ProgressRing";
import { daysUntil } from "../utils/date";

export default function Dashboard({ data, setActive }) {
  const completed = data.tasks.filter((task) => task.completed).length;
  const habitPercent = Math.round((data.habits.filter((habit) => habit.doneToday).length / Math.max(1, data.habits.length)) * 100);
  const productivity = Math.round((completed / Math.max(1, data.tasks.length)) * 55 + habitPercent * 0.45);
  const upcoming = [...data.tasks].filter((task) => !task.completed).sort((a, b) => new Date(a.due) - new Date(b.due)).slice(0, 4);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <Card className="overflow-hidden p-6 md:p-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-1 text-xs text-cyan-100">
              <Flame size={14} /> {data.profile.goal}
            </div>
            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Good evening, {data.profile.name}. Build a calm streak today.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/52">Your work is arranged into small, clear loops: plan, focus, finish, recover. ZENORA keeps the surface quiet and the signal high.</p>
          </div>
          <ProgressRing value={productivity} size={156} sublabel="daily score" color={data.profile.accent} />
        </div>
      </Card>

      <Card className="grid content-between gap-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/45">Motivation</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">One focused hour beats a distracted day.</h3>
          </div>
          <Quote className="text-white/35" />
        </div>
        <button onClick={() => setActive("Focus")} className="primary-button w-full justify-center"><TimerReset size={18} /> Start a focus block</button>
      </Card>

      <div className="grid gap-5 md:grid-cols-3 xl:col-span-2">
        {[
          ["Tasks done", `${completed}/${data.tasks.length}`, Trophy, "Completed today"],
          ["Habits", `${habitPercent}%`, Flame, "Daily consistency"],
          ["Focus", `${data.focusStats.minutes}m`, TimerReset, `${data.focusStats.sessions} sessions`]
        ].map(([label, value, Icon, sub], index) => (
          <Card key={label} delay={index * 0.05}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/44">{label}</p>
                <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
                <p className="mt-1 text-xs text-white/35">{sub}</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[.07] text-cyan-100"><Icon size={21} /></div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="section-title"><CalendarClock size={18} /> Upcoming deadlines</h3>
          <button onClick={() => setActive("Calendar")} className="text-xs text-cyan-200">Open planner</button>
        </div>
        <div className="space-y-3">
          {upcoming.map((task) => (
            <div key={task.id} className="flex items-center justify-between rounded-2xl bg-white/[.045] p-3">
              <div>
                <div className="text-sm font-medium text-white">{task.title}</div>
                <div className="text-xs text-white/38">{task.category}</div>
              </div>
              <span className="rounded-full bg-white/[.07] px-3 py-1 text-xs text-white/62">{daysUntil(task.due)}d</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="section-title"><BookOpen size={18} /> Sticky study board</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.notes.slice(0, 2).map((note) => (
            <div key={note.id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[.08] to-white/[.025] p-4">
              <div className="text-sm font-semibold text-white">{note.title}</div>
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/48">{note.body}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
