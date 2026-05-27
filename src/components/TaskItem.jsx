import { Calendar, GripVertical, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const priorityClass = {
  High: "bg-rose-400/15 text-rose-200",
  Medium: "bg-amber-400/15 text-amber-200",
  Low: "bg-emerald-400/15 text-emerald-200"
};

export default function TaskItem({ task, onToggle, onDelete, onEdit, draggableProps = {} }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] p-3"
      {...draggableProps}
    >
      <GripVertical className="hidden h-4 w-4 cursor-grab text-white/25 md:block" />
      <button onClick={() => onToggle(task.id)} className={`h-5 w-5 rounded-full border transition ${task.completed ? "border-[#d5b47a] bg-[#d5b47a] shadow-[0_0_18px_rgba(213,180,122,.45)]" : "border-white/25"}`} aria-label="Toggle task" />
      <div className="min-w-0 flex-1">
        <div className={`truncate text-sm font-medium ${task.completed ? "text-white/38 line-through" : "text-white"}`}>{task.title}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-white/42">
          <span>{task.category}</span>
          <span className="flex items-center gap-1"><Calendar size={12} />{task.due}</span>
        </div>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-[11px] ${priorityClass[task.priority]}`}>{task.priority}</span>
      <button onClick={() => onEdit(task)} className="icon-button opacity-75 md:opacity-0 md:group-hover:opacity-100" title="Edit task"><Pencil size={15} /></button>
      <button onClick={() => onDelete(task.id)} className="icon-button opacity-75 md:opacity-0 md:group-hover:opacity-100" title="Delete task"><Trash2 size={15} /></button>
    </motion.div>
  );
}
