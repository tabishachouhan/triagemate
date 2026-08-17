import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* animated background blobs */}
        <motion.div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 -left-24 w-80 h-80 rounded-full bg-mint/20 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center font-sans">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-sage-pale text-sage-dark text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6"
          >
            <Sparkles size={14} /> AI-Powered Health Triage
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl font-semibold text-ink leading-tight mb-6"
          >
            Know how urgent your symptoms are — before you start guessing.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted max-w-2xl mx-auto mb-9"
          >
            Describe how you're feeling in plain language. TriageMate has a short conversation with
            you, then gives you a clear read on urgency — and exactly what to do next.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/assess"
              className="inline-flex items-center gap-2 bg-sage-dark text-white font-semibold px-7 py-3.5 rounded-full hover:bg-teal transition-colors shadow-lg shadow-sage-dark/20"
            >
              Start Free Assessment <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 py-20 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-3xl font-semibold text-ink mb-3">How it works</h2>
          <p className="text-muted max-w-xl mx-auto">Three simple steps, no medical jargon required.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", title: "Describe", desc: "Tell TriageMate what you're feeling, in your own words." },
            { n: "02", title: "Converse", desc: "It may ask one quick follow-up — just like a real triage nurse would." },
            { n: "03", title: "Act", desc: "Get a clear urgency level, reasoning, and your exact next step." },
          ].map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-white border border-line rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="font-serif text-4xl font-bold text-sage-pale mb-3">{step.n}</div>
              <h3 className="font-semibold text-lg text-ink mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white border-y border-line py-20 font-sans">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl font-semibold text-ink text-center mb-14"
          >
            Built with real triage logic
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "Multi-turn conversation", desc: "Asks a clarifying question when it genuinely changes the answer — never interrogates unnecessarily." },
              { title: "Conservative by design", desc: "When symptoms are ambiguous, it defaults to caution rather than reassurance." },
              { title: "Structured, explainable output", desc: "Every answer includes plain-language reasoning — never a black-box verdict." },
              { title: "Never diagnoses", desc: "Frames everything as \"this could suggest,\" always pointing toward real care." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-4 p-5 rounded-xl hover:bg-sage-pale/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-mint mt-2 shrink-0" />
                <div>
                  <h3 className="font-semibold text-ink mb-1">{f.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-ink rounded-3xl px-10 py-16 relative overflow-hidden"
        >
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-teal/30 blur-3xl" />
          <h2 className="relative font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
            Not sure if it's urgent?
          </h2>
          <p className="relative text-white/70 mb-8 max-w-lg mx-auto">
            Get a clear, honest read in under a minute — completely free.
          </p>
          <Link
            to="/assess"
            className="relative inline-flex items-center gap-2 bg-mint text-ink font-semibold px-7 py-3.5 rounded-full hover:bg-white transition-colors"
          >
            Start Free Assessment <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}