import { Calculator, Droplets, GraduationCap, Hourglass } from "lucide-react";
import { useMemo, useState } from "react";
import Card from "../components/Card";
import { daysUntil } from "../utils/date";

export default function Tools({ data, setData }) {
  const [grades, setGrades] = useState([{ grade: 9, credits: 3 }, { grade: 8, credits: 4 }]);
  const gpa = useMemo(() => {
    const credits = grades.reduce((sum, item) => sum + Number(item.credits || 0), 0);
    const points = grades.reduce((sum, item) => sum + Number(item.grade || 0) * Number(item.credits || 0), 0);
    return credits ? (points / credits).toFixed(2) : "0.00";
  }, [grades]);

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card>
        <h2 className="section-title"><Calculator size={18} /> GPA calculator</h2>
        <div className="mt-4 space-y-2">
          {grades.map((row, index) => (
            <div key={index} className="grid grid-cols-2 gap-2">
              <input className="field" type="number" value={row.grade} onChange={(e) => setGrades(grades.map((item, i) => i === index ? { ...item, grade: e.target.value } : item))} placeholder="Grade points" />
              <input className="field" type="number" value={row.credits} onChange={(e) => setGrades(grades.map((item, i) => i === index ? { ...item, credits: e.target.value } : item))} placeholder="Credits" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button className="pill" onClick={() => setGrades([...grades, { grade: 0, credits: 1 }])}>Add course</button>
          <div className="text-3xl font-semibold text-white">{gpa}</div>
        </div>
      </Card>
      <Card>
        <h2 className="section-title"><Droplets size={18} /> Water intake</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <button key={index} onClick={() => setData((current) => ({ ...current, water: index + 1 }))} className={`h-12 w-12 rounded-2xl border ${index < data.water ? "border-[#d5b47a] bg-[#d5b47a]/20 text-[#f4eadc]" : "border-white/10 bg-white/[.04] text-white/30"}`}>●</button>
          ))}
        </div>
        <p className="mt-4 text-sm text-white/45">{data.water}/8 glasses today</p>
      </Card>
      <Card>
        <h2 className="section-title"><Hourglass size={18} /> Exam countdown</h2>
        <div className="mt-4 space-y-3">
          {data.exams.map((exam) => (
            <div key={exam.id} className="flex items-center justify-between rounded-2xl bg-white/[.045] p-4">
              <div><div className="font-medium text-white">{exam.name}</div><div className="text-xs text-white/40">{exam.date}</div></div>
              <div className="text-2xl font-semibold text-white">{daysUntil(exam.date)}d</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="section-title"><GraduationCap size={18} /> Daily study planner</h2>
        <div className="mt-4 grid gap-3">
          {["Deep work", "Practice problems", "Active recall", "Light review"].map((item, index) => (
            <div key={item} className="rounded-2xl bg-white/[.045] p-4 text-sm text-white/68">{index + 1}. {item}</div>
          ))}
        </div>
      </Card>
    </div>
  );
}
