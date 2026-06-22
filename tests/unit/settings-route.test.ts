import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthorizationError } from "../../src/framework/auth";

const tenantId = "22222222-2222-4222-8222-222222222222";
const profileId = "44444444-4444-4444-8444-444444444444";
const userId = "11111111-1111-4111-8111-111111111111";

const settingsRecord = {
  id: "55555555-5555-4555-8555-555555555555",
  config: {
    general: {
      app_mode: "saas",
      app_name: "From Zero Framework",
      app_url: "http://localhost:3000",
      allow_multi_tenant_users: false,
      maintenance_mode: false,
      event_bus_enabled: true
    },
    security: {
      session_timeout_minutes: 30,
      absolute_timeout_minutes: 1440,
      max_login_attempts: 5,
      mfa_policy: "optional",
      invitation_ttl_days: 7,
      enable_rate_limit: true,
      rate_limit_global: 1000,
      rate_limit_tenant: 500,
      rate_limit_per_endpoint: {}
    },
    branding: {},
    notifications: {
      default_channel: "in_app",
      auto_dismiss_seconds: 10
    },
    storage: {
      image_optimization_webp: true
    },
    ai: {
      ai_enabled: false,
      ai_default_model_id: null
    },
    billing: {
      billing_enabled: true,
      licensing_model: "per_tenant",
      subscription: {
        default_plan_code: "free",
        expiry_action: "degrade_to_free"
      }
    },
    i18n: {
      default_locale: "es",
      supported_locales: ["es", "en"]
    },
    ui_defaults: {
      default_page_size: 25,
      default_search_result_limit: 10,
      breadcrumbs_enabled: true
    },
    legal: {},
    cleanup: {
      soft_delete: {
        auto_purge_days: 30
      }
    },
    integrations: {
      redis_enabled: false,
      inngest_enabled: true
    }
  },
  updated_by: null,
  updated_at: "2026-06-22T12:00:00.000Z"
};

let authUser: unknown;
let authError: unknown;
let permissionsData: unknown;
let permissionsError: unknown;
let settingsData: unknown;
let settingsError: unknown;

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    getAll: () => []
  }))
}));

vi.mock("../../src/framework/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/framework/auth")>();

  return {
    ...actual,
    createSupabaseServerClient: vi.fn(() => ({
      auth: {
        getUser: vi.fn(async () => ({
          data: { user: authUser },
          error: authError
        }))
      }
    })),
    createSupabaseServiceRoleClient: vi.fn(() => ({
      from(table: string) {
        if (table === "profile_permissions") {
          let eqCalls = 0;

          return {
            select() {
              return this;
            },
            eq() {
              eqCalls += 1;
              return eqCalls === 2 ? Promise.resolve({ data: permissionsData, error: permissionsError }) : this;
            }
          };
        }

        return {
          select() {
            return {
              single: async () => ({ data: settingsData, error: settingsError })
            };
          }
        };
      }
    }))
  };
});

vi.mock("@fw/auth", async () => import("../../src/framework/auth"));
vi.mock("@fw/api", async () => import("../../src/framework/api"));
vi.mock("@fw/modules/settings", async () => import("../../src/framework/modules/settings"));

describe("settings route", () => {
  beforeEach(() => {
    authUser = {
      id: userId,
      app_metadata: {
        tenant_id: tenantId,
        profile_id: profileId,
        profile_code: "admin"
      }
    };
    authError = null;
    permissionsData = [
      {
        profile_id: profileId,
        can_view: true,
        modules: { code: "settings" },
        profiles: { tenant_id: tenantId }
      }
    ];
    permissionsError = null;
    settingsData = settingsRecord;
    settingsError = null;
  });

  it("returns settings data for an authorized tenant user", async () => {
    const { GET } = await import("../../src/app/api/v1/settings/route");
    const response = await GET(new Request("http://localhost/api/v1/settings", {
      headers: {
        "x-request-id": "req-settings-1",
        "x-tenant-id": tenantId
      }
    }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.id).toBe(settingsRecord.id);
    expect(body.meta).toEqual(expect.objectContaining({
      is_demo: false,
      request_id: "req-settings-1"
    }));
  });

  it("returns safe errors for unauthenticated requests and service failures", async () => {
    const { GET } = await import("../../src/app/api/v1/settings/route");

    authUser = null;
    const unauthorizedResponse = await GET(new Request("http://localhost/api/v1/settings"));
    expect(unauthorizedResponse.status).toBe(401);
    await expect(unauthorizedResponse.json()).resolves.toEqual(expect.objectContaining({
      error: "authentication_required"
    }));

    authUser = {
      id: userId,
      app_metadata: {
        tenant_id: tenantId,
        profile_id: profileId
      }
    };
    settingsData = null;
    settingsError = new Error("database failure");
    const failureResponse = await GET(new Request("http://localhost/api/v1/settings"));
    expect(failureResponse.status).toBe(500);
    await expect(failureResponse.json()).resolves.toEqual(expect.objectContaining({
      error: "internal_error"
    }));
  });

  it("keeps authorization errors safe", async () => {
    const { toSafePrivateApiError } = await import("../../src/framework/api");

    expect(toSafePrivateApiError(new AuthorizationError())).toEqual({
      status: 403,
      body: { error: "forbidden" }
    });
  });
});
