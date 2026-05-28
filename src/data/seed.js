export const seedData = {
  profile: {
    name: "Student",
    goal: "Build a calm, consistent study routine",
    examGoal: "",
    examType: "General",
    availableStudyHours: 0,
    theme: "sage",
    accent: "#7FA88E",
    dark: false,
    notifications: true,
    plan: "free",
    role: "Student",
    proOverride: false
  },
  tasks: [],
  habits: [],
  notes: [],
  events: [],
  subjects: [],
  assignments: [],
  goals: [],
  focusSessions: [],
  sessions: [
    { day: "Mon", hours: 0, tasks: 0, habits: 0 },
    { day: "Tue", hours: 0, tasks: 0, habits: 0 },
    { day: "Wed", hours: 0, tasks: 0, habits: 0 },
    { day: "Thu", hours: 0, tasks: 0, habits: 0 },
    { day: "Fri", hours: 0, tasks: 0, habits: 0 },
    { day: "Sat", hours: 0, tasks: 0, habits: 0 },
    { day: "Sun", hours: 0, tasks: 0, habits: 0 }
  ],
  water: 0,
  exams: [],
  todayMission: {
    goals: [],
    mcqTarget: 0,
    mcqDone: 0,
    revisionTarget: "",
    revisionDone: false,
    mockTest: "",
    mockDone: false
  },
  gamification: {
    xp: 0,
    level: 1,
    streak: 0,
    badges: []
  },
  ai: {
    messagesUsed: 0,
    history: []
  },
  focusStats: { sessions: 0, minutes: 0 },
  preferences: { compactMode: false, sound: true, weeklyDigest: true, defaultsCleared: true, globalBlankDefaultsV2: false, staticLightThemeV1: true, sageThemeBoxV1: true }
};
