export default function GlowBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-obsidian">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,215,192,.26),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(154,167,126,.18),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(184,121,91,.14),transparent_34%),linear-gradient(180deg,#211713,#120d0a_52%,#2a1c14)]" />
      <div className="absolute left-[8%] top-[12%] h-72 w-72 animate-float rounded-full bg-[#d5b47a]/20 blur-3xl" />
      <div className="absolute right-[10%] top-[18%] h-96 w-96 animate-pulseglow rounded-full bg-[#9aa77e]/18 blur-3xl" />
      <div className="absolute bottom-[8%] left-[30%] h-64 w-64 animate-float rounded-full bg-[#b8795b]/16 blur-3xl [animation-delay:2s]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(244,234,220,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(244,234,220,.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
    </div>
  );
}
