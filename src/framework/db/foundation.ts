export const foundationMigration = "20260618000300_foundation_schema.sql";

export const moduleActions = [
  "view",
  "create",
  "update",
  "delete",
  "import",
  "export",
  "notify"
] as const;

export type ModuleAction = (typeof moduleActions)[number];

export const foundationTables = [
  "settings",
  "modules",
  "plans",
  "logs",
  "profiles",
  "profile_permissions",
  "tenants",
  "user_memberships"
] as const;

export type FoundationTable = (typeof foundationTables)[number];

export const globalFoundationTables = [
  "settings",
  "modules",
  "plans"
] as const;

export const rlsFoundationTables = [
  "logs",
  "profiles",
  "profile_permissions",
  "tenants",
  "user_memberships"
] as const;

export const tenantScopedFoundationTables = [
  "logs",
  "tenants",
  "user_memberships"
] as const;

export const baseProfileCodes = [
  "super_admin",
  "admin",
  "member",
  "guest"
] as const;

export type BaseProfileCode = (typeof baseProfileCodes)[number];

export const tenantStatusValues = [
  "active",
  "suspended",
  "marked_for_deletion",
  "purged"
] as const;

export type TenantStatus = (typeof tenantStatusValues)[number];

export function requiresRls(table: string): table is (typeof rlsFoundationTables)[number] {
  return rlsFoundationTables.includes(table as (typeof rlsFoundationTables)[number]);
}
