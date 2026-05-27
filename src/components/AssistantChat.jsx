import { Crown, Loader2, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { createLocalStudyReply, FREE_AI_LIMIT } from "../utils/studyAssistant";

export default function AssistantChat({ data, setData, setActive, compact = false }) {
  const isPro = data.profile.plan === "pro" || data.profile.proOverride;
  const used = Number(data.ai.messagesUsed || 0);
  const remaining = Math.max(0, FREE_AI_LIMIT - used);
  const locked = !isPro && remaining <= 0;
  const history = data.ai.history || [];
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const context = useMemo(() => ({
    examType: data.profile.examType,
    subjects: data.subjects.map((subject) => subject.name),
    weakTopics: data.subjects.flatMap((subject) => subject.weakTopics || []),
    targetExamDate: data.exams[0]?.date || data.profile.examGoal,
    availableStudyHours: data.profile.availableStudyHours,
    currentTasks: data.tasks.filter((task) => !task.completed).slice(0, 8)
  }), [data]);

  const saveHistory = (nextHistory, increment = false) => {
    setData((current) => ({
      ...current,
      ai: {
        ...current.ai,
        history: nextHistory.slice(-40),
        messagesUsed: increment && !isPro ? Number(current.ai.messagesUsed || 0) + 1 : Number(current.ai.messagesUsed || 0)
      }
    }));
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || locked || loading) return;
    setMessage("");
    setNotice("");
    const userMessage = { id: crypto.randomUUID(), role: "user", content: trimmed, createdAt: new Date().toISOString() };
    const nextHistory = [...history, userMessage];
    saveHistory(nextHistory, true);
    setLoading(true);

    try {
      const response = await fetch("/api/study-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, chatHistory: history.slice(-10), ...context })
      });
      if (!response.ok) throw new Error("Assistant request failed");
      const payload = await response.json();
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: payload.reply || createLocalStudyReply(trimmed, data),
        createdAt: new Date().toISOString()
      };
      saveHistory([...nextHistory, assistantMessage], false);
      if (payload.demo) {
        setNotice(payload.error ? "Groq API request failed, so local study coach mode answered." : "Using local study coach mode until a Groq API key is connected.");
      }
    } catch (error) {
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: createLocalStudyReply(trimmed, data),
        createdAt: new Date().toISOString()
      };
      setNotice("Using local study coach mode because the backend API is not running here.");
      saveHistory([...nextHistory, assistantMessage], false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`assistant-chat ${compact ? "is-compact" : ""}`}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="section-title"><Sparkles size={18} /> AI Study Assistant</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/52">
            Ask for a study plan, revision method, weak-topic fix, test strategy, or focus reset.
          </p>
        </div>
        <div className="sync-badge">{isPro ? "Unlimited Pro" : `${remaining}/${FREE_AI_LIMIT} free left`}</div>
      </div>

      <div className="assistant-messages">
        {!history.length && (
          <div className="empty-state">
            Try: "Make a 3 hour study plan" or "I am stuck on a hard topic".
          </div>
        )}
        {history.map((item) => (
          <div key={item.id} className={`assistant-bubble ${item.role === "user" ? "is-user" : ""}`}>
            <div className="assistant-avatar">{item.role === "user" ? "You" : <Sparkles size={16} />}</div>
            <p>{item.content}</p>
          </div>
        ))}
        {loading && (
          <div className="assistant-bubble">
            <div className="assistant-avatar"><Loader2 className="animate-spin" size={16} /></div>
            <p>Thinking through your study context...</p>
          </div>
        )}
      </div>

      {notice && <div className="mt-3 rounded-2xl bg-white/[.045] p-3 text-xs text-white/50">{notice}</div>}

      {locked ? (
        <div className="mt-4 rounded-2xl border border-dashed border-white/14 bg-white/[.04] p-4 text-center">
          <div className="font-semibold text-white">Upgrade to Pro for unlimited AI Study Assistant.</div>
          {setActive && <button onClick={() => setActive("Premium")} className="primary-button mt-3 justify-center"><Crown size={16} /> Upgrade to Pro</button>}
        </div>
      ) : (
        <form onSubmit={sendMessage} className="assistant-form">
          <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask for a plan, revision strategy, or focus help..." />
          <button disabled={loading || !message.trim()} aria-label="Send message"><Send size={18} /></button>
        </form>
      )}
    </div>
  );
}
