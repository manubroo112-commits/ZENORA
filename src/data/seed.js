const today = new Date();
const iso = (offset = 0) => {
  const date = new Date(today);
  date.setDate(today.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

export const seedData = {
  profile: {
    name: "Aarav",
    goal: "Become 1% sharper every day",
    accent: "#9b6f43",
    dark: true,
    notifications: true
  },
  tasks: [
    { id: crypto.randomUUID(), title: "Revise organic chemistry mechanisms", category: "Study", priority: "High", due: iso(0), completed: false },
    { id: crypto.randomUUID(), title: "Submit calculus assignment", category: "Assignment", priority: "High", due: iso(1), completed: false },
    { id: crypto.randomUUID(), title: "Read 20 pages of economics", category: "Study", priority: "Medium", due: iso(0), completed: true },
    { id: crypto.randomUUID(), title: "Prepare exam flashcards", category: "Exam", priority: "Medium", due: iso(3), completed: false }
  ],
  habits: [
    { id: crypto.randomUUID(), name: "Morning revision", color: "#d5b47a", streak: 8, history: [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1], doneToday: true },
    { id: crypto.randomUUID(), name: "No phone study block", color: "#9aa77e", streak: 5, history: [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1], doneToday: false },
    { id: crypto.randomUUID(), name: "Drink water", color: "#b8795b", streak: 12, history: [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1], doneToday: true }
  ],
  notes: [
    { id: crypto.randomUUID(), title: "Physics insight", body: "Derive first, memorize later. Rebuild formulas from dimensions before practice.", pinned: true },
    { id: crypto.randomUUID(), title: "Essay structure", body: "Claim, evidence, contrast, implication. Keep topic sentences sharp.", pinned: false }
  ],
  sessions: [
    { day: "Mon", hours: 3.5, tasks: 7, habits: 75 },
    { day: "Tue", hours: 2, tasks: 5, habits: 62 },
    { day: "Wed", hours: 4.25, tasks: 9, habits: 88 },
    { day: "Thu", hours: 1.5, tasks: 4, habits: 52 },
    { day: "Fri", hours: 5, tasks: 11, habits: 92 },
    { day: "Sat", hours: 3, tasks: 6, habits: 71 },
    { day: "Sun", hours: 2.5, tasks: 5, habits: 66 }
  ],
  water: 5,
  exams: [
    { id: crypto.randomUUID(), name: "Physics Midterm", date: iso(12) },
    { id: crypto.randomUUID(), name: "Statistics Quiz", date: iso(5) }
  ],
  focusStats: { sessions: 9, minutes: 225 }
};
