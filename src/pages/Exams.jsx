import { CalendarClock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import Card from "../components/Card";
import { daysUntil } from "../utils/date";

const blank = { name: "", type: "Exam", date: new Date().toISOString().slice(0, 10), syllabusProgress: 0 };

const urgency = (days) => {
  if (days <= 7) return ["Critical", "text-rose-200", "var(--button-a)"];
  if (days <= 30) return ["High", "text-amber-200", "var(--button-b)"];
  return ["Steady", "text-emerald-200", "var(--button-c)"];
};

export default function Exams({ data, setData }) {
  const [form, setForm] = useState(blank);
  const editing = Boolean(form.id);

  const saveExam = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    const payload = { ...form, syllabusProgress: Number(form.syllabusProgress) || 0 };
    setData((current) => ({
      ...current,
      exams: editing
        ? current.exams.map((exam) => exam.id === form.id ? payload : exam)
        : [{ id: crypto.randomUUID(), ...payload }, ...current.exams]
    }));
    setForm(blank);
  };

  const removeExam = (id) => setData((current) => ({ ...current, exams: current.exams.filter((exam) => exam.id !== id) }));

  return (
    <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <Card>
        <h2 className="section-title"><CalendarClock size={18} /> {editing ? "Edit exam" : "Add exam countdown"}</h2>
        <p className="mt-2 text-sm leading-6 text-white/48">Track exams, practice tests, project deadlines, certifications, and important academic dates in one calm place.</p>
        <form onSubmit={saveExam} className="mt-5 space-y-3">
          <div className="form-field">
            <label>Exam name</label>
            <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Example: Biology final, SAT, IELTS, certification exam" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="form-field">
              <label>Exam type</label>
              <select className="field" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                {["Exam", "Practice test", "Assignment", "Project", "Certification", "Interview", "Other"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Exam date</label>
              <input className="field" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
            </div>
          </div>
          <div className="form-field">
            <label>Syllabus completed: {form.syllabusProgress}%</label>
            <input className="field" type="range" min="0" max="100" value={form.syllabusProgress} onChange={(event) => setForm({ ...form, syllabusProgress: Number(event.target.value) })} />
            <p className="field-help">This helps the dashboard show urgency clearly.</p>
          </div>
          <button className="primary-button w-full justify-center"><Plus size={18} /> {editing ? "Save exam" : "Add exam"}</button>
        </form>
      </Card>

      <div className="grid gap-4">
        {data.exams.map((exam) => {
          const days = daysUntil(exam.date);
          const [label, className, color] = urgency(days);
          return (
            <Card key={exam.id} className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="inline-flex rounded-full bg-white/[.055] px-3 py-1 text-xs text-white/50">{exam.type}</div>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{exam.name}</h3>
                  <p className="mt-1 text-sm text-white/45">{exam.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="pill" onClick={() => setForm(exam)}>Edit</button>
                  <button className="icon-button" onClick={() => removeExam(exam.id)} title="Delete exam"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
                <div className="rounded-3xl bg-white/[.045] p-5 text-center">
                  <div className="text-4xl font-semibold text-white">{days}</div>
                  <div className="text-xs text-white/42">days left</div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className={className}>{label} urgency</span>
                    <span className="text-white/45">{exam.syllabusProgress || 0}% syllabus</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: `${exam.syllabusProgress || 0}%`, background: color }} />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
        {!data.exams.length && <Card><div className="empty-state">No exams yet. Add your target exam date to start the countdown.</div></Card>}
      </div>
    </div>
  );
}
