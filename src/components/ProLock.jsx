import { Crown, Lock } from "lucide-react";

export default function ProLock({ title, children, onUpgrade, compact = false }) {
  return (
    <div className={`pro-lock ${compact ? "is-compact" : ""}`}>
      <div className="pro-lock-content" aria-hidden="true">{children}</div>
      <div className="pro-lock-panel">
        <div className="pro-lock-icon"><Lock size={17} /></div>
        <div>
          <div className="font-semibold text-white">{title || "Pro feature"}</div>
          <p className="mt-1 text-xs leading-5 text-white/50">Visible preview. Upgrade when you want the full serious-exam toolkit.</p>
        </div>
        {onUpgrade && (
          <button onClick={onUpgrade} className="primary-button w-full justify-center">
            <Crown size={16} /> Upgrade to Pro
          </button>
        )}
      </div>
    </div>
  );
}
