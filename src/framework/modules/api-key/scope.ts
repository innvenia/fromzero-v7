import { moduleActionSchema, moduleCodeSchema } from "../../auth/schema";
import { apiKeyScopeSchema } from "./schema";

export interface ApiKeyUsabilityInput {
  is_active: boolean;
  deleted_at: string | null;
  expires_at: string | null;
}

export function apiKeyScopeAllows(scopes: readonly string[], moduleCode: string, action: string): boolean {
  const parsedModuleCode = moduleCodeSchema.parse(moduleCode);
  const parsedAction = moduleActionSchema.parse(action);

  return scopes.map((scope) => apiKeyScopeSchema.parse(scope)).some((scope) => {
    const [scopeModule, scopeAction] = scope.split(":");

    return (scopeModule === "*" || scopeModule === parsedModuleCode)
      && (scopeAction === "*" || scopeAction === parsedAction);
  });
}

export function isApiKeyUsable(input: ApiKeyUsabilityInput, now = new Date()): boolean {
  if (!input.is_active || input.deleted_at) {
    return false;
  }

  if (!input.expires_at) {
    return true;
  }

  return new Date(input.expires_at).getTime() > now.getTime();
}
