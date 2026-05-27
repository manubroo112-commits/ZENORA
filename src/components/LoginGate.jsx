import { BarChart3, BookOpenCheck, Brain, CheckSquare, Cloud, Crown, LogIn, ShieldCheck, Sparkles, TimerReset } from "lucide-react";
import { motion } from "framer-motion";

const statusText = {
  "not-configured": "Firebase setup needed",
  "signed-out": "Sign in required",
  offline: "Preparing secure login",
  loading: "Connecting to Google",
  saving: "Syncing workspace",
  synced: "Cloud synced"
};

export default function LoginGate({ cloud, onLocalAccess }) {
  const canUseGoogle = cloud.configured;
  const busy = cloud.status === "loading";
  const features = [
    ["Study planner", "Plan subjects, revision work, assignments, and long-term academic goals.", BookOpenCheck],
    ["Focus timer", "Run focused study blocks and keep a clean history of completed sessions.", TimerReset],
    ["Tasks and habits", "Track daily study tasks, routines, streaks, and consistent progress.", CheckSquare],
    ["AI study assistant", "Ask for study plans, weak-topic recovery, revision strategy, and test prep help.", Brain],
    ["Exam dashboard", "Organize exam dates, countdowns, subject progress, and study analytics.", BarChart3]
  ];

  return (
    <div className="login-gate">
      <div className="login-grid">
        <motion.section
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="login-panel glass"
        >
          <div className="login-mark">
            <Sparkles size={30} strokeWidth={2.35} />
          </div>
          <div className="premium-badge mx-auto mt-4"><Crown size={13} /> Founder Pro access</div>
          <h1>ZENORA Student OS</h1>
          <p className="login-copy">
            ZENORA is a calm student productivity OS for study planning, focus sessions, tasks, habits, subject tracking, exam preparation, notes, analytics, and AI study help.
          </p>

          <div className="login-status">
            <Cloud size={17} />
            <span>{statusText[cloud.status] || cloud.status}</span>
          </div>

          <button className="google-button" onClick={cloud.login} disabled={!canUseGoogle || busy}>
            <span className="google-dot">G</span>
            {busy ? "Opening Google..." : "Continue with Google"}
          </button>

          {!canUseGoogle && (
            <div className="login-setup">
              <div className="flex items-center gap-2 font-semibold text-white"><ShieldCheck size={16} /> Setup required</div>
              <p>Add Firebase values to `.env` from `.env.example`, then restart the dev server. Local tester mode is available while you configure Firebase.</p>
              <button className="ghost-button w-full justify-center" onClick={onLocalAccess}>Continue in local tester mode</button>
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
          className="login-seo-panel glass"
        >
          <p className="premium-badge">ZENORA for students</p>
          <h2>Study planning, focus, and exam prep in one workspace.</h2>
          <p>
            Use ZENORA to organize your student life: build a study plan, track subjects and weak topics,
            manage deadlines, run focus blocks, review progress analytics, and ask the AI study assistant
            for practical next steps.
          </p>
          <div className="login-feature-grid">
            {features.map(([title, copy, Icon]) => (
              <div key={title} className="login-feature">
                <Icon size={18} />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
