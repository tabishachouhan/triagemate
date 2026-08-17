import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

const URGENCY_STYLES = {
  self_care: { label: "Self-care", badge: "bg-[#e4efe4] text-[#2f5c33]", dot: "bg-[#4c9a52]" },
  see_doctor: { label: "See a doctor soon", badge: "bg-[#fbeed9] text-[#7a541a]", dot: "bg-amber" },
  emergency: { label: "Seek emergency care now", badge: "bg-[#f7e2de] text-[#7a2c1e]", dot: "bg-red" },
};

function Row({ label, value }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="text-[10.5px] font-bold tracking-wide uppercase text-muted mb-1">{label}</div>
      <div className="text-[15px] leading-relaxed">{value}</div>
    </div>
  );
}

export default function ResultCard({ data, onRestart }) {
  const style = URGENCY_STYLES[data.urgency] || URGENCY_STYLES.self_care;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="self-stretch rounded-2xl border border-line bg-white px-5 py-5 font-sans shadow-lg"
    >
      <div className={`inline-flex items-center gap-2 text-[11.5px] font-bold tracking-wide uppercase px-2.5 py-1.5 rounded-full mb-3 ${style.badge}`}>
        <span className={`w-2 h-2 rounded-full inline-block ${style.dot}`} />
        {style.label}
      </div>
      <Row label="Why" value={data.reasoning} />
      <Row label="What to do next" value={data.recommended_action} />
      <Row label="Where to go" value={data.care_type} />
      <button
        onClick={onRestart}
        className="mt-4 flex items-center gap-1.5 text-[12.5px] font-semibold text-sage-dark border border-sage-dark rounded-full px-3.5 py-1.5 hover:bg-sage-pale transition-colors"
      >
        <RotateCcw size={13} /> Start a new check
      </button>
    </motion.div>
  );
}