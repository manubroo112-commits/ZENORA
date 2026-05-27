import Groq from "groq-sdk";

const fallbackPlan = ({ examType = "General study", availableStudyHours = 4, weakTopics = [] }) => ({
  plan: [
    `Block 1: revise ${weakTopics[0] || "your weakest topic"} for 45 minutes.`,
    "Block 2: solve timed practice questions and mark mistakes.",
    "Block 3: review notes and create a short recall sheet.",
    "Block 4: do one test review or past-paper question set."
  ],
  reply: `Local ${examType} plan for ${availableStudyHours} available hours. Keep the first block revision-heavy, the middle block practice-heavy, and the final block focused on mistakes.`,
  demo: true
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST for the study planner." });
  }

  const body = req.body || {};
  if (!process.env.GROQ_API_KEY) {
    return res.status(200).json(fallbackPlan(body));
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      temperature: 0.45,
      max_tokens: 800,
      messages: [
        { role: "system", content: "Create a concise student study plan. Use numbered blocks, practice targets, revision, and test review when useful." },
        { role: "user", content: JSON.stringify(body) }
      ]
    });

    return res.status(200).json({
      reply: completion.choices?.[0]?.message?.content || fallbackPlan(body).reply,
      demo: false
    });
  } catch (error) {
    return res.status(200).json({
      ...fallbackPlan(body),
      error: "Groq request failed, so a demo plan was returned."
    });
  }
}
