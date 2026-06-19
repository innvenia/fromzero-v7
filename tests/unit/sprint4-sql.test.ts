import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { sprintFourMigration, sprintFourRlsTables } from "../../src/framework/db";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const migrationPath = join(currentDirectory, "..", "..", "supabase", "migrations", sprintFourMigration);
const migrationSql = readFileSync(migrationPath, "utf8");

describe("Sprint 4 SQL contract", () => {
  it("enables RLS for every Sprint 4 tenant-aware table", () => {
    for (const table of sprintFourRlsTables) {
      expect(migrationSql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("stores invitation and API key secrets as hashes", () => {
    expect(migrationSql).toContain("token_hash text not null unique");
    expect(migrationSql).toContain("key_hash text not null unique");
    expect(migrationSql).not.toContain("plaintext");
  });

  it("keeps tenant context tied to app metadata and not request headers", () => {
    expect(migrationSql).toContain("app_private.current_tenant_id()");
    expect(migrationSql).not.toMatch(/x-tenant-id|tenant header|request\.headers/i);
  });

  it("does not expose Sprint 4 tenant tables to anonymous clients", () => {
    for (const table of sprintFourRlsTables) {
      expect(migrationSql).toContain(`revoke all on public.${table} from anon;`);
      expect(migrationSql).not.toMatch(new RegExp(`grant\\s+select\\s+on\\s+public\\.${table}\\s+to\\s+anon`, "i"));
    }
  });

  it("keeps service role explicit and server-only by contract", () => {
    expect(migrationSql).toContain("grant all privileges on public.api_keys to service_role;");
    expect(migrationSql).not.toContain("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE");
  });
});
