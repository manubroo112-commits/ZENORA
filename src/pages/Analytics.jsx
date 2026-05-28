import { Activity, BarChart3, Brain, CheckCircle2, Flame, GraduationCap, TimerReset } from "lucide-react";
import Card from "../components/Card";
import ProLock from "../components/ProLock";

export default function Analytics({ data, setActive }) {
  const isPro = data.profile.plan === "pro" || data.profile.proOverride;
  const sessions = data.sessions;
  const totalStudyHours = sessions.reduce((sum, item) => sum + Number(item.hours || 0), 0);
  const maxHours = Math.max(...sessions.map((item) => Number(item.hours || 0)), 1);
  const completed = data.tasks.filter((task) => task.completed).length;
  const pending = data.tasks.length - completed;
  const hasStudyData = totalStudyHours > 0 || data.focusStats.minutes > 0 || completed > 0 || data.habits.some((habit) => habit.doneToday);
  const bestDay = sessions.reduce((best, item) => Number(item.hours || 0) > Number(best.hours || 0) ? item : best, sessions[0]);
  const subjectAverage = data.subjects.length
    ? Math.round(data.subjects.reduce((sum, subject) => sum + subject.completed / Math.max(1, subject.chapters), 0) / data.subjects.length * 100)
    : 0;
  const habitAverage = Math.round(sessions.reduce((sum, item) => sum + Number(item.habits || 0), 0) / Math.max(1, sessions.length));
  const productivity = Math.round(((completed / Math.max(1, data.tasks.length)) * 45) + (subjectAverage * 0.35) + (habitAverage * 0.2));

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
      {isPro ? (
      <Card className="analytics-chart-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="section-title"><BarChart3 size={18} /> Weekly productivity</h2>
            <p className="mt-2 text-sm text-white/45">Study hours, focus time, and completed work will shape this chart.</p>
          </div>
          <div className="sync-badge">{totalStudyHours.toFixed(1)}h this week</div>
        </div>

        {hasStudyData ? (
          <div className="analytics-chart mt-8">
            {sessions.map((day) => {
              const height = Number(day.hours || 0) ? Math.max(12, (Number(day.hours || 0) / maxHours) * 100) : 4;
              return (
                <div key={day.day} className="analytics-day">
                  <div className="analytics-track">
                    <div className="analytics-bar" style={{ height: `${height}%` }}>
                      <span>{Number(day.hours || 0).toFixed(1)}h</span>
                    </div>
                  </div>
                  <span>{day.day}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="analytics-empty">
            <BarChart3 size={28} />
            <div>
              <h3>No study data yet</h3>
              <p>Complete tasks, log focus sessions, or update subjects to turn this into a real weekly report.</p>
            </div>
          </div>
        )}
      </Card>
      ) : (
        <ProLock title="Pro weekly and monthly graphs" onUpgrade={() => setActive?.("Premium")}>
          <Card className="analytics-chart-card">
            <h2 className="section-title"><BarChart3 size={18} /> Weekly productivity</h2>
            <div className="analytics-empty mt-8">
              <BarChart3 size={28} />
              <div>
                <h3>Advanced graphs are Pro</h3>
                <p>Free analytics keeps the summary cards below. Pro unlocks weekly/monthly graphs and deeper patterns.</p>
              </div>
            </div>
          </Card>
        </ProLock>
      )}

      <div className="grid gap-5">
        {isPro ? (
        <Card>
          <h3 className="section-title"><Activity size={18} /> Habit consistency</h3>
          {hasStudyData ? (
            <div className="mt-5 space-y-3">
              {sessions.map((item) => (
                <div key={item.day}>
                  <div className="mb-1 flex justify-between text-xs text-white/45"><span>{item.day}</span><span>{item.habits}%</span></div>
                  <div className="h-2 rounded-full bg-white/10"><div className="theme-fill-b h-full rounded-full" style={{ width: `${item.habits}%` }} /></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state mt-4">Check off habits for a few days to see consistency here.</div>
          )}
        </Card>
        ) : (
          <ProLock title="Pro habit consistency" compact onUpgrade={() => setActive?.("Premium")}>
            <Card>
              <h3 className="section-title"><Activity size={18} /> Habit consistency</h3>
              <div className="empty-state mt-4">Consistency trends unlock with Pro analytics.</div>
            </Card>
          </ProLock>
        )}
        <Card>
          <h3 className="section-title"><Brain size={18} /> Study insight</h3>
          <p className="mt-4 text-sm leading-6 text-white/52">
            {hasStudyData
              ? `Your strongest day is ${bestDay.day}. Put your hardest work near that rhythm and keep one recovery block after intense sessions.`
              : "Start with one focus session and one completed task. Analytics becomes useful after your first few study actions."}
          </p>
        </Card>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:col-span-2 xl:grid-cols-4">
        <Card><p className="text-sm text-white/45">Study hours</p><div className="mt-2 text-4xl font-semibold text-white">{totalStudyHours.toFixed(1)}</div></Card>
        <Card><p className="text-sm text-white/45">Focus hours</p><div className="mt-2 flex items-center gap-2 text-4xl font-semibold text-white"><TimerReset size={28} />{(data.focusStats.minutes / 60).toFixed(1)}</div></Card>
        <Card><p className="text-sm text-white/45">Completed</p><div className="mt-2 flex items-center gap-2 text-4xl font-semibold text-white"><CheckCircle2 size={28} />{completed}</div></Card>
        <Card><p className="text-sm text-white/45">Pending</p><div className="mt-2 text-4xl font-semibold text-white">{pending}</div></Card>
      </div>

      {isPro && data.subjects.length > 0 && (
        <Card className="xl:col-span-2">
          <h3 className="section-title"><GraduationCap size={18} /> Subject-wise progress</h3>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {data.subjects.map((subject) => {
              const progress = Math.round((subject.completed / Math.max(1, subject.chapters)) * 100);
              return (
                <div key={subject.id} className="rounded-2xl bg-white/[.045] p-4">
                  <div className="mb-2 flex justify-between text-sm font-semibold text-white"><span>{subject.name}</span><span>{progress}%</span></div>
                  <div className="h-2 rounded-full bg-white/10"><div className="theme-fill-c h-full rounded-full" style={{ width: `${progress}%` }} /></div>
                  <p className="mt-2 text-xs text-white/42">{subject.revisionStatus || "Not started"}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      {!isPro && (
        <ProLock title="Pro subject-wise progress" onUpgrade={() => setActive?.("Premium")}>
          <Card className="xl:col-span-2">
            <h3 className="section-title"><GraduationCap size={18} /> Subject-wise progress</h3>
            <div className="empty-state mt-5">Advanced subject analytics unlock with Pro. Free users can still track limited subjects in the Subjects page.</div>
          </Card>
        </ProLock>
      )}

      {isPro ? (
      <Card>
        <h3 className="section-title"><Flame size={18} /> Study streak</h3>
        <div className="mt-4 text-5xl font-semibold text-white">{data.gamification.streak}</div>
        <p className="mt-2 text-sm text-white/45">days of visible progress</p>
      </Card>
      ) : (
        <ProLock title="Pro streak analytics" compact onUpgrade={() => setActive?.("Premium")}>
          <Card>
            <h3 className="section-title"><Flame size={18} /> Study streak</h3>
            <div className="mt-4 text-5xl font-semibold text-white">--</div>
          </Card>
        </ProLock>
      )}
      <Card>
        <h3 className="section-title"><Brain size={18} /> Productivity score</h3>
        <div className="mt-4 text-5xl font-semibold text-white">{productivity}</div>
        <p className="mt-2 text-sm text-white/45">tasks, subjects, habits, and focus combined</p>
      </Card>
    </div>
  );
}
