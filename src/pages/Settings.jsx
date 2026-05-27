import { Bell, Crown, Download, LogOut, MonitorSmartphone, Palette, RotateCcw, Share, User } from "lucide-react";
import AuthPanel from "../components/AuthPanel";
import Card from "../components/Card";
import { seedData } from "../data/seed";

const palettes = [
  { id: "mocha", name: "Ink Wash", note: "Black, silver, smoky gray, clean minimal", colors: ["#252525", "#545454", "#7d7d7d", "#cfcfcf", "#545454"] },
  { id: "matcha", name: "Jade Pebble Morning", note: "Muted jade, paper white, calm forest", colors: ["#404e3b", "#6c8480", "#7b9669", "#bac8b1", "#e6e6e6"] },
  { id: "sakura", name: "Blush Graphite", note: "Soft graphite, blush, muted stone blue", colors: ["#837d68", "#8a9db1", "#c1c0c2", "#f5e9e7", "#ecc5c6"] },
  { id: "ocean", name: "Ocean Lab", note: "Deep teal, cyan glow, clean blue", colors: ["#081218", "#162d36", "#5faec2", "#9ddbd8", "#aeb7f0"] },
  { id: "graphite", name: "Graphite Pro", note: "Neutral dark, platinum, minimal UI", colors: ["#0e1013", "#292c33", "#838b98", "#d7dee8", "#a7b5c8"] }
];

const premiumThemes = ["AMOLED", "Cyber Blue", "Neon Purple", "Minimal White", "Anime", "Focus Red"];
const studyModes = ["General", "School", "College", "University", "Competitive exam", "Language learning", "Certification", "Self-study", "Other"];

export default function Settings({ data, profile, preferences, setData, cloud }) {
  const patch = (changes) => setData((data) => ({ ...data, profile: { ...data.profile, ...changes } }));
  const patchPreference = (changes) => setData((data) => ({ ...data, preferences: { ...data.preferences, ...changes } }));
  const resetData = () => {
    const confirmed = window.confirm("Reset all local ZENORA data? This cannot be undone.");
    if (confirmed) setData(seedData);
  };
  const exportData = () => {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      app: "ZENORA",
      data
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `zenora-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const runCloudSync = () => {
    if (!cloud.user) {
      cloud.login();
      return;
    }
    setData((current) => ({ ...current, preferences: { ...current.preferences, lastManualSync: new Date().toISOString() } }));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <div className="xl:col-span-2">
        <AuthPanel
          user={cloud.user}
          cloudStatus={cloud.status}
          configured={cloud.configured}
          onLogin={cloud.login}
          onLogout={cloud.logout}
          profile={profile}
        />
      </div>
      <Card>
        <h2 className="section-title"><User size={18} /> Profile</h2>
        <div className="mt-4 space-y-3">
          <div className="form-field">
            <label>Your name</label>
            <input className="field" value={profile.name} onChange={(e) => patch({ name: e.target.value })} placeholder="Example: Manpreet" />
            <p className="field-help">This name appears in the dashboard greeting.</p>
          </div>
          <div className="form-field">
            <label>Main study goal</label>
            <input className="field" value={profile.goal} onChange={(e) => patch({ goal: e.target.value })} placeholder="Example: Finish revision before finals" />
            <p className="field-help">A short reminder shown at the top of your workspace.</p>
          </div>
          <div className="form-field">
            <label>Target exam goal</label>
            <input className="field" value={profile.examGoal || ""} onChange={(e) => patch({ examGoal: e.target.value })} placeholder="Example: Biology final, SAT, IELTS, midterms, coding certification" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="form-field">
              <label>Study mode</label>
              <select className="field" value={profile.examType || "General"} onChange={(e) => patch({ examType: e.target.value })}>
                {studyModes.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Available study hours</label>
              <input className="field" type="number" min="0" value={profile.availableStudyHours || 0} onChange={(e) => patch({ availableStudyHours: Number(e.target.value) || 0 })} placeholder="Example: 6" />
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <h2 className="section-title"><Palette size={18} /> Theme</h2>
        <p className="mt-2 text-sm leading-6 text-white/48">Choose a full app palette. The preview shows background, card, and accent behavior before you switch.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {palettes.map((palette) => (
            <button
              key={palette.id}
              onClick={() => patch({ theme: palette.id, accent: palette.colors[2] })}
              className={`palette-card ${profile.theme === palette.id ? "is-active" : ""}`}
            >
              <div className="palette-preview" style={{ background: `radial-gradient(circle at 18% 10%, ${palette.colors[3]}55, transparent 36%), linear-gradient(135deg, ${palette.colors[0]}, ${palette.colors[1]})` }}>
                <div className="palette-window">
                  <span style={{ background: palette.colors[2] }} />
                  <span style={{ background: palette.colors[3] }} />
                  <span style={{ background: palette.colors[4] }} />
                </div>
                <div className="palette-mini-card">
                  <span />
                  <b style={{ background: `linear-gradient(135deg, ${palette.colors[2]}, ${palette.colors[3]}, ${palette.colors[4]})` }} />
                </div>
                <div className="palette-bars">{palette.colors.slice(2).map((color) => <span key={color} style={{ background: color }} />)}</div>
              </div>
              <div>
                <div className="font-semibold text-white">{palette.name}</div>
                <div className="mt-1 text-xs text-white/42">{palette.note}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/[.045] p-4">
          <div><div className="font-medium text-white">Light mode</div><div className="text-xs text-white/40">Keep dark as the default calm surface</div></div>
          <button onClick={() => patch({ dark: !profile.dark })} className={`toggle ${!profile.dark ? "is-on" : ""}`}><span /></button>
        </div>
        <div className="mt-5 rounded-2xl border border-dashed border-white/14 bg-white/[.04] p-4">
          <div className="flex items-center gap-2 font-semibold text-white"><Crown size={17} /> Premium themes</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {premiumThemes.map((theme) => <span key={theme} className="premium-badge">{theme}</span>)}
          </div>
          <p className="mt-3 text-xs leading-5 text-white/45">Visible now as placeholders. Checkout can unlock these later.</p>
        </div>
      </Card>
      <Card className="xl:col-span-2">
        <h2 className="section-title"><Crown size={18} /> Upgrade and testing</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[.045] p-4">
            <div><div className="font-medium text-white">Pro status testing</div><div className="text-xs text-white/40">Temporary toggle until payment is connected.</div></div>
            <button onClick={() => patch({ proOverride: !profile.proOverride, plan: profile.proOverride ? "free" : "pro" })} className={`toggle ${profile.plan === "pro" || profile.proOverride ? "is-on" : ""}`}><span /></button>
          </div>
          <div className="rounded-2xl bg-white/[.045] p-4">
            <div className="font-medium text-white">{profile.plan === "pro" || profile.proOverride ? "Pro active" : "Free plan"}</div>
            <div className="mt-1 text-xs text-white/40">Free includes 30 AI messages. Pro unlocks unlimited AI and advanced tools.</div>
          </div>
        </div>
      </Card>
      <Card className="xl:col-span-2">
        <h2 className="section-title"><Bell size={18} /> Notifications</h2>
        <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-white/[.045] p-4">
          <div><div className="font-medium text-white">Study reminders</div><div className="text-xs text-white/40">Saved preference for reminder-style alerts</div></div>
          <button onClick={() => patch({ notifications: !profile.notifications })} className={`toggle ${profile.notifications ? "is-on" : ""}`}><span /></button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4 rounded-2xl bg-white/[.045] p-4">
          <div><div className="font-medium text-white">Weekly digest</div><div className="text-xs text-white/40">Saved preference for weekly progress summaries</div></div>
          <button onClick={() => patchPreference({ weeklyDigest: !preferences.weeklyDigest })} className={`toggle ${preferences.weeklyDigest ? "is-on" : ""}`}><span /></button>
        </div>
      </Card>
      <Card className="xl:col-span-2">
        <h2 className="section-title"><MonitorSmartphone size={18} /> Install ZENORA</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="install-step">
            <Download size={18} />
            <div>
              <div className="font-medium text-white">Desktop</div>
              <p>Use the browser install button in the address bar or the ZENORA install prompt.</p>
            </div>
          </div>
          <div className="install-step">
            <Download size={18} />
            <div>
              <div className="font-medium text-white">Android</div>
              <p>Open in Chrome, then tap Install app or Add to Home screen.</p>
            </div>
          </div>
          <div className="install-step">
            <Share size={18} />
            <div>
              <div className="font-medium text-white">iPhone</div>
              <p>Tap Share in Safari, then choose Add to Home Screen.</p>
            </div>
          </div>
        </div>
      </Card>
      <Card className="xl:col-span-2">
        <h2 className="section-title"><Download size={18} /> Data and account</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <button onClick={exportData} className="ghost-button justify-center">Export data <span className="premium-badge">JSON</span></button>
          <button onClick={runCloudSync} className="ghost-button justify-center">
            {cloud.user ? "Save sync point" : "Sign in for cloud"} <span className="premium-badge">{cloud.status}</span>
          </button>
          <button onClick={cloud.logout} className="ghost-button justify-center" disabled={!cloud.user}><LogOut size={17} /> {cloud.user ? "Logout" : "Logged out"}</button>
          <button onClick={resetData} className="ghost-button justify-center"><RotateCcw size={17} /> Reset data</button>
        </div>
      </Card>
    </div>
  );
}
