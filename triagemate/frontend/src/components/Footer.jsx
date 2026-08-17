import { Code2, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white/60 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted text-center md:text-left">
          Built by <span className="font-semibold text-ink">Tabisha Chouhan</span> — an AI-powered health triage assistant.
        </p>
        <div className="flex items-center gap-5">
          <a href="https://github.com/tabishachouhan/triagemate" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-muted hover:text-sage-dark transition-colors">
            <Code2 size={16} /> GitHub
          </a>
          <a href="https://triagemate-cqv6.onrender.com/api/health" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-muted hover:text-sage-dark transition-colors">
            <ExternalLink size={16} /> API Status
          </a>
        </div>
      </div>
    </footer>
  );
}