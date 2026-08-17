import { Link, NavLink, useNavigate } from "react-router-dom";
import { Stethoscope, LogOut, History } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-sage-dark" : "text-muted hover:text-sage-dark"
    }`;

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between font-sans">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-sage-dark flex items-center justify-center group-hover:bg-teal transition-colors">
            <Stethoscope size={18} className="text-white" />
          </div>
          <span className="font-serif text-xl font-semibold text-ink">TriageMate</span>
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>

          {user && (
            <NavLink to="/history" className={linkClass}>
              <span className="flex items-center gap-1.5"><History size={15} /> History</span>
            </NavLink>
          )}

          <Link
            to="/assess"
            className="text-sm font-semibold bg-sage-dark text-white px-4 py-2 rounded-full hover:bg-teal transition-colors"
          >
            Start Assessment
          </Link>

          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-red transition-colors"
              title={user.email}
            >
              <LogOut size={16} />
            </button>
          ) : (
            <Link to="/auth" className="text-sm font-medium text-muted hover:text-sage-dark transition-colors">
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}