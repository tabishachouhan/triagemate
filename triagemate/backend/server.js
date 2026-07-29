import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { assessSymptoms } from "./llm.js";
import { saveAssessment } from "./supabaseClient.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check — useful for confirming deployment worked
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "TriageMate API" });
});

// Main endpoint: takes user's symptom description, returns structured urgency assessment
app.post("/api/assess", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Please describe your symptoms in the 'message' field." });
  }

  try {
    const result = await assessSymptoms(message);
    await saveAssessment(sessionId || "anonymous", message, result);
    res.json(result);
  } catch (err) {
    console.error("Assessment error:", err.message);
    res.status(500).json({ error: "Something went wrong while assessing your symptoms. Please try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TriageMate backend running on port ${PORT}`);
});
