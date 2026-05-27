import { Cloud, Crown, LogIn, ShieldCheck, Sparkles } from "lucide-react";
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

  return (
    <div className="login-gate">
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
    </div>
  );
}
