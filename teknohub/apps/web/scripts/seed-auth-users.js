// Seed user auth via Supabase Admin Client (service role) — cara benar utk GoTrue
// Jalankan: node --env-file=.env.local scripts/seed-auth-users.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const users = [
  { email: "admin@teknohub.id", password: "Admin123!", username: "admin", role: "admin" },
  { email: "silver1@tekno.zone", password: "teknozone123", username: "silver1", role: "user" },
  { email: "silver2@tekno.zone", password: "teknozone123", username: "silver2", role: "user" },
  { email: "silver3@tekno.zone", password: "teknozone123", username: "silver3", role: "user" },
  { email: "silver4@tekno.zone", password: "teknozone123", username: "silver4", role: "user" },
  { email: "silver5@tekno.zone", password: "teknozone123", username: "silver5", role: "user" },
  { email: "silver6@tekno.zone", password: "teknozone123", username: "silver6", role: "user" },
  { email: "silver7@tekno.zone", password: "teknozone123", username: "silver7", role: "user" },
  { email: "silver8@tekno.zone", password: "teknozone123", username: "silver8", role: "user" },
  { email: "silver9@tekno.zone", password: "teknozone123", username: "silver9", role: "user" },
  { email: "gold1@tekno.zone", password: "teknozone123", username: "gold1", role: "user" },
  { email: "gold2@tekno.zone", password: "teknozone123", username: "gold2", role: "user" },
  { email: "gold3@tekno.zone", password: "teknozone123", username: "gold3", role: "user" },
  { email: "diamond1@tekno.zone", password: "teknozone123", username: "diamond1", role: "user" },
];

for (const u of users) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { username: u.username, role: u.role },
  });
  if (error) console.log("FAIL:", u.email, error.message);
  else console.log("OK:", u.email, data.user.id);
}
