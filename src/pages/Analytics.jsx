import { Activity, BarChart3 } from "lucide-react";
import Card from "../components/Card";

export default function Analytics({ sessions }) {
  const maxHours = Math.max(...sessions.map((item) => item.hours));

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
      <Card>
        <h2 className="section-title"><BarChart3 size={18} /> Weekly productivity</h2>
        <div className="mt-8 flex h-72 items-end gap-3">
          {sessions.map((day) => (
            <div key={day.day} className="flex flex-1 flex-col items-center gap-3">
              <div className="relative flex h-full w-full items-end justify-center rounded-2xl bg-white/[.035]">
                <div className="w-full rounded-2xl bg-gradient-to-t from-[#9b6f43] via-[#d5b47a] to-[#9aa77e] shadow-glow" style={{ height: `${(day.hours / maxHours) * 100}%` }} />
              </div>
              <span className="text-xs text-white/45">{day.day}</span>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid gap-5">
        <Card>
          <h3 className="section-title"><Activity size={18} /> Habit consistency</h3>
          <div className="mt-5 space-y-3">
            {sessions.map((item) => (
              <div key={item.day}>
                <div className="mb-1 flex justify-between text-xs text-white/45"><span>{item.day}</span><span>{item.habits}%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#d5b47a]" style={{ width: `${item.habits}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm text-white/45">Study hours</p>
          <div className="mt-2 text-5xl font-semibold text-white">{sessions.reduce((sum, item) => sum + item.hours, 0).toFixed(1)}</div>
          <p className="mt-2 text-sm text-white/42">hours tracked this week</p>
        </Card>
      </div>
    </div>
  );
}
