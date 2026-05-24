import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !serviceKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env",
  );
}

// Server-side admin client — full access, never exposed to the browser.
export const supabase = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false },
});
