import Groq from "groq-sdk";

const demoResponse = ({ message, examType, weakTopics = [], subjects = [], availableStudyHours = 0 }) => {
  const text = String(message || "").toLowerCase();
  const subject = subjects[0] || "your main subject";
  const weakTopic = weakTopics[0] || "your weakest topic";

  let reply = [
    `Local study coach mode for ${examType || "general study"}:`,
    `1. Choose one clear action related to "${message}".`,
    "2. Work for 25 minutes without switching tabs.",
    "3. Write down the exact mistake or confusion.",
    "4. Turn it into one follow-up task."
  ].join("\n");

  if (text.includes("plan") || text.includes("schedule") || text.includes("timetable")) {
    reply = [
      `Here is a ${availableStudyHours || 3} hour study plan:`,
      `1. Warm up with ${subject} revision for 30 minutes.`,
      "2. Do one deep practice block.",
      "3. Review mistakes and summarize them in Notes.",
      "4. End with a short recall test."
    ].join("\n");
  } else if (text.includes("weak") || text.includes("hard") || text.includes("stuck")) {
    reply = [
      `For ${weakTopic}, use a recovery loop:`,
      "1. Relearn the smallest missing concept.",
      "2. Solve 5 easy examples.",
      "3. Solve 10 timed questions.",
      "4. Save the mistake pattern for tomorrow's revision."
    ].join("\n");
  }

  return { reply, suggestions: [], demo: true };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST for the study assistant." });
  }

  const {
    message = "",
    chatHistory = [],
    examType = "General study",
    subjects = [],
    weakTopics = [],
    targetExamDate = "",
    availableStudyHours = 0,
    currentTasks = []
  } = req.body || {};

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("Missing GROQ_API_KEY in environment variables.");
    return res.status(200).json(
      demoResponse({ message, examType, weakTopics, subjects, availableStudyHours })
    );
  }

  try {
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      temperature: 0.55,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content:
            "You are ZENORA AI Study Assistant. Give practical, short, student-friendly answers. Help with study plans, revision, weak topics, tests, focus, and timetables."
        },
        {
          role: "user",
          content: JSON.stringify({
            request: message,
            context: {
              examType,
              subjects,
              weakTopics,
              targetExamDate,
              availableStudyHours,
              currentTasks
            },
            recentChat: chatHistory.slice(-8)
          })
        }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content;

    return res.status(200).json({
      reply: reply || "I could not generate a response. Please try again.",
      suggestions: [],
      demo: false
    });
  } catch (error) {
    console.error("Groq API error:", error?.message || error);

    return res.status(500).json({
      error: "Groq request failed.",
      details: error?.message || "Unknown error"
    });
  }
}