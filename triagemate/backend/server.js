import "dotenv/config";
import express from "express";
import cors from "cors";
import { converseSymptoms } from "./llm.js";
import { saveAssessment } from "./supabaseClient.js";

const app = express();
app.use(cors());
app.use(express.json());

// Health check — useful for confirming deployment worked
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "TriageMate API" });
});

// Multi-turn endpoint: takes the full conversation so far, returns either
// a clarifying question or a final structured urgency assessment.
// Body: { messages: [{role: 'user'|'assistant', content: string}, ...], sessionId }
app.post("/api/converse", async (req, res) => {
  const { messages, sessionId } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Please provide a non-empty 'messages' array." });
  }

  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMsg || !lastUserMsg.content?.trim()) {
    return res.status(400).json({ error: "The last message must be a non-empty user message." });
  }

  try {
    const result = await converseSymptoms(messages);

    if (result.type === "assessment") {
      await saveAssessment(sessionId || "anonymous", lastUserMsg.content, result);
    }

    res.json(result);
  } catch (err) {
    console.error("Conversation error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TriageMate backend running on port ${PORT}`);
});
