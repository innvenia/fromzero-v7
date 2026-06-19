import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { foundationMigration, rlsFoundationTables } from "../../src/framework/db";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const migrationPath = join(currentDirectory, "..", "..", "supabase", "migrations", foundationMigration);
const migrationSql = readFileSync(migrationPath, "utf8");

describe("foundation SQL contract", () => {
  it("enables RLS for every tenant-aware foundation table", () => {
    for (const table of rlsFoundationTables) {
      expect(migrationSql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("keeps logs append-only", () => {
    expect(migrationSql).toContain("create or replace function app_private.prevent_log_mutation()");
    expect(migrationSql).toContain("before update on public.logs");
    expect(migrationSql).toContain("before delete on public.logs");
  });

  it("enforces the approved single-active-tenant default for users", () => {
    expect(migrationSql).toContain("user_memberships_single_active_user_tenant");
    expect(migrationSql).toContain("'allow_multi_tenant_users', false");
  });

  it("keeps trial expiry aligned to degrade_to_free", () => {
    expect(migrationSql).toContain("'expiry_action', 'degrade_to_free'");
    expect(migrationSql).toContain("('free', 'Free'");
  });

  it("does not grant tenant tables to anonymous clients", () => {
    expect(migrationSql).toContain("revoke all on public.tenants from anon;");
    expect(migrationSql).not.toMatch(/grant\s+select\s+on\s+public\.tenants\s+to\s+anon/i);
  });

  it("uses app metadata tenant context instead of tenant headers", () => {
    expect(migrationSql).toContain("auth.jwt() -> 'app_metadata' ->> 'tenant_id'");
    expect(migrationSql).not.toContain("x-tenant-id");
  });
});
