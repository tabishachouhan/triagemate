// Using Groq's free API (OpenAI-compatible format) — no cost, no card required.
// To switch to Claude later, see the commented alternative at the bottom of this file.
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * The system prompt is the heart of TriageMate's prompt engineering.
 * It forces the model to:
 *  - Stay in a triage/awareness role, never diagnose
 *  - Always return strict, parseable JSON
 *  - Always include a safety disclaimer for anything above "self-care"
 */
const SYSTEM_PROMPT = `You are TriageMate, an AI health triage assistant. Your ONLY job is to help a
user understand how urgent their described symptoms might be, and what kind
of care to seek next. You are NOT a doctor and you must never diagnose a
specific condition or prescribe treatment.

Rules:
1. Classify urgency into exactly one of: "self_care", "see_doctor", "emergency".
2. Be conservative: if symptoms could plausibly be serious (chest pain,
   difficulty breathing, severe bleeding, stroke signs, suicidal ideation,
   loss of consciousness, severe allergic reaction, etc.), classify as
   "emergency" even if uncertain.
3. Always explain your reasoning in plain, non-alarming language.
4. Always recommend a concrete next step (e.g. "visit a general physician
   within 24-48 hours", "call emergency services now", "rest and monitor,
   see a doctor if it worsens").
5. Never claim to know a diagnosis. Frame everything as "this could suggest"
   not "you have".
6. If the message mentions self-harm or suicidal thoughts, ALWAYS classify
   as "emergency" and include a crisis helpline recommendation.

Respond ONLY with valid JSON in this exact shape, nothing else:
{
  "urgency": "self_care" | "see_doctor" | "emergency",
  "reasoning": "plain language explanation, 2-3 sentences",
  "recommended_action": "concrete next step",
  "care_type": "e.g. General Physician / Emergency Room / Telehealth / Self-care at home"
}`;

/**
 * Calls the LLM to classify symptom urgency.
 * @param {string} userMessage - the user's plain-language symptom description
 * @returns {Promise<object>} parsed structured assessment
 */
export async function assessSymptoms(userMessage) {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
Authorization: `Bearer ${process.env.GROQ_API_KEY}`,    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", // free on Groq, fast and solid for structured JSON tasks
      max_tokens: 500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";

  try {
    // Strip accidental markdown fences if the model adds them
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Failed to parse LLM response as JSON: " + text);
  }
}

/* ─────────────────────────────────────────────────────────────
   Switching to Claude later (once you have API credits):

   import Anthropic from "@anthropic-ai/sdk";
   const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

   export async function assessSymptoms(userMessage) {
     const response = await anthropic.messages.create({
       model: "claude-haiku-4-5-20251001",
       max_tokens: 500,
       system: SYSTEM_PROMPT,
       messages: [{ role: "user", content: userMessage }],
     });
     const text = response.content.filter(b => b.type === "text").map(b => b.text).join("");
     return JSON.parse(text.replace(/```json|```/g, "").trim());
   }

   Just replace the function above with this version and swap the env var.
   ───────────────────────────────────────────────────────────── */
