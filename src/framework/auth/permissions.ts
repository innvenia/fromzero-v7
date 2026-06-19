import { moduleActionSchema, moduleCodeSchema, type AuthContext } from "./schema";
import { AuthorizationError } from "./errors";
import { apiKeyScopeAllows } from "../modules/api-key";

export interface PermissionGrant {
  tenantId: string;
  subjectType: "user" | "profile";
  subjectId: string;
  moduleCode: string;
  action: string;
  allowed: boolean;
}

export function requirePermission(
  context: AuthContext,
  moduleCode: string,
  action: string,
  grants: PermissionGrant[]
): true {
  const parsedModuleCode = moduleCodeSchema.parse(moduleCode);
  const parsedAction = moduleActionSchema.parse(action);

  if (context.authMethod === "jwt" && context.isSuperAdmin) {
    return true;
  }

  if (context.authMethod === "api_key" && !apiKeyScopeAllows(context.scopes, parsedModuleCode, parsedAction)) {
    throw new AuthorizationError("API key scope does not allow this action");
  }

  const subjects = context.authMethod === "jwt"
    ? [
        { type: "user", id: context.userId },
        context.profileId ? { type: "profile", id: context.profileId } : null
      ].filter((subject): subject is { type: "user" | "profile"; id: string } => subject !== null)
    : [{ type: "profile", id: context.profileId }];

  const hasGrant = grants.some((grant) =>
    grant.tenantId === context.tenantId
    && grant.moduleCode === parsedModuleCode
    && grant.action === parsedAction
    && grant.allowed
    && subjects.some((subject) => subject.type === grant.subjectType && subject.id === grant.subjectId)
  );

  if (!hasGrant) {
    throw new AuthorizationError("Missing required permission");
  }

  return true;
}
