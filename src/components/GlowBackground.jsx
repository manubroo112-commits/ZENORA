export default function GlowBackground() {
  return (
    <div className="zenora-ambient pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ambient-gradient" />
      <div className="ambient-blob ambient-blob-one animate-float" />
      <div className="ambient-blob ambient-blob-two animate-pulseglow" />
      <div className="ambient-blob ambient-blob-three animate-float [animation-delay:2s]" />
      <div className="ambient-grid" />
    </div>
  );
}
