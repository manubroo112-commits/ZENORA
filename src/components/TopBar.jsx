import { Command, Menu, Search } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "../utils/date";

export default function TopBar({ active, query, setQuery }) {
  return (
    <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-30 -mx-4 mb-6 px-4 py-4 backdrop-blur-xl md:-mx-6 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[.24em] text-white/38">
            <Menu size={14} className="lg:hidden" /> {formatDate()}
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white md:text-4xl">{active}</h1>
        </div>
        <label className="glass flex h-12 items-center gap-3 rounded-2xl px-4 text-white/45 md:w-80">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, notes, goals" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
          <Command size={15} />
        </label>
      </div>
    </motion.header>
  );
}
