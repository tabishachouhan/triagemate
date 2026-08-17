import { motion } from "framer-motion";

export default function ChatBubble({ text, who }) {
  const isUser = who === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`max-w-[82%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed font-sans ${
        isUser
          ? "self-end bg-sage-dark text-white rounded-br-md"
          : "self-start bg-sage-pale text-ink rounded-bl-md"
      }`}
    >
      {text}
    </motion.div>
  );
}