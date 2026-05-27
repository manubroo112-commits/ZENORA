const pickSubject = (data) => data.subjects?.[0]?.name || "your main subject";
const pickWeakTopic = (data) => data.subjects?.flatMap((subject) => subject.weakTopics || [])?.[0] || "the topic that feels hardest right now";
const openTasks = (data) => data.tasks?.filter((task) => !task.completed).slice(0, 3).map((task) => task.title) || [];

export const FREE_AI_LIMIT = 30;

export function createLocalStudyReply(message, data) {
  const trimmedMessage = String(message || "").trim();
  const text = trimmedMessage.toLowerCase();
  const subject = pickSubject(data);
  const weakTopic = pickWeakTopic(data);
  const hours = Number(data.profile.availableStudyHours || 0);
  const tasks = openTasks(data);
  const goal = data.profile.examGoal || data.profile.goal || "your study goal";

  if (text.includes("plan") || text.includes("schedule") || text.includes("timetable") || text.includes("today")) {
    return [
      `Here is a practical plan for ${goal}:`,
      `1. Start with ${subject} for 45 minutes and write a tiny checklist before you begin.`,
      `2. Spend ${hours > 0 ? Math.min(hours, 2) : 1} hour${hours === 1 ? "" : "s"} on active recall or practice questions.`,
      "3. Review mistakes immediately, then convert the top mistake into one task.",
      tasks.length ? `4. Protect one existing task: ${tasks[0]}.` : "4. Add one clear task so tomorrow starts with less friction."
    ].join("\n");
  }

  if (text.includes("weak") || text.includes("hard") || text.includes("difficult") || text.includes("stuck")) {
    return [
      `For ${weakTopic}, use a three-pass recovery loop:`,
      "1. Relearn only the smallest concept that blocks you.",
      "2. Solve 5 easy questions without time pressure.",
      "3. Solve 10 timed questions and mark every mistake pattern.",
      "4. Add the mistake pattern to Notes so it becomes reusable revision material."
    ].join("\n");
  }

  if (text.includes("revise") || text.includes("revision") || text.includes("remember") || text.includes("memorize")) {
    return [
      "Use spaced revision instead of rereading:",
      "1. Close the notes and write what you remember.",
      "2. Check gaps in a different color.",
      "3. Do a short practice set.",
      "4. Revisit the same topic tomorrow for 10 minutes."
    ].join("\n");
  }

  if (text.includes("mock") || text.includes("test") || text.includes("exam") || text.includes("quiz")) {
    return [
      "For the next test, focus on analysis more than score:",
      "1. Attempt under real timing.",
      "2. Split mistakes into concept, calculation, memory, and time-pressure errors.",
      "3. Pick only the top two error types to fix this week.",
      "4. Schedule one lighter revision block after the test so burnout does not carry forward."
    ].join("\n");
  }

  if (text.includes("focus") || text.includes("procrast") || text.includes("distract") || text.includes("phone")) {
    return [
      "Try a low-friction focus reset:",
      "1. Put one task on screen and hide everything else.",
      "2. Run a 25 minute timer.",
      "3. Keep a scratch note for distractions instead of reacting to them.",
      "4. After the timer, stop or continue by choice. Momentum works better than pressure."
    ].join("\n");
  }

  if (trimmedMessage.length <= 2) {
    return [
      "Tell me the subject, chapter, or task you want help with and I will make it specific.",
      "",
      `For now, start with ${subject}:`,
      "1. Pick one small task you can finish in 25 minutes.",
      "2. Work without switching tabs.",
      "3. Write the exact confusing part.",
      "4. Save one follow-up note for the next session."
    ].join("\n");
  }

  return [
    `Here is a quick next action for "${trimmedMessage}":`,
    `1. Connect it to ${subject}.`,
    "2. Work for 25 minutes.",
    "3. Record what was confusing.",
    "4. Add one follow-up task or note so the next session is easier."
  ].join("\n");
}
