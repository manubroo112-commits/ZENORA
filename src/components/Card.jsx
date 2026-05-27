import { motion } from "framer-motion";

export default function Card({ children, className = "", delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -3 }}
      className={`glass rounded-[1.35rem] p-5 shadow-glow ${className}`}
    >
      {children}
    </motion.section>
  );
}
