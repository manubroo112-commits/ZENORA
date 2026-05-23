import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import Card from "../components/Card";
import TaskItem from "../components/TaskItem";

const blank = { title: "", category: "Study", priority: "Medium", due: new Date().toISOString().slice(0, 10) };

export default function Tasks({ tasks, setData, query }) {
  const [form, setForm] = useState(blank);
  const [filter, setFilter] = useState("All");
  const [dragged, setDragged] = useState(null);
  const editing = Boolean(form.id);

  const visible = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === "All" || task.category === filter || (filter === "Active" && !task.completed) || (filter === "Done" && task.completed);
    const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  }), [tasks, filter, query]);

  const completed = tasks.filter((task) => task.completed).length;

  const saveTask = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    setData((data) => ({
      ...data,
      tasks: editing
        ? data.tasks.map((task) => (task.id === form.id ? { ...task, ...form } : task))
        : [{ id: crypto.randomUUID(), completed: false, ...form }, ...data.tasks]
    }));
    setForm(blank);
  };

  const moveTask = (targetId) => {
    if (!dragged || dragged === targetId) return;
    setData((data) => {
      const next = [...data.tasks];
      const from = next.findIndex((task) => task.id === dragged);
      const to = next.findIndex((task) => task.id === targetId);
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return { ...data, tasks: next };
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
      <Card>
        <h2 className="section-title"><Plus size={18} /> {editing ? "Edit task" : "Add task"}</h2>
        <form onSubmit={saveTask} className="mt-4 space-y-3">
          <input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs your attention?" />
          <div className="grid grid-cols-2 gap-3">
            <select className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["Study", "Personal", "Assignment", "Exam"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select className="field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {["High", "Medium", "Low"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <input type="date" className="field" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          <button className="primary-button w-full justify-center">{editing ? "Save changes" : "Create task"}</button>
        </form>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs text-white/45"><span>Progress</span><span>{completed}/{tasks.length}</span></div>
          <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#b8795b] via-[#d5b47a] to-[#9aa77e]" style={{ width: `${(completed / Math.max(1, tasks.length)) * 100}%` }} /></div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap gap-2">
          {["All", "Active", "Done", "Study", "Assignment", "Exam", "Personal"].map((item) => (
            <button key={item} onClick={() => setFilter(item)} className={`pill ${filter === item ? "bg-white text-black" : ""}`}>{item}</button>
          ))}
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {visible.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={(id) => setData((data) => ({ ...data, tasks: data.tasks.map((item) => item.id === id ? { ...item, completed: !item.completed } : item) }))}
                onDelete={(id) => setData((data) => ({ ...data, tasks: data.tasks.filter((item) => item.id !== id) }))}
                onEdit={setForm}
                draggableProps={{
                  draggable: true,
                  onDragStart: () => setDragged(task.id),
                  onDragOver: (event) => event.preventDefault(),
                  onDrop: () => moveTask(task.id)
                }}
              />
            ))}
          </AnimatePresence>
          {!visible.length && <div className="empty-state">No tasks found. Your future self is oddly relaxed.</div>}
        </div>
      </Card>
    </div>
  );
}
