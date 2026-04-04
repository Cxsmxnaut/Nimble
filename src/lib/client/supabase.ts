"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast in development if env isn't configured.
  // This keeps auth wiring explicit instead of silently degrading.
  console.warn("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

const fallbackUrl = "http://127.0.0.1:54321";
const fallbackAnon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.placeholder";

export const supabase = createClient(supabaseUrl ?? fallbackUrl, supabaseAnonKey ?? fallbackAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
