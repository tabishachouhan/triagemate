import { createClient } from "@supabase/supabase-js";

// If Supabase env vars aren't set, history storage is skipped gracefully
// (useful for quick local testing without setting up a DB first).
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

/**
 * Saves an assessment to the `assessments` table, if Supabase is configured.
 * Table schema (create this in Supabase SQL editor):
 *
 * create table assessments (
 *   id uuid default gen_random_uuid() primary key,
 *   session_id text,
 *   user_message text,
 *   urgency text,
 *   reasoning text,
 *   recommended_action text,
 *   care_type text,
 *   created_at timestamp default now()
 * );
 */
export async function saveAssessment(sessionId, userMessage, result) {
  if (!supabase) return null;

  const { data, error } = await supabase.from("assessments").insert([
    {
      session_id: sessionId,
      user_message: userMessage,
      urgency: result.urgency,
      reasoning: result.reasoning,
      recommended_action: result.recommended_action,
      care_type: result.care_type,
    },
  ]);

  if (error) console.error("Supabase insert error:", error.message);
  return data;
}
