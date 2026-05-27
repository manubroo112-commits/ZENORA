import { Calculator, ClipboardList, Droplets, GraduationCap, Hourglass, Percent, Plus, Table2, Target, TimerReset } from "lucide-react";
import { useMemo, useState } from "react";
import Card from "../components/Card";
import { daysUntil } from "../utils/date";

const today = new Date().toISOString().slice(0, 10);

export default function Tools({ data, setData }) {
  const [grades, setGrades] = useState([{ grade: 9, credits: 3 }, { grade: 8, credits: 4 }]);
  const [attendance, setAttendance] = useState({ attended: 42, total: 50 });
  const [gradeCalc, setGradeCalc] = useState({ current: 72, finalWeight: 40, target: 85 });
  const [assignment, setAssignment] = useState({ title: "", subject: "", due: today, progress: 0 });
  const [goal, setGoal] = useState({ title: "", progress: 0 });
  const [slot, setSlot] = useState({ day: "Mon", time: "09:00", title: "" });
  const [exam, setExam] = useState({ name: "", date: today });
  const [studyMinutes, setStudyMinutes] = useState(0);

  const gpa = useMemo(() => {
    const credits = grades.reduce((sum, item) => sum + Number(item.credits || 0), 0);
    const points = grades.reduce((sum, item) => sum + Number(item.grade || 0) * Number(item.credits || 0), 0);
    return credits ? (points / credits).toFixed(2) : "0.00";
  }, [grades]);
  const attendancePercent = Math.round((attendance.attended / Math.max(1, attendance.total)) * 100);
  const neededFinal = Math.max(0, ((gradeCalc.target - gradeCalc.current * (1 - gradeCalc.finalWeight / 100)) / (gradeCalc.finalWeight / 100))).toFixed(1);

  const addAssignment = (event) => {
    event.preventDefault();
    if (!assignment.title.trim()) return;
    setData((current) => ({ ...current, assignments: [{ id: crypto.randomUUID(), ...assignment, progress: Number(assignment.progress) }, ...current.assignments] }));
    setAssignment({ title: "", subject: "", due: today, progress: 0 });
  };

  const addGoal = (event) => {
    event.preventDefault();
    if (!goal.title.trim()) return;
    setData((current) => ({ ...current, goals: [{ id: crypto.randomUUID(), ...goal, progress: Number(goal.progress) }, ...current.goals] }));
    setGoal({ title: "", progress: 0 });
  };

  const addSlot = (event) => {
    event.preventDefault();
    if (!slot.title.trim()) return;
    setData((current) => ({ ...current, events: [{ id: crypto.randomUUID(), title: slot.title, type: "Timetable", date: today, time: `${slot.day} ${slot.time}`, color: "var(--button-c)" }, ...current.events] }));
    setSlot({ day: "Mon", time: "09:00", title: "" });
  };

  const addExam = (event) => {
    event.preventDefault();
    if (!exam.name.trim()) return;
    setData((current) => ({
      ...current,
      exams: [{ id: crypto.randomUUID(), ...exam }, ...current.exams],
      events: [{ id: crypto.randomUUID(), title: exam.name, type: "Exam", date: exam.date, time: "09:00", color: "var(--button-b)" }, ...current.events]
    }));
    setExam({ name: "", date: today });
  };

  const logStudyTimer = () => {
    if (!studyMinutes) return;
    setData((current) => ({
      ...current,
      focusStats: { sessions: current.focusStats.sessions + 1, minutes: current.focusStats.minutes + Number(studyMinutes) },
      focusSessions: [{ id: crypto.randomUUID(), mode: "Study timer", minutes: Number(studyMinutes), date: today }, ...current.focusSessions].slice(0, 20)
    }));
    setStudyMinutes(0);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card>
        <h2 className="section-title"><Calculator size={18} /> CGPA calculator</h2>
        <div className="mt-4 space-y-2">
          {grades.map((row, index) => (
            <div key={index} className="grid grid-cols-2 gap-2">
              <div className="form-field">
                <label>Course {index + 1} grade</label>
                <input className="field" type="number" value={row.grade} onChange={(event) => setGrades(grades.map((item, i) => i === index ? { ...item, grade: event.target.value } : item))} placeholder="0-10 grade points" />
              </div>
              <div className="form-field">
                <label>Credits</label>
                <input className="field" type="number" value={row.credits} onChange={(event) => setGrades(grades.map((item, i) => i === index ? { ...item, credits: event.target.value } : item))} placeholder="Example: 4" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button className="pill" onClick={() => setGrades([...grades, { grade: 0, credits: 1 }])}>Add course</button>
          <div className="text-3xl font-semibold text-white">{gpa}</div>
        </div>
      </Card>

      <Card>
        <h2 className="section-title"><Percent size={18} /> Attendance calculator</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="form-field">
            <label>Classes attended</label>
            <input className="field" type="number" value={attendance.attended} onChange={(event) => setAttendance({ ...attendance, attended: Number(event.target.value) })} placeholder="Example: 42" />
          </div>
          <div className="form-field">
            <label>Total classes</label>
            <input className="field" type="number" value={attendance.total} onChange={(event) => setAttendance({ ...attendance, total: Number(event.target.value) })} placeholder="Example: 50" />
          </div>
        </div>
        <div className="mt-4 text-4xl font-semibold text-white">{attendancePercent}%</div>
        <p className="mt-2 text-sm text-white/45">{attendancePercent >= 75 ? "Attendance is healthy." : "Attend the next few classes."}</p>
      </Card>

      <Card>
        <h2 className="section-title"><GraduationCap size={18} /> Grade calculator</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="form-field">
            <label>Current grade %</label>
            <input className="field" type="number" value={gradeCalc.current} onChange={(event) => setGradeCalc({ ...gradeCalc, current: Number(event.target.value) })} placeholder="Example: 72" />
          </div>
          <div className="form-field">
            <label>Final exam weight %</label>
            <input className="field" type="number" value={gradeCalc.finalWeight} onChange={(event) => setGradeCalc({ ...gradeCalc, finalWeight: Number(event.target.value) })} placeholder="Example: 40" />
          </div>
          <div className="form-field">
            <label>Target grade %</label>
            <input className="field" type="number" value={gradeCalc.target} onChange={(event) => setGradeCalc({ ...gradeCalc, target: Number(event.target.value) })} placeholder="Example: 85" />
          </div>
        </div>
        <p className="mt-4 text-sm text-white/55">Need <span className="text-xl font-semibold text-white">{neededFinal}%</span> on the final to hit target.</p>
      </Card>

      <Card>
        <h2 className="section-title"><TimerReset size={18} /> Study timer</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_4.75rem] sm:items-end">
          <div className="form-field">
            <label>Minutes studied</label>
            <input className="field" type="number" value={studyMinutes} onChange={(event) => setStudyMinutes(Number(event.target.value))} placeholder="Example: 45" />
          </div>
          <button className="primary-button form-action" onClick={logStudyTimer}>Log</button>
          <p className="field-help sm:col-span-2">Logs time into Focus stats and session history.</p>
        </div>
      </Card>

      <Card>
        <h2 className="section-title"><ClipboardList size={18} /> Assignment tracker</h2>
        <form onSubmit={addAssignment} className="mt-4 grid gap-3">
          <div className="form-field">
            <label>Assignment title</label>
            <input className="field" value={assignment.title} onChange={(event) => setAssignment({ ...assignment, title: event.target.value })} placeholder="Example: English essay draft" />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="form-field">
              <label>Subject</label>
              <input className="field" value={assignment.subject} onChange={(event) => setAssignment({ ...assignment, subject: event.target.value })} placeholder="Example: English" />
            </div>
            <div className="form-field">
              <label>Due date</label>
              <input className="field" type="date" value={assignment.due} onChange={(event) => setAssignment({ ...assignment, due: event.target.value })} />
            </div>
            <div className="form-field">
              <label>Progress %</label>
              <input className="field" type="number" min="0" max="100" value={assignment.progress} onChange={(event) => setAssignment({ ...assignment, progress: event.target.value })} placeholder="0-100" />
            </div>
          </div>
          <button className="primary-button justify-center"><Plus size={18} /> Add assignment</button>
        </form>
        <div className="mt-4 space-y-2">
          {data.assignments.slice(0, 3).map((item) => (
            <div key={item.id} className="rounded-2xl bg-white/[.045] p-3 text-sm text-white/70">
              <div className="flex items-center justify-between gap-3"><span className="font-semibold text-white">{item.title}</span><span>{item.progress}%</span></div>
              <div className="mt-1 text-xs text-white/40">{item.subject || "General"} - {daysUntil(item.due)}d left</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="section-title"><Table2 size={18} /> Timetable maker</h2>
        <form onSubmit={addSlot} className="mt-4 grid gap-3">
          <div className="form-field">
            <label>Timetable item</label>
            <input className="field" value={slot.title} onChange={(event) => setSlot({ ...slot, title: event.target.value })} placeholder="Example: Chemistry coaching" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="form-field">
              <label>Day</label>
              <select className="field" value={slot.day} onChange={(event) => setSlot({ ...slot, day: event.target.value })}>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <option key={day}>{day}</option>)}</select>
            </div>
            <div className="form-field">
              <label>Time</label>
              <input className="field" type="time" value={slot.time} onChange={(event) => setSlot({ ...slot, time: event.target.value })} />
            </div>
          </div>
          <button className="primary-button justify-center"><Plus size={18} /> Add slot</button>
        </form>
        <div className="mt-4 space-y-2">
          {data.events.filter((event) => event.type === "Timetable").slice(0, 3).map((event) => (
            <div key={event.id} className="rounded-2xl bg-white/[.045] p-3 text-sm text-white/70">
              <span className="font-semibold text-white">{event.title}</span> at {event.time}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="section-title"><Target size={18} /> Goal tracker</h2>
        <form onSubmit={addGoal} className="mt-4 grid gap-3">
          <div className="form-field">
            <label>Goal title</label>
            <input className="field" value={goal.title} onChange={(event) => setGoal({ ...goal, title: event.target.value })} placeholder="Example: Finish 5 practice tests" />
          </div>
          <div className="form-field">
            <label>Progress %</label>
            <input className="field" type="number" min="0" max="100" value={goal.progress} onChange={(event) => setGoal({ ...goal, progress: event.target.value })} placeholder="0-100" />
          </div>
          <button className="primary-button justify-center"><Plus size={18} /> Add goal</button>
        </form>
        <div className="mt-4 space-y-2">
          {data.goals.slice(0, 3).map((item) => (
            <div key={item.id} className="rounded-2xl bg-white/[.045] p-3">
              <div className="mb-2 flex justify-between text-sm text-white"><span>{item.title}</span><span>{item.progress}%</span></div>
              <div className="h-2 rounded-full bg-white/10"><div className="theme-fill-a h-full rounded-full" style={{ width: `${item.progress}%` }} /></div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="section-title"><Droplets size={18} /> Water intake</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <button key={index} onClick={() => setData((current) => ({ ...current, water: index + 1 }))} className={`water-button grid h-12 w-12 place-items-center rounded-2xl border ${index < data.water ? "is-filled" : ""}`}>
              <Droplets size={17} />
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-white/45">{data.water}/8 glasses today</p>
      </Card>

      <Card>
        <h2 className="section-title"><Hourglass size={18} /> Exam countdown</h2>
        <form onSubmit={addExam} className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="form-field">
            <label>Exam name</label>
            <input className="field" value={exam.name} onChange={(event) => setExam({ ...exam, name: event.target.value })} placeholder="Example: Physics final" />
          </div>
          <div className="form-field">
            <label>Exam date</label>
            <input className="field" type="date" value={exam.date} onChange={(event) => setExam({ ...exam, date: event.target.value })} />
          </div>
          <button className="primary-button justify-center"><Plus size={18} /> Add</button>
        </form>
        <div className="mt-4 space-y-3">
          {data.exams.map((exam) => (
            <div key={exam.id} className="flex items-center justify-between rounded-2xl bg-white/[.045] p-4">
              <div><div className="font-medium text-white">{exam.name}</div><div className="text-xs text-white/40">{exam.date}</div></div>
              <div className="text-2xl font-semibold text-white">{daysUntil(exam.date)}d</div>
            </div>
          ))}
          {!data.exams.length && <div className="empty-state">No exams yet. Add exam dates from Calendar or Study Planner.</div>}
        </div>
      </Card>
    </div>
  );
}
