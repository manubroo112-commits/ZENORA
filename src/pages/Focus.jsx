import { Maximize2, Music, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import ProgressRing from "../components/ProgressRing";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

export default function Focus({ data, setData }) {
  const [seconds, setSeconds] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("Focus");
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => {
      setSeconds((value) => {
        if (value > 1) return value - 1;
        setRunning(false);
        setData((current) => ({ ...current, focusStats: { sessions: current.focusStats.sessions + 1, minutes: current.focusStats.minutes + (mode === "Focus" ? 25 : 5) } }));
        return mode === "Focus" ? BREAK : FOCUS;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, mode, setData]);

  const total = mode === "Focus" ? FOCUS : BREAK;
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const rest = String(seconds % 60).padStart(2, "0");

  return (
    <div className={`${fullscreen ? "fixed inset-0 z-50 grid place-items-center bg-black/90 p-6 backdrop-blur-2xl" : "grid gap-5 xl:grid-cols-[1fr_.8fr]"}`}>
      <Card className="grid place-items-center p-8 text-center">
        <div className="mb-5 flex gap-2">
          {["Focus", "Break"].map((item) => (
            <button key={item} onClick={() => { setMode(item); setSeconds(item === "Focus" ? FOCUS : BREAK); }} className={`pill ${mode === item ? "bg-white text-black" : ""}`}>{item}</button>
          ))}
        </div>
        <ProgressRing value={100 - (seconds / total) * 100} size={260} label={`${minutes}:${rest}`} sublabel={mode.toLowerCase()} color={mode === "Focus" ? "#d5b47a" : "#9aa77e"} />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => setRunning(!running)} className="primary-button">{running ? <Pause size={18} /> : <Play size={18} />}{running ? "Pause" : "Start"}</button>
          <button onClick={() => { setRunning(false); setSeconds(total); }} className="ghost-button"><RotateCcw size={18} />Reset</button>
          <button className="ghost-button"><Music size={18} />Lofi</button>
          <button onClick={() => setFullscreen(!fullscreen)} className="ghost-button"><Maximize2 size={18} />Focus mode</button>
        </div>
      </Card>
      {!fullscreen && (
        <div className="grid gap-5">
          <Card>
            <p className="text-sm text-white/45">Session statistics</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/[.045] p-4"><div className="text-3xl font-semibold text-white">{data.focusStats.sessions}</div><div className="text-xs text-white/38">sessions</div></div>
              <div className="rounded-2xl bg-white/[.045] p-4"><div className="text-3xl font-semibold text-white">{data.focusStats.minutes}</div><div className="text-xs text-white/38">minutes</div></div>
            </div>
          </Card>
          <Card>
            <h3 className="section-title">AI study assistant</h3>
            <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/[.035] p-4 text-sm leading-6 text-white/50">Placeholder for future AI planning, quiz generation, summaries, and review prompts.</div>
          </Card>
        </div>
      )}
    </div>
  );
}
