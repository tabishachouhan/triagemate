import { Link, NavLink } from "react-router-dom";
import { Stethoscope } from "lucide-react";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-sage-dark" : "text-muted hover:text-sage-dark"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between font-sans">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-sage-dark flex items-center justify-center group-hover:bg-teal transition-colors">
            <Stethoscope size={18} className="text-white" />
          </div>
          <span className="font-serif text-xl font-semibold text-ink">TriageMate</span>
        </Link>

        <nav className="flex items-center gap-7">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <Link
            to="/assess"
            className="text-sm font-semibold bg-sage-dark text-white px-4 py-2 rounded-full hover:bg-teal transition-colors"
          >
            Start Assessment
          </Link>
        </nav>
      </div>
    </header>
  );
}