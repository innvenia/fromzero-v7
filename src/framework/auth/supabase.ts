import { createBrowserClient, createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseCookieStore {
  getAll(): Array<{ name: string; value: string }>;
  set?(name: string, value: string, options?: CookieOptions): void;
}

export function createSupabaseBrowserClient(): SupabaseClient {
  return createBrowserClient(getSupabaseUrl(), getSupabasePublishableKey());
}

export function createSupabaseServerClient(cookieStore: SupabaseCookieStore): SupabaseClient {
  return createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        if (!cookieStore.set) {
          return;
        }

        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set?.(name, value, options);
        });
      }
    }
  });
}

export function createSupabaseServiceRoleClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("Supabase service role client is server-only");
  }

  return createClient(getSupabaseUrl(), getSupabaseServerOnlyKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

function getSupabaseUrl(): string {
  return readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
}

function getSupabasePublishableKey(): string {
  return readRequiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

function getSupabaseServerOnlyKey(): string {
  return readRequiredEnv("SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY");
}

function readRequiredEnv(primaryName: string, fallbackName?: string): string {
  const value = process.env[primaryName] ?? (fallbackName ? process.env[fallbackName] : undefined);

  if (!value) {
    throw new Error(`Missing required environment variable: ${primaryName}`);
  }

  return value;
}
