import { BookOpenCheck, CalendarClock, Plus, Target, Trash2 } from "lucide-react";
import { useState } from "react";
import Card from "../components/Card";
import ProLock from "../components/ProLock";
import { daysUntil } from "../utils/date";

const blank = { name: "", chapters: 10, completed: 0, targetHours: 5, studiedHours: 0, examDate: new Date().toISOString().slice(0, 10), revisionStatus: "Not started", weakTopicsText: "" };
const blankAssignment = { title: "", subject: "", due: new Date().toISOString().slice(0, 10), progress: 0 };
const blankGoal = { title: "", progress: 0 };

export default function StudyPlanner({ data, setData }) {
  const [subject, setSubject] = useState(blank);
  const [assignment, setAssignment] = useState(blankAssignment);
  const [goal, setGoal] = useState(blankGoal);
  const isPro = data.profile.plan === "pro" || data.profile.proOverride;
  const subjectLimitReached = !isPro && data.subjects.length >= 3;
  const totalProgress = Math.round(data.subjects.reduce((sum, item) => sum + item.completed / Math.max(1, item.chapters), 0) / Math.max(1, data.subjects.length) * 100);

  const addSubject = (event) => {
    event.preventDefault();
    if (!subject.name.trim()) return;
    if (subjectLimitReached) return;
    const { weakTopicsText, ...payload } = subject;
    setData((current) => ({
      ...current,
      subjects: [{
        id: crypto.randomUUID(),
        ...payload,
        weakTopics: weakTopicsText.split(",").map((item) => item.trim()).filter(Boolean)
      }, ...current.subjects]
    }));
    setSubject(blank);
  };
  const addAssignment = (event) => {
    event.preventDefault();
    if (!assignment.title.trim()) return;
    setData((current) => ({
      ...current,
      assignments: [{ id: crypto.randomUUID(), ...assignment, progress: Number(assignment.progress) || 0 }, ...current.assignments]
    }));
    setAssignment(blankAssignment);
  };
  const addGoal = (event) => {
    event.preventDefault();
    if (!goal.title.trim()) return;
    setData((current) => ({
      ...current,
      goals: [{ id: crypto.randomUUID(), ...goal, progress: Number(goal.progress) || 0 }, ...current.goals]
    }));
    setGoal(blankGoal);
  };
  const updateAssignment = (id, changes) => {
    setData((current) => ({
      ...current,
      assignments: current.assignments.map((item) => item.id === id ? { ...item, ...changes } : item)
    }));
  };
  const updateGoal = (id, changes) => {
    setData((current) => ({
      ...current,
      goals: current.goals.map((item) => item.id === id ? { ...item, ...changes } : item)
    }));
  };
  const updateSubject = (id, changes) => {
    setData((current) => ({
      ...current,
      subjects: current.subjects.map((item) => item.id === id ? { ...item, ...changes } : item)
    }));
  };

  return (
    <div className="study-planner-grid grid gap-5 xl:grid-cols-2">
      <Card className="subject-entry-card">
        <h2 className="section-title"><BookOpenCheck size={18} /> Subject command center</h2>
        <p className="mt-2 text-sm leading-6 text-white/48">
          Track syllabus progress, pending chapters, revision status, weak topics, and exam date for every subject.
          {!isPro && " Free plan includes 3 subjects."}
        </p>
        <div className="mt-5 rounded-3xl bg-white/[.045] p-5">
          <div className="text-5xl font-semibold text-white">{totalProgress}%</div>
          <p className="mt-2 text-sm text-white/45">overall exam preparation</p>
          <div className="mt-4 h-2 rounded-full bg-white/10"><div className="theme-fill-b h-full rounded-full" style={{ width: `${totalProgress}%` }} /></div>
        </div>
        <form onSubmit={addSubject} className="mt-5 space-y-3">
          <div className="form-field">
            <label>Subject name</label>
            <input className="field" value={subject.name} onChange={(event) => setSubject({ ...subject, name: event.target.value })} placeholder="Example: Physics, Biology, History" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="form-field">
              <label>Total chapters</label>
              <input className="field" type="number" min="1" value={subject.chapters} onChange={(event) => setSubject({ ...subject, chapters: Number(event.target.value) })} placeholder="Example: 12" />
            </div>
            <div className="form-field">
              <label>Chapters done</label>
              <input className="field" type="number" min="0" value={subject.completed} onChange={(event) => setSubject({ ...subject, completed: Number(event.target.value) })} placeholder="Example: 3" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="form-field">
              <label>Study hour target</label>
              <input className="field" type="number" min="0" value={subject.targetHours} onChange={(event) => setSubject({ ...subject, targetHours: Number(event.target.value) })} placeholder="Example: 20" />
            </div>
            <div className="form-field">
              <label>Exam date</label>
              <input className="field" type="date" value={subject.examDate} onChange={(event) => setSubject({ ...subject, examDate: event.target.value })} />
            </div>
          </div>
          <div className="form-field">
            <label>Revision status</label>
            <select className="field" value={subject.revisionStatus} onChange={(event) => setSubject({ ...subject, revisionStatus: event.target.value })}>
              {["Not started", "In progress", "Needs revision", "Backlog", "Ready"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Weak topics</label>
            <input className="field" value={subject.weakTopicsText} onChange={(event) => setSubject({ ...subject, weakTopicsText: event.target.value })} placeholder="Example: Optics, Organic mechanisms, Polity Laxmikanth" />
            <p className="field-help">Separate topics with commas. These are also sent as context to the AI assistant.</p>
          </div>
          {subjectLimitReached && <div className="empty-state">Free subject limit reached. Upgrade to Pro for unlimited subjects and deeper planning tools.</div>}
          <button disabled={subjectLimitReached} className="primary-button w-full justify-center"><Plus size={18} /> Add subject</button>
        </form>
      </Card>

      {data.subjects.length > 0 && (
      <div className="subject-list grid gap-4 md:grid-cols-2 xl:col-span-2">
        {data.subjects.map((item) => {
          const progress = Math.round((item.completed / Math.max(1, item.chapters)) * 100);
          const hours = Math.round((item.studiedHours / Math.max(1, item.targetHours)) * 100);
          return (
            <Card key={item.id} className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                  <p className="mt-1 text-xs text-white/42">{daysUntil(item.examDate)} days until exam</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="pill"
                    onClick={() => updateSubject(item.id, { completed: Math.min(item.chapters, Number(item.completed) + 1), studiedHours: Number(item.studiedHours || 0) + 0.5 })}
                  >
                    Log revision
                  </button>
                  <button className="icon-button" onClick={() => setData((current) => ({ ...current, subjects: current.subjects.filter((subject) => subject.id !== item.id) }))} title="Delete subject" aria-label={`Delete subject: ${item.name}`}><Trash2 size={15} /></button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-white/45"><span>Chapters</span><span>{item.completed}/{item.chapters}</span></div>
                  <div className="h-2 rounded-full bg-white/10"><div className="theme-fill-b h-full rounded-full" style={{ width: `${progress}%` }} /></div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-white/45"><span>Study target</span><span>{item.studiedHours}/{item.targetHours}h</span></div>
                  <div className="h-2 rounded-full bg-white/10"><div className="theme-fill-c h-full rounded-full" style={{ width: `${Math.min(100, hours)}%` }} /></div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-white/[.045] p-3 text-sm text-white/55">Pending chapters: {Math.max(0, Number(item.chapters) - Number(item.completed))}</div>
                <div className="rounded-2xl bg-white/[.045] p-3 text-sm text-white/55">Revision: {item.revisionStatus || "Not started"}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(item.weakTopics || []).map((topic) => <span key={topic} className="premium-badge">{topic}</span>)}
                {!(item.weakTopics || []).length && <span className="text-xs text-white/38">No weak topics logged yet.</span>}
              </div>
            </Card>
          );
        })}
      </div>
      )}

      {isPro ? (
      <Card className="revision-planner-card">
        <h3 className="section-title"><CalendarClock size={18} /> Revision planner</h3>
        <p className="mt-2 text-sm leading-6 text-white/48">Use this for assignments, revision tasks, chapter practice, or anything with a due date and progress.</p>
        <form onSubmit={addAssignment} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <div className="form-field">
            <label>Task title</label>
            <input className="field" value={assignment.title} onChange={(event) => setAssignment({ ...assignment, title: event.target.value })} placeholder="Example: Revise chapter 4 numericals" />
          </div>
          <div className="form-field">
            <label>Subject</label>
            <input className="field" value={assignment.subject} onChange={(event) => setAssignment({ ...assignment, subject: event.target.value })} placeholder="Example: Maths" />
          </div>
          <button className="primary-button justify-center"><Plus size={18} /> Add</button>
          <div className="form-field">
            <label>Due date</label>
            <input className="field" type="date" value={assignment.due} onChange={(event) => setAssignment({ ...assignment, due: event.target.value })} />
          </div>
          <div className="form-field md:col-span-2">
            <label>Progress before adding: {assignment.progress}%</label>
            <input className="field" type="range" min="0" max="100" value={assignment.progress} onChange={(event) => setAssignment({ ...assignment, progress: Number(event.target.value) })} />
          </div>
        </form>
        <div className="mt-4 space-y-3">
          {data.assignments.map((assignment) => (
            <div key={assignment.id} className="rounded-2xl bg-white/[.045] p-4">
              <div className="flex justify-between gap-3 text-sm font-semibold text-white">
                <input className="min-w-0 flex-1 bg-transparent outline-none" value={assignment.title} onChange={(event) => updateAssignment(assignment.id, { title: event.target.value })} />
                <button className="icon-button" onClick={() => setData((current) => ({ ...current, assignments: current.assignments.filter((item) => item.id !== assignment.id) }))} title="Delete assignment" aria-label={`Delete assignment: ${assignment.title || "Untitled assignment"}`}><Trash2 size={15} /></button>
              </div>
              <p className="mt-1 text-xs text-white/42">{assignment.subject} - due in {daysUntil(assignment.due)} days</p>
              <div className="mt-3 flex items-center gap-3">
                <input className="theme-range-b w-full" type="range" min="0" max="100" value={assignment.progress} onChange={(event) => updateAssignment(assignment.id, { progress: Number(event.target.value) })} />
                <span className="w-10 text-right text-xs font-bold text-white/60">{assignment.progress}%</span>
              </div>
            </div>
          ))}
          {!data.assignments.length && <div className="empty-state">No revision tasks yet. Add one above.</div>}
        </div>
      </Card>
      ) : (
        <ProLock title="Pro revision planner">
          <Card className="revision-planner-card">
            <h3 className="section-title"><CalendarClock size={18} /> Revision planner</h3>
            <p className="mt-2 text-sm leading-6 text-white/48">Plan assignment deadlines, revision tasks, chapter practice, and progress tracking with Pro.</p>
          </Card>
        </ProLock>
      )}

      {isPro ? (
      <Card className="goal-tracker-card">
        <h3 className="section-title"><Target size={18} /> Goal tracker</h3>
        <p className="mt-2 text-sm leading-6 text-white/48">Create longer-term academic goals and move the progress slider as you complete work.</p>
        <form onSubmit={addGoal} className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="form-field">
            <label>Goal title</label>
            <input className="field" value={goal.title} onChange={(event) => setGoal({ ...goal, title: event.target.value })} placeholder="Example: Complete all chemistry PYQs this week" />
          </div>
          <button className="primary-button justify-center"><Plus size={18} /> Add</button>
          <div className="form-field md:col-span-2">
            <label>Starting progress: {goal.progress}%</label>
            <input className="field" type="range" min="0" max="100" value={goal.progress} onChange={(event) => setGoal({ ...goal, progress: Number(event.target.value) })} />
          </div>
        </form>
        <div className="mt-4 space-y-3">
          {data.goals.map((goal) => (
            <div key={goal.id} className="rounded-2xl bg-white/[.045] p-4">
              <div className="mb-3 flex items-center justify-between gap-3 text-sm text-white">
                <input className="min-w-0 flex-1 bg-transparent outline-none" value={goal.title} onChange={(event) => updateGoal(goal.id, { title: event.target.value })} />
                <button className="icon-button" onClick={() => setData((current) => ({ ...current, goals: current.goals.filter((item) => item.id !== goal.id) }))} title="Delete goal" aria-label={`Delete goal: ${goal.title || "Untitled goal"}`}><Trash2 size={15} /></button>
              </div>
              <div className="h-2 rounded-full bg-white/10"><div className="theme-fill-a h-full rounded-full" style={{ width: `${goal.progress}%` }} /></div>
              <div className="mt-3 flex items-center gap-3">
                <input className="theme-range-a w-full" type="range" min="0" max="100" value={goal.progress} onChange={(event) => updateGoal(goal.id, { progress: Number(event.target.value) })} />
                <span className="w-10 text-right text-xs font-bold text-white/60">{goal.progress}%</span>
              </div>
            </div>
          ))}
          {!data.goals.length && <div className="empty-state">No goals yet. Add one above.</div>}
        </div>
      </Card>
      ) : (
        <ProLock title="Pro goal tracker">
          <Card className="goal-tracker-card">
            <h3 className="section-title"><Target size={18} /> Goal tracker</h3>
            <p className="mt-2 text-sm leading-6 text-white/48">Track long-term academic goals, progress sliders, and serious study milestones with Pro.</p>
          </Card>
        </ProLock>
      )}
    </div>
  );
}
