import { Command, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "../utils/date";

export default function TopBar({ active, query, setQuery }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef(null);
  const searchPanel = useRef(null);
  const searchTrigger = useRef(null);
  const pageTitle = useRef(null);

  const closeSearch = () => {
    setSearchOpen(false);
    setTimeout(() => searchTrigger.current?.focus(), 0);
  };

  useEffect(() => {
    pageTitle.current?.focus({ preventScroll: true });
  }, [active]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const timeout = setTimeout(() => searchInput.current?.focus(), 80);
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeSearch();
      if (event.key === "Tab" && searchPanel.current) {
        const focusable = searchPanel.current.querySelectorAll("button, input, select, textarea, [tabindex]:not([tabindex='-1'])");
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen]);

  return (
    <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="app-topbar relative z-20 -mx-4 mb-5 px-4 py-4 md:-mx-6 md:mb-6 md:px-6" aria-label="Current section">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="top-date flex items-center gap-2 text-xs uppercase tracking-[.24em]">
            {formatDate()}
          </div>
          <h1 ref={pageTitle} tabIndex={-1} className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-4xl">{active}</h1>
        </div>
        <button ref={searchTrigger} className="mobile-search-trigger" onClick={() => setSearchOpen(true)} aria-label="Open search" aria-expanded={searchOpen} aria-controls="zenora-search-dialog">
          <Search size={19} />
        </button>
        <label className="glass search-shell hidden h-12 items-center gap-3 rounded-2xl px-4 md:flex md:w-80" aria-label="Search workspace">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, notes, goals" className="w-full bg-transparent text-sm outline-none" aria-label="Search tasks, notes, and goals" />
          <Command size={15} />
        </label>
      </div>

      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="search-modal"
          id="zenora-search-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Search workspace"
          onClick={closeSearch}
        >
          <motion.div
            ref={searchPanel}
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
              aria-label="Search tasks, notes, and goals"
            />
            <button onClick={closeSearch} aria-label="Close search">
              <X size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.header>
  );
}
