import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ShieldAlert } from "lucide-react";
import ChatBubble from "../components/ChatBubble";
import TypingIndicator from "../components/TypingIndicator";
import ResultCard from "../components/ResultCard";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function sessionId() {
  let id = localStorage.getItem("tm_session");
  if (!id) {
    id = "sess_" + Math.random().toString(36).slice(2);
    localStorage.setItem("tm_session", id);
  }
  return id;
}

const INITIAL_BOT_MESSAGE = {
  who: "bot",
  text: "Hi, I'm TriageMate. Describe what you're feeling — be as specific as you can about duration and severity.",
};

export default function Assess() {
  const [messages, setMessages] = useState([INITIAL_BOT_MESSAGE]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, result]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + "px";
    }
  }, [input]);

  async function send() {
    const text = input.trim();
    if (!text || loading || result) return;

    setError("");
    setMessages((m) => [...m, { who: "user", text }]);
    const newHistory = [...history, { role: "user", content: text }];
    setHistory(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/converse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, sessionId: sessionId() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong.");
      }

      const data = await res.json();

      if (data.type === "question") {
        setMessages((m) => [...m, { who: "bot", text: data.question }]);
        setHistory((h) => [...h, { role: "assistant", content: JSON.stringify(data) }]);
      } else if (data.type === "assessment") {
        setResult(data);
        setHistory((h) => [...h, { role: "assistant", content: JSON.stringify(data) }]);
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (e) {
      setError(e.message || "Could not reach TriageMate. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setMessages([INITIAL_BOT_MESSAGE]);
    setHistory([]);
    setResult(null);
    setError("");
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Symptom Check</h1>
        <p className="text-muted text-sm leading-relaxed max-w-xl">
          Tell me what's going on. I might ask one quick follow-up before giving you a clear read on how urgent it is.
        </p>
        <div className="flex items-start gap-2 text-xs text-muted bg-[#eeece2] border border-line rounded-lg px-3.5 py-2.5 mt-4">
          <ShieldAlert size={15} className="shrink-0 mt-0.5" />
          <span>
            TriageMate does not diagnose conditions and is not a substitute for professional medical advice.
            In a medical emergency, contact local emergency services immediately.
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-line rounded-2xl flex flex-col h-[520px] overflow-hidden shadow-sm"
      >
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pt-5 pb-2 flex flex-col gap-3">
          {messages.map((m, i) => (
            <ChatBubble key={i} text={m.text} who={m.who} />
          ))}
          <AnimatePresence>{loading && <TypingIndicator />}</AnimatePresence>
          <AnimatePresence>{result && <ResultCard data={result} onRestart={restart} />}</AnimatePresence>
        </div>

        {error && (
          <div className="text-red bg-[#f7e2de] border border-[#e2b8ae] rounded-lg px-3.5 py-2.5 text-[13px] mx-4 mb-3">
            {error}
          </div>
        )}

        <div className="flex gap-2.5 px-4 py-3.5 border-t border-line">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            disabled={!!result}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. I've had a dull headache since this morning..."
            className="flex-1 resize-none border border-line rounded-xl px-3.5 py-2.5 text-[14.5px] text-ink bg-paper max-h-[100px] focus:outline focus:outline-2 focus:outline-sage disabled:opacity-60"
          />
          <button
            onClick={send}
            disabled={loading || !!result}
            className="flex items-center justify-center bg-sage-dark text-white rounded-xl w-11 hover:bg-teal transition-colors disabled:bg-[#a9b0a9] disabled:cursor-not-allowed"
          >
            <Send size={17} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}