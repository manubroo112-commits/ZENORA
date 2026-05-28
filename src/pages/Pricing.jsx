import { Check, Crown, Lock, Sparkles } from "lucide-react";
import Card from "../components/Card";
import { hasProAccess } from "../utils/proAccess";

const free = ["Dashboard", "To-do list", "Mini calendar", "Pomodoro timer", "Notes", "Basic analytics", "Limited subjects", "Countdowns", "Today's Mission", "30 AI assistant messages"];
const pro = ["Student tools: CGPA, attendance, grades, timetable, water, goals", "Unlimited AI messages", "AI study planner", "AI revision planner", "AI weak-topic suggestions", "Advanced analytics", "Weekly/monthly graphs", "Productivity heatmap", "Unlimited habits, subjects, notes, countdowns", "Premium themes", "Focus Mode Pro", "Custom dashboard widgets"];

export default function Pricing({ setActive, profile, user }) {
  const isPro = profile?.plan === "pro" || hasProAccess(user?.email);

  return (
    <div className="grid gap-5">
      <Card className="overflow-hidden p-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/[.07] px-3 py-1 text-xs text-cyan-100">
              <Sparkles size={14} /> {isPro ? "Pro active" : "Premium workspace"}
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">Free stays useful. Pro becomes your serious study advantage.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/52">
              {isPro ? "Your founder tester email has Pro access enabled. Payment is still not connected." : "Payment is not connected yet. This page is ready for future checkout integration and lets students understand the value without pressure."}
            </p>
          </div>
          <button onClick={() => setActive("Dashboard")} className="ghost-button">Back to dashboard</button>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h3 className="text-2xl font-semibold text-white">Free</h3>
          <p className="mt-2 text-sm text-white/45">Everything a student needs to begin.</p>
          <div className="mt-5 text-4xl font-semibold text-white">Rs. 0</div>
          <div className="mt-5 space-y-3">
            {free.map((item) => <div key={item} className="flex items-center gap-2 text-sm text-white/65"><Check size={16} /> {item}</div>)}
          </div>
        </Card>

        <Card className="theme-accent-border">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white">Pro</h3>
            <span className="premium-badge"><Crown size={13} /> {isPro ? "Unlocked" : "Best value"}</span>
          </div>
          <p className="mt-2 text-sm text-white/45">For students who want a full academic command center.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="price-chip">Rs. 39<span>/month</span></div>
            <div className="price-chip">Rs. 199<span>/6 months</span></div>
            <div className="price-chip">Rs. 499<span>lifetime</span></div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {pro.map((item) => <div key={item} className="flex items-center gap-2 text-sm text-white/65"><Lock size={15} className="text-cyan-100" /> {item}</div>)}
          </div>
          <button className="primary-button mt-6 w-full justify-center">{isPro ? "Pro access active" : "Upgrade UI placeholder"}</button>
        </Card>
      </div>
    </div>
  );
}
