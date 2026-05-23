import { Bell, Palette, User } from "lucide-react";
import Card from "../components/Card";

const accents = ["#9b6f43", "#d5b47a", "#9aa77e", "#b8795b", "#c6a1a0"];

export default function Settings({ profile, setData }) {
  const patch = (changes) => setData((data) => ({ ...data, profile: { ...data.profile, ...changes } }));

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card>
        <h2 className="section-title"><User size={18} /> Profile</h2>
        <div className="mt-4 space-y-3">
          <input className="field" value={profile.name} onChange={(e) => patch({ name: e.target.value })} />
          <input className="field" value={profile.goal} onChange={(e) => patch({ goal: e.target.value })} />
        </div>
      </Card>
      <Card>
        <h2 className="section-title"><Palette size={18} /> Theme</h2>
        <div className="mt-5 flex gap-3">
          {accents.map((color) => (
            <button key={color} onClick={() => patch({ accent: color })} className={`h-11 w-11 rounded-2xl border ${profile.accent === color ? "border-white" : "border-white/10"}`} style={{ background: color }} title={color} />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/[.045] p-4">
          <div><div className="font-medium text-white">Light mode</div><div className="text-xs text-white/40">Keep dark as the default calm surface</div></div>
          <button onClick={() => patch({ dark: !profile.dark })} className={`toggle ${!profile.dark ? "justify-end bg-[#d5b47a]" : ""}`}><span /></button>
        </div>
      </Card>
      <Card className="xl:col-span-2">
        <h2 className="section-title"><Bell size={18} /> Notifications</h2>
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/[.045] p-4">
          <div><div className="font-medium text-white">Study reminders</div><div className="text-xs text-white/40">Visual toggle only, ready for future notification wiring</div></div>
          <button onClick={() => patch({ notifications: !profile.notifications })} className={`toggle ${profile.notifications ? "justify-end bg-[#d5b47a]" : ""}`}><span /></button>
        </div>
      </Card>
    </div>
  );
}
