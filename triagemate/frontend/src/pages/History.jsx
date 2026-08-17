import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { format } from "date-fns";
import { Inbox } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const URGENCY_META = {
  self_care: { label: "Self-care", color: "#4c9a52", badge: "bg-[#e4efe4] text-[#2f5c33]" },
  see_doctor: { label: "See a doctor", color: "#c98a2c", badge: "bg-[#fbeed9] text-[#7a541a]" },
  emergency: { label: "Emergency", color: "#b0402f", badge: "bg-[#f7e2de] text-[#7a2c1e]" },
};

export default function History() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error) setItems(data || []);
      setLoading(false);
    })();
  }, [user]);

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center font-sans">
        <Inbox className="mx-auto text-muted mb-4" size={36} />
        <h1 className="font-serif text-2xl font-semibold text-ink mb-2">Log in to see your history</h1>
        <p className="text-muted text-sm mb-6">Your past assessments are saved securely to your account.</p>
        <Link to="/auth" className="inline-block bg-sage-dark text-white font-semibold px-6 py-2.5 rounded-full hover:bg-teal transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  const counts = { self_care: 0, see_doctor: 0, emergency: 0 };
  items.forEach((i) => { if (counts[i.urgency] !== undefined) counts[i.urgency]++; });
  const chartData = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ name: URGENCY_META[key].label, value, color: URGENCY_META[key].color }));

  return (
    <div className="max-w-4xl mx-auto px-5 py-12 font-sans">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Your History</h1>
        <p className="text-muted text-sm">A record of your past symptom checks.</p>
      </motion.div>

      {loading ? (
        <p className="text-muted text-sm">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-line rounded-2xl">
          <Inbox className="mx-auto text-muted mb-3" size={32} />
          <p className="text-muted text-sm mb-5">No assessments yet.</p>
          <Link to="/assess" className="inline-block bg-sage-dark text-white font-semibold px-6 py-2.5 rounded-full hover:bg-teal transition-colors text-sm">
            Start your first check
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-line rounded-2xl p-5 h-fit"
          >
            <h2 className="font-semibold text-sm text-ink mb-3">Urgency breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconSize={9} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-xs text-muted mt-1">{items.length} total check{items.length !== 1 ? "s" : ""}</p>
          </motion.div>

          <div className="space-y-3">
            {items.map((item, i) => {
              const meta = URGENCY_META[item.urgency] || URGENCY_META.self_care;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white border border-line rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10.5px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${meta.badge}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-muted">
                      {format(new Date(item.created_at), "MMM d, yyyy · h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm text-ink mb-1.5 italic">"{item.user_message}"</p>
                  <p className="text-xs text-muted">{item.reasoning}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}