import { Command, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "../utils/date";

export default function TopBar({ active, query, setQuery }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef(null);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const timeout = setTimeout(() => searchInput.current?.focus(), 80);
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen]);

  return (
    <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="app-topbar relative z-20 -mx-4 mb-5 px-4 py-4 md:-mx-6 md:mb-6 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="top-date flex items-center gap-2 text-xs uppercase tracking-[.24em]">
            {formatDate()}
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-4xl">{active}</h1>
        </div>
        <button className="mobile-search-trigger" onClick={() => setSearchOpen(true)} aria-label="Open search">
          <Search size={19} />
        </button>
        <label className="glass search-shell hidden h-12 items-center gap-3 rounded-2xl px-4 md:flex md:w-80">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, notes, goals" className="w-full bg-transparent text-sm outline-none" />
          <Command size={15} />
        </label>
      </div>

      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="search-modal"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="glass search-modal-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <Search size={19} />
            <input
              ref={searchInput}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tasks, notes, goals"
            />
            <button onClick={() => setSearchOpen(false)} aria-label="Close search">
              <X size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.header>
  );
}
