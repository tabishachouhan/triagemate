import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        navigate("/assess");
      } else {
        await signUp(email, password);
        setInfo("Account created! Check your email to confirm, then log in.");
        setMode("login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16 font-sans">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2 text-center">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-muted text-sm text-center mb-8">
          {mode === "login" ? "Log in to see your assessment history." : "Sign up to save your assessment history."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line rounded-xl px-4 py-3 text-sm bg-white focus:outline focus:outline-2 focus:outline-sage"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line rounded-xl px-4 py-3 text-sm bg-white focus:outline focus:outline-2 focus:outline-sage"
          />

          {error && <div className="text-red text-xs bg-[#f7e2de] border border-[#e2b8ae] rounded-lg px-3 py-2">{error}</div>}
          {info && <div className="text-sage-dark text-xs bg-sage-pale border border-sage rounded-lg px-3 py-2">{info}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sage-dark text-white font-semibold py-3 rounded-xl hover:bg-teal transition-colors disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setInfo(""); }}
          className="w-full text-center text-sm text-muted mt-5 hover:text-sage-dark transition-colors"
        >
          {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </motion.div>
    </div>
  );
}