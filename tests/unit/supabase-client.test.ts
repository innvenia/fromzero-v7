import { afterEach, describe, expect, it, vi } from "vitest";

const supabaseMocks = vi.hoisted(() => ({
  createBrowserClient: vi.fn(() => ({ kind: "browser" })),
  createServerClient: vi.fn(() => ({ kind: "server" })),
  createClient: vi.fn(() => ({ kind: "service-role" }))
}));

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: supabaseMocks.createBrowserClient,
  createServerClient: supabaseMocks.createServerClient
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: supabaseMocks.createClient
}));

import {
  createSupabaseBrowserClient,
  createSupabaseServerClient,
  createSupabaseServiceRoleClient
} from "../../src/framework/auth/supabase";

const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type ServerClientOptions = {
  cookies: {
    getAll(): Array<{ name: string; value: string }>;
    setAll(cookiesToSet: Array<{ name: string; value: string; options?: { path?: string } }>): void;
  };
};

function stubSupabaseEnv() {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable-key");
  vi.stubEnv("SUPABASE_SECRET_KEY", "service-role-key");
}

function restoreWindow() {
  if (originalWindowDescriptor) {
    Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    return;
  }

  Reflect.deleteProperty(globalThis, "window");
}

describe("Supabase client factories", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    restoreWindow();
  });

  it("creates a browser client from public environment settings", () => {
    stubSupabaseEnv();

    expect(createSupabaseBrowserClient()).toEqual({ kind: "browser" });
    expect(supabaseMocks.createBrowserClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "publishable-key"
    );
  });

  it("creates a server client and forwards cookie reads and writes", () => {
    stubSupabaseEnv();

    const getAll = vi.fn(() => [{ name: "sb-session", value: "token" }]);
    const setCookie = vi.fn();

    expect(createSupabaseServerClient({ getAll, set: setCookie })).toEqual({ kind: "server" });

    const options = supabaseMocks.createServerClient.mock.calls[0]?.[2] as ServerClientOptions;

    expect(supabaseMocks.createServerClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "publishable-key",
      expect.any(Object)
    );
    expect(options.cookies.getAll()).toEqual([{ name: "sb-session", value: "token" }]);

    options.cookies.setAll([{ name: "sb-session", value: "refreshed", options: { path: "/" } }]);

    expect(setCookie).toHaveBeenCalledWith("sb-session", "refreshed", { path: "/" });
  });

  it("ignores server cookie writes when the store is read-only", () => {
    stubSupabaseEnv();

    createSupabaseServerClient({
      getAll: () => []
    });

    const options = supabaseMocks.createServerClient.mock.calls[0]?.[2] as ServerClientOptions;

    expect(() => {
      options.cookies.setAll([{ name: "sb-session", value: "refreshed" }]);
    }).not.toThrow();
  });

  it("creates a server-only service role client", () => {
    stubSupabaseEnv();

    expect(createSupabaseServiceRoleClient()).toEqual({ kind: "service-role" });
    expect(supabaseMocks.createClient).toHaveBeenCalledWith("https://example.supabase.co", "service-role-key", {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  });

  it("rejects service role clients in browser contexts", () => {
    stubSupabaseEnv();
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {}
    });

    expect(() => createSupabaseServiceRoleClient()).toThrow("Supabase service role client is server-only");
    expect(supabaseMocks.createClient).not.toHaveBeenCalled();
  });

  it("fails fast when required Supabase configuration is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable-key");

    expect(() => createSupabaseBrowserClient()).toThrow(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL"
    );
  });
});
