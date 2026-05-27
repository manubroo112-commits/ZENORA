import { Pin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import Card from "../components/Card";

const categories = ["General", "Physics", "Math", "Writing", "Revision"];

export default function Notes({ notes, setData, query }) {
  const [draft, setDraft] = useState({ title: "", category: "General", body: "" });
  const [category, setCategory] = useState("All");
  const visible = notes.filter((note) => {
    const text = `${note.title} ${note.body} ${note.category || ""}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (category === "All" || (note.category || "General") === category);
  }).sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const add = (event) => {
    event.preventDefault();
    if (!draft.title.trim() && !draft.body.trim()) return;
    setData((data) => ({ ...data, notes: [{ id: crypto.randomUUID(), pinned: false, ...draft }, ...data.notes] }));
    setDraft({ title: "", category: "General", body: "" });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <Card>
        <h2 className="section-title"><Plus size={18} /> Quick note</h2>
        <form onSubmit={add} className="mt-4 space-y-3">
          <div className="form-field">
            <label>Note title</label>
            <input className="field" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Example: Photosynthesis key points" />
          </div>
          <div className="form-field">
            <label>Note category</label>
            <select className="field" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Note body</label>
            <textarea className="field min-h-40 resize-none" value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} placeholder="Example: ## Important formulas&#10;- Write one idea per line&#10;- Mark doubts for revision" />
            <p className="field-help">Simple markdown-style notes are supported visually: headings, bullets, and bold markers.</p>
          </div>
          <button className="primary-button w-full justify-center">Save note</button>
        </form>
      </Card>
      <div>
        <div className="mb-4 flex flex-wrap gap-2">
          {["All", ...categories].map((item) => <button key={item} onClick={() => setCategory(item)} className={`pill ${category === item ? "bg-white text-black" : ""}`}>{item}</button>)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((note) => (
            <Card key={note.id} className={`${note.pinned ? "theme-accent-border" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{note.title || "Untitled"}</h3>
                  <p className="mt-1 text-xs text-white/40">{note.category || "General"}</p>
                </div>
                <div className="flex gap-2">
                  <button title="Pin" className="icon-button" onClick={() => setData((data) => ({ ...data, notes: data.notes.map((item) => item.id === note.id ? { ...item, pinned: !item.pinned } : item) }))}><Pin size={15} /></button>
                  <button title="Delete" className="icon-button" onClick={() => setData((data) => ({ ...data, notes: data.notes.filter((item) => item.id !== note.id) }))}><Trash2 size={15} /></button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/52">{note.body.replaceAll("## ", "").replaceAll("**", "")}</p>
            </Card>
          ))}
          {!visible.length && <div className="empty-state md:col-span-2">No notes found. Capture one before the thought evaporates.</div>}
        </div>
      </div>
    </div>
  );
}
