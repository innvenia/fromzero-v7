import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  AuthenticationError,
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
  type PermissionGrant
} from "@fw/auth";
import { createPrivateApiRequestContext, toSafePrivateApiError } from "@fw/api";
import { settingsRecordSchema } from "@fw/modules/settings";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? randomUUID();

  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient({
      getAll: () => cookieStore.getAll()
    });
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new AuthenticationError();
    }

    const serviceClient = createSupabaseServiceRoleClient();
    const grants = await loadSettingsPermissionGrants(serviceClient, user.app_metadata.profile_id);
    const privateContext = createPrivateApiRequestContext({
      userId: user.id,
      appMetadata: user.app_metadata,
      requestedTenantId: request.headers.get("x-tenant-id"),
      moduleCode: "settings",
      action: "view",
      permissionGrants: grants,
      route: "/api/v1/settings",
      requestId
    });

    const { data: settingsRecord, error: settingsError } = await serviceClient
      .from("settings")
      .select("id, config, updated_by, updated_at")
      .single();

    if (settingsError || !settingsRecord) {
      throw new Error("Settings record could not be loaded");
    }

    const parsedSettings = settingsRecordSchema.parse(settingsRecord);

    return NextResponse.json({
      data: parsedSettings,
      meta: {
        is_demo: false,
        request_id: requestId,
        audit_id: privateContext.audit.id
      }
    });
  } catch (error) {
    const safeError = toSafePrivateApiError(error);

    return NextResponse.json(
      {
        ...safeError.body,
        request_id: requestId
      },
      { status: safeError.status }
    );
  }
}

async function loadSettingsPermissionGrants(
  serviceClient: ReturnType<typeof createSupabaseServiceRoleClient>,
  profileId: unknown
): Promise<PermissionGrant[]> {
  if (typeof profileId !== "string") {
    return [];
  }

  const { data, error } = await serviceClient
    .from("profile_permissions")
    .select("profile_id, can_view, modules!inner(code), profiles!inner(tenant_id)")
    .eq("profile_id", profileId)
    .eq("modules.code", "settings");

  if (error || !data) {
    return [];
  }

  return data.flatMap((row) => {
    const permissionRow = row as {
      profile_id?: string;
      can_view?: boolean;
      modules?: { code?: string } | { code?: string }[];
      profiles?: { tenant_id?: string | null } | { tenant_id?: string | null }[];
    };
    const moduleRecord = Array.isArray(permissionRow.modules) ? permissionRow.modules[0] : permissionRow.modules;
    const profile = Array.isArray(permissionRow.profiles) ? permissionRow.profiles[0] : permissionRow.profiles;

    if (!permissionRow.profile_id || !moduleRecord?.code || !profile?.tenant_id) {
      return [];
    }

    return [
      {
        tenantId: profile.tenant_id,
        subjectType: "profile",
        subjectId: permissionRow.profile_id,
        moduleCode: moduleRecord.code,
        action: "view",
        allowed: permissionRow.can_view === true
      }
    ];
  });
}
