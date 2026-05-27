import { CheckCircle2, Maximize2, Music, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AssistantChat from "../components/AssistantChat";
import Card from "../components/Card";
import ProgressRing from "../components/ProgressRing";

const presets = {
  "25/5": { focus: 25 * 60, break: 5 * 60 },
  "50/10": { focus: 50 * 60, break: 10 * 60 },
  Custom: { focus: 35 * 60, break: 8 * 60 }
};

export default function Focus({ data, setData, setActive }) {
  const [preset, setPreset] = useState("25/5");
  const [seconds, setSeconds] = useState(presets[preset].focus);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("Focus");
  const [fullscreen, setFullscreen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [music, setMusic] = useState(false);
  const [custom, setCustom] = useState({ focus: 35, break: 8 });

  const activePreset = preset === "Custom" ? { focus: custom.focus * 60, break: custom.break * 60 } : presets[preset];
  const total = mode === "Focus" ? activePreset.focus : activePreset.break;
  const focusScore = useMemo(() => Math.min(100, Math.round((data.focusStats.minutes / 300) * 100)), [data.focusStats.minutes]);

  useEffect(() => {
    setSeconds(mode === "Focus" ? activePreset.focus : activePreset.break);
    setRunning(false);
  }, [preset, mode, activePreset.focus, activePreset.break]);

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => {
      setSeconds((value) => {
        if (value > 1) return value - 1;
        const minutes = Math.round(total / 60);
        setRunning(false);
        setCompleted(true);
        setData((current) => ({
          ...current,
          focusStats: { sessions: current.focusStats.sessions + 1, minutes: current.focusStats.minutes + minutes },
          focusSessions: [{ id: crypto.randomUUID(), mode: preset, minutes, date: new Date().toISOString().slice(0, 10) }, ...current.focusSessions].slice(0, 20)
        }));
        return total;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, total, preset, setData]);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const rest = String(seconds % 60).padStart(2, "0");

  return (
    <div className={fullscreen ? "focus-fullscreen" : "focus-page grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,.72fr)]"}>
      <Card className={`focus-timer-card grid place-items-center p-8 text-center ${fullscreen ? "is-fullscreen" : ""}`}>
        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {Object.keys(presets).map((item) => (
            <button key={item} onClick={() => setPreset(item)} className={`pill ${preset === item ? "bg-white text-black" : ""}`}>{item}</button>
          ))}
          {["Focus", "Break"].map((item) => (
            <button key={item} onClick={() => setMode(item)} className={`pill ${mode === item ? "bg-white text-black" : ""}`}>{item}</button>
          ))}
        </div>
        {preset === "Custom" && (
          <div className="mb-5 grid w-full max-w-sm grid-cols-2 gap-3">
            <div className="form-field text-left">
              <label>Focus minutes</label>
              <input className="field text-center" type="number" min="1" value={custom.focus} onChange={(event) => setCustom({ ...custom, focus: Number(event.target.value) || 1 })} placeholder="35" />
            </div>
            <div className="form-field text-left">
              <label>Break minutes</label>
              <input className="field text-center" type="number" min="1" value={custom.break} onChange={(event) => setCustom({ ...custom, break: Number(event.target.value) || 1 })} placeholder="8" />
            </div>
          </div>
        )}
        <ProgressRing value={100 - (seconds / total) * 100} size={fullscreen ? 320 : 240} label={`${minutes}:${rest}`} sublabel={`${preset} ${mode.toLowerCase()}`} color={mode === "Focus" ? "var(--button-b)" : "var(--button-c)"} />
        {completed && <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/[.08] px-4 py-2 text-sm text-white/70"><CheckCircle2 size={17} /> Session saved</div>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => { setCompleted(false); setRunning(!running); }} className="primary-button">{running ? <Pause size={18} /> : <Play size={18} />}{running ? "Pause" : "Start"}</button>
          <button onClick={() => { setRunning(false); setCompleted(false); setSeconds(total); }} className="ghost-button"><RotateCcw size={18} />Reset</button>
          <button onClick={() => setMusic(!music)} className={`ghost-button ${music ? "bg-white text-black" : ""}`}><Music size={18} />{music ? "Lofi on" : "Lofi"}</button>
          <button onClick={() => setFullscreen(!fullscreen)} className="ghost-button"><Maximize2 size={18} />Focus mode</button>
        </div>
      </Card>
      {!fullscreen && (
        <div className="focus-side-panel grid gap-5">
          <Card>
            <p className="text-sm text-white/45">Focus score</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/[.045] p-4"><div className="text-3xl font-semibold text-white">{focusScore}</div><div className="text-xs text-white/38">score</div></div>
              <div className="rounded-2xl bg-white/[.045] p-4"><div className="text-3xl font-semibold text-white">{data.focusStats.sessions}</div><div className="text-xs text-white/38">sessions</div></div>
              <div className="rounded-2xl bg-white/[.045] p-4"><div className="text-3xl font-semibold text-white">{data.focusStats.minutes}</div><div className="text-xs text-white/38">minutes</div></div>
            </div>
          </Card>
          <Card>
            <h3 className="section-title">Session history</h3>
            <div className="mt-4 space-y-2">
              {data.focusSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between rounded-2xl bg-white/[.045] p-3 text-sm">
                  <span className="text-white">{session.mode}</span>
                  <span className="text-white/45">{session.minutes}m - {session.date}</span>
                </div>
              ))}
            </div>
          </Card>
          {music && (
            <Card>
              <h3 className="section-title">Lofi focus pad</h3>
              <div className="mt-4 rounded-2xl bg-white/[.045] p-4 text-sm leading-6 text-white/55">
                Ambient mode is on. Keep another music app playing and use this as a calm focus surface.
              </div>
            </Card>
          )}
          <Card className="focus-chat-card">
            <AssistantChat data={data} setData={setData} setActive={setActive} compact />
          </Card>
        </div>
      )}
    </div>
  );
}
