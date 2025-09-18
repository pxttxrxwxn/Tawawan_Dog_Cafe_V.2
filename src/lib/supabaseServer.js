import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) {
  throw new Error("❌ Missing env: NEXT_PUBLIC_SUPABASE_URL");
}
if (!serviceKey) {
  console.warn("⚠️ Warning: Missing SUPABASE_SERVICE_ROLE_KEY (admin actions may fail)");
}
if (!anonKey) {
  console.warn("⚠️ Warning: Missing NEXT_PUBLIC_SUPABASE_ANON_KEY (client actions may fail)");
}

export const supabaseAdmin = createClient(url, serviceKey);
export const supabase = createClient(url, anonKey);
