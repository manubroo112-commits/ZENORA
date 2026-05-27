import { motion } from "framer-motion";

export default function ProgressRing({ value = 0, size = 116, label, sublabel, color = "#d5b47a" }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference - (value / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={radius} stroke="rgba(255,255,255,.1)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dash }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 14px ${color})` }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-semibold text-white">{label ?? `${Math.round(value)}%`}</div>
        {sublabel && <div className="text-[11px] text-white/45">{sublabel}</div>}
      </div>
    </div>
  );
}
