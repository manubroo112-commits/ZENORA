import { Brain, Crown } from "lucide-react";
import AssistantChat from "../components/AssistantChat";
import Card from "../components/Card";
import ProLock from "../components/ProLock";

export default function Assistant({ data, setData, setActive }) {
  const isPro = data.profile.plan === "pro" || data.profile.proOverride;
  const weakTopics = data.subjects.flatMap((subject) => subject.weakTopics || []);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_.7fr]">
      <Card className="assistant-shell">
        <AssistantChat data={data} setData={setData} setActive={setActive} />
      </Card>

      <div className="grid gap-5">
        <Card>
          <h3 className="section-title"><Brain size={18} /> Study context</h3>
          <div className="mt-4 space-y-3 text-sm text-white/55">
            <div className="context-row"><span>Study mode</span><b>{data.profile.examType || "General"}</b></div>
            <div className="context-row"><span>Daily hours</span><b>{data.profile.availableStudyHours || 0}h</b></div>
            <div className="context-row"><span>Subjects</span><b>{data.subjects.length}</b></div>
            <div className="context-row"><span>Weak topics</span><b>{weakTopics.length}</b></div>
          </div>
          <button onClick={() => setData((current) => ({ ...current, ai: { ...current.ai, history: [] } }))} className="ghost-button mt-4 w-full justify-center">Clear chat</button>
        </Card>

        {isPro ? (
          <Card>
            <h3 className="section-title"><Crown size={18} /> Pro AI tools</h3>
            <div className="mt-4 grid gap-2">
              {["Study Planner", "Revision Planner", "Weak-topic suggestions", "Test planning"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/[.045] p-3 text-sm text-white/62">{item}</div>
              ))}
            </div>
          </Card>
        ) : (
          <ProLock title="Pro AI planning" onUpgrade={() => setActive("Premium")} compact>
            <Card>
              <h3 className="section-title"><Crown size={18} /> Pro AI tools</h3>
              <div className="mt-4 grid gap-2">
                {["Study Planner", "Revision Planner", "Weak-topic suggestions", "Test planning"].map((item) => (
                  <div key={item} className="rounded-2xl bg-white/[.045] p-3 text-sm text-white/62">{item}</div>
                ))}
              </div>
            </Card>
          </ProLock>
        )}
      </div>
    </div>
  );
}
