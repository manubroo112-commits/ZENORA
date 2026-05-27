import { Pin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import Card from "../components/Card";

export default function Notes({ notes, setData, query }) {
  const [draft, setDraft] = useState({ title: "", body: "" });
  const visible = notes.filter((note) => `${note.title} ${note.body}`.toLowerCase().includes(query.toLowerCase()));

  const add = (event) => {
    event.preventDefault();
    if (!draft.title.trim() && !draft.body.trim()) return;
    setData((data) => ({ ...data, notes: [{ id: crypto.randomUUID(), pinned: false, ...draft }, ...data.notes] }));
    setDraft({ title: "", body: "" });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <Card>
        <h2 className="section-title"><Plus size={18} /> Quick note</h2>
        <form onSubmit={add} className="mt-4 space-y-3">
          <input className="field" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" />
          <textarea className="field min-h-40 resize-none" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder="Capture study notes, formulas, ideas..." />
          <button className="primary-button w-full justify-center">Save note</button>
        </form>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((note) => (
          <Card key={note.id} className={`${note.pinned ? "border-[#d5b47a]/40" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">{note.title || "Untitled"}</h3>
              <div className="flex gap-2">
                <button title="Pin" className="icon-button" onClick={() => setData((data) => ({ ...data, notes: data.notes.map((item) => item.id === note.id ? { ...item, pinned: !item.pinned } : item) }))}><Pin size={15} /></button>
                <button title="Delete" className="icon-button" onClick={() => setData((data) => ({ ...data, notes: data.notes.filter((item) => item.id !== note.id) }))}><Trash2 size={15} /></button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/52">{note.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
