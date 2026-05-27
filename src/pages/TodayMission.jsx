import { CheckCircle2, Flag, Plus, RotateCcw, Target, TimerReset, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import Card from "../components/Card";

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function TodayMission({ data, setData, setActive }) {
  const mission = data.todayMission;
  const [goalText, setGoalText] = useState("");
  const completedGoals = mission.goals.filter((goal) => goal.done).length;
  const progress = useMemo(() => {
    const checks = [
      ...mission.goals.map((goal) => goal.done),
      Number(mission.mcqDone) >= Number(mission.mcqTarget || 0) && Number(mission.mcqTarget || 0) > 0,
      mission.revisionDone,
      mission.mockDone
    ];
    return Math.round((checks.filter(Boolean).length / Math.max(1, checks.length)) * 100);
  }, [mission]);

  const patchMission = (changes) => setData((current) => ({
    ...current,
    todayMission: { ...current.todayMission, ...changes }
  }));

  const addGoal = (event) => {
    event.preventDefault();
    if (!goalText.trim()) return;
    patchMission({
      goals: [{ id: crypto.randomUUID(), text: goalText.trim(), done: false }, ...mission.goals].slice(0, 6)
    });
    setGoalText("");
  };

  const addTask = () => {
    setData((current) => ({
      ...current,
      tasks: [{ id: crypto.randomUUID(), title: goalText.trim() || "Today mission task", category: "Study", priority: "High", due: todayIso(), time: "18:00", completed: false }, ...current.tasks]
    }));
    setActive("Tasks");
  };

  const resetDay = () => {
    patchMission({
      goals: mission.goals.map((goal) => ({ ...goal, done: false })),
      mcqDone: 0,
      revisionDone: false,
      mockDone: false
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
      <Card className="p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="section-title"><Flag size={18} /> Today&apos;s Mission</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/52">
              Decide the few wins that make today count. Keep it small: top goals, practice questions, revision, and test reminder.
            </p>
          </div>
          <div className="rounded-3xl bg-white/[.045] p-5 text-center">
            <div className="text-4xl font-semibold text-white">{progress}%</div>
            <div className="text-xs text-white/42">mission complete</div>
          </div>
        </div>
        <div className="mt-6 h-3 rounded-full bg-white/10">
          <div className="theme-gradient h-full rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="mission-stat"><span>{completedGoals}/{mission.goals.length}</span><p>study goals</p></div>
          <div className="mission-stat"><span>{mission.mcqDone}/{mission.mcqTarget}</span><p>questions</p></div>
          <div className="mission-stat"><span>{mission.mockDone ? "Done" : "Pending"}</span><p>test reminder</p></div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="section-title"><Target size={18} /> Top study goals</h3>
          <button onClick={resetDay} className="ghost-button compact-button"><RotateCcw size={16} /> Reset</button>
        </div>
        <div className="space-y-3">
          {mission.goals.map((goal) => (
            <div key={goal.id} className={`mission-goal ${goal.done ? "is-done" : ""}`}>
              <button
                type="button"
                onClick={() => patchMission({ goals: mission.goals.map((item) => item.id === goal.id ? { ...item, done: !item.done } : item) })}
                className="mission-check"
                title={goal.done ? "Mark pending" : "Mark done"}
              >
                <CheckCircle2 size={18} />
              </button>
              <input
                value={goal.text}
                onChange={(event) => patchMission({ goals: mission.goals.map((item) => item.id === goal.id ? { ...item, text: event.target.value } : item) })}
                placeholder="Write your study goal"
              />
              <button
                type="button"
                onClick={() => patchMission({ goals: mission.goals.filter((item) => item.id !== goal.id) })}
                className="mission-delete"
                title="Delete goal"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {!mission.goals.length && <div className="empty-state">No mission goals yet. Add your first study target below.</div>}
        </div>
        <form onSubmit={addGoal} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="form-field">
            <label>New goal</label>
            <input className="field" value={goalText} onChange={(event) => setGoalText(event.target.value)} placeholder="Example: Revise electrostatics notes" />
          </div>
          <button className="primary-button justify-center"><Plus size={18} /> Add goal</button>
        </form>
        <button onClick={addTask} className="ghost-button mt-3 w-full justify-center"><Plus size={18} /> Turn into task</button>
      </Card>

      <Card>
        <h3 className="section-title">Practice + revision target</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="form-field">
            <label>Practice question target</label>
            <input className="field" type="number" min="0" value={mission.mcqTarget} onChange={(event) => patchMission({ mcqTarget: Number(event.target.value) || 0 })} placeholder="Example: 50" />
          </div>
          <div className="form-field">
            <label>Questions completed</label>
            <input className="field" type="number" min="0" value={mission.mcqDone} onChange={(event) => patchMission({ mcqDone: Number(event.target.value) || 0 })} placeholder="Example: 20" />
          </div>
          <div className="form-field sm:col-span-2">
            <label>Revision target</label>
            <input className="field" value={mission.revisionTarget} onChange={(event) => patchMission({ revisionTarget: event.target.value })} placeholder="Example: Revise formulas and last mock mistakes" />
          </div>
        </div>
        <button onClick={() => patchMission({ revisionDone: !mission.revisionDone })} className={`pill mt-4 ${mission.revisionDone ? "is-complete" : ""}`}>
          {mission.revisionDone ? "Revision complete" : "Mark revision complete"}
        </button>
      </Card>

      <Card>
        <h3 className="section-title"><TimerReset size={18} /> Test reminder</h3>
        <div className="mt-4 form-field">
          <label>Reminder text</label>
          <input className="field" value={mission.mockTest} onChange={(event) => patchMission({ mockTest: event.target.value })} placeholder="Example: Practice test at 7 PM" />
        </div>
        <button onClick={() => patchMission({ mockDone: !mission.mockDone })} className={`primary-button mt-4 w-full justify-center ${mission.mockDone ? "opacity-80" : ""}`}>
          <CheckCircle2 size={18} /> {mission.mockDone ? "Test done" : "Mark test done"}
        </button>
      </Card>
    </div>
  );
}
