import { Cloud, Crown, LogIn, LogOut, ShieldCheck } from "lucide-react";
import Card from "./Card";
import { hasProAccess } from "../utils/proAccess";

const labels = {
  "not-configured": "Firebase not configured",
  "signed-out": "Local mode",
  offline: "Local mode",
  loading: "Connecting",
  saving: "Saving",
  synced: "Cloud synced"
};

export default function AuthPanel({ user, cloudStatus, configured, onLogin, onLogout, profile }) {
  const isPro = profile.plan === "pro" || hasProAccess(user?.email);

  return (
    <Card>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="section-title"><Cloud size={18} /> Google login and cloud sync</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            Sign in with Google to save ZENORA data to Firestore. Until Firebase keys are added, the app keeps using localStorage safely.
          </p>
        </div>
        <span className={`sync-badge ${cloudStatus === "synced" ? "is-synced" : ""}`}>{labels[cloudStatus] || cloudStatus}</span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white/[.045] p-4">
          <div className="flex items-center gap-2 font-semibold text-white"><ShieldCheck size={17} /> Account</div>
          <p className="mt-2 text-sm text-white/45">{user ? user.email : configured ? "Not signed in" : "Add Firebase env keys"}</p>
        </div>
        <div className="rounded-2xl bg-white/[.045] p-4">
          <div className="flex items-center gap-2 font-semibold text-white"><Crown size={17} /> Plan</div>
          <p className="mt-2 text-sm text-white/45">{isPro ? "Pro tester unlocked" : "Free plan"}</p>
        </div>
        <div className="rounded-2xl bg-white/[.045] p-4">
          <div className="font-semibold text-white">Storage</div>
          <p className="mt-2 text-sm text-white/45">{user ? "Local + cloud backup" : "Local browser storage"}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {user ? (
          <button className="ghost-button" onClick={onLogout}><LogOut size={17} /> Sign out</button>
        ) : (
          <button className="primary-button" onClick={onLogin} disabled={!configured}><LogIn size={17} /> Continue with Google</button>
        )}
        {!configured && <span className="rounded-2xl border border-dashed border-white/15 px-4 py-3 text-sm text-white/45">Create `.env` from `.env.example` to enable Google login.</span>}
      </div>
    </Card>
  );
}