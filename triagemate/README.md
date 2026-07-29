# TriageMate 🩺

**AI-powered symptom & urgency assessor** — built for the Compass Crew AI Innovation Challenge 2026 (Track 2: Healthcare & Social Impact).

Describe your symptoms in plain language. TriageMate gives you a clear, structured read on how urgent your situation is — self-care, see a doctor, or emergency — and tells you exactly what to do next.

> ⚠️ TriageMate is a triage/awareness tool, not a diagnostic one. It never claims to know a diagnosis and always directs users toward appropriate real-world care.

---

## Problem

Most people's first move when something feels off is an unstructured Google search — no personalization, no clear urgency signal, and no guidance on what to actually do next. This leads to two failure modes: dangerous delays in seeking emergency care, and unnecessary strain on hospitals for things that could be handled at home. This is especially acute for students and people without quick access to a doctor.

## Solution

TriageMate uses a carefully prompt-engineered LLM to turn a free-text symptom description into a structured assessment:

- **Urgency level** — `self_care` / `see_doctor` / `emergency`
- **Reasoning** — plain-language explanation of why
- **Recommended action** — a concrete next step
- **Care type** — what kind of care to seek (GP, ER, telehealth, etc.)

The model is instructed to be conservative (defaulting to caution on ambiguous or serious-sounding symptoms) and to never present its output as an actual diagnosis.

## Tech Stack

| Layer      | Tech                                   |
|------------|-----------------------------------------|
| Frontend   | HTML / CSS / vanilla JS (framework-agnostic, easy to deploy or port to React) |
| Backend    | Node.js, Express                        |
| AI / LLM   | Claude API (`claude-haiku-4-5`), prompt-engineered structured JSON output |
| Database   | Supabase (Postgres) — stores assessment history per session |
| Deployment | Vercel (frontend) + Render (backend)    |

## Project Structure

```
triagemate/
├── backend/
│   ├── server.js          # Express app + /api/assess endpoint
│   ├── llm.js              # Claude prompt + urgency classification logic
│   ├── supabaseClient.js   # Optional history storage
│   ├── package.json
│   └── .env.example
├── frontend/
│   └── index.html          # Single-page chat-style UI
└── README.md
```

## Getting Started (Local)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# then fill in ANTHROPIC_API_KEY (and optionally SUPABASE_URL / SUPABASE_ANON_KEY) in .env
npm start
```

The API will run at `http://localhost:5000`. Test it:

```bash
curl -X POST http://localhost:5000/api/assess \
  -H "Content-Type: application/json" \
  -d '{"message": "I have had a mild headache since this morning"}'
```

### 2. Frontend

Just open `frontend/index.html` in a browser — no build step required. If your backend isn't on `localhost:5000`, set the API base before loading the script:

```html
<script>window.TRIAGEMATE_API_BASE = "https://your-backend-url.com";</script>
```

## Using a Free-Tier LLM Instead of Claude

If you don't have Claude API credits, `backend/llm.js` isolates all LLM logic behind a single `assessSymptoms()` function — swap the Anthropic SDK call for Gemini, Groq, or OpenRouter, keep the same system prompt and JSON contract, and nothing else in the app needs to change.

## Database Setup (optional)

If using Supabase for history, run this in the Supabase SQL editor:

```sql
create table assessments (
  id uuid default gen_random_uuid() primary key,
  session_id text,
  user_message text,
  urgency text,
  reasoning text,
  recommended_action text,
  care_type text,
  created_at timestamp default now()
);
```

## Safety Design Notes

- The system prompt explicitly forbids diagnostic claims ("this could suggest", never "you have").
- Ambiguous or high-risk symptom descriptions default to the more cautious classification.
- Messages indicating self-harm or suicidal ideation are always classified as emergency, with a crisis resource recommendation included.
- All output is structured JSON, validated before being shown to the user, to avoid the model going off-script.

## Team

Built by Team **tabishachouhan001** for the Compass Crew AI Innovation Challenge 2026.

## Roadmap

- Regional language support
- Integration with local clinic/hospital directories for care-type suggestions
- Symptom history trends over time
- Voice input for accessibility
