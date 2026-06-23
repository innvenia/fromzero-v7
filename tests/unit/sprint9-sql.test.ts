import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { sprintNineMigration, sprintNineRlsTables } from "../../src/framework/db";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const migrationPath = join(currentDirectory, "..", "..", "supabase", "migrations", sprintNineMigration);
const migrationSql = readFileSync(migrationPath, "utf8");

describe("Sprint 9 SQL contract", () => {
  it("creates AI model catalog and budget tables", () => {
    expect(migrationSql).toContain("create table if not exists public.ai_models");
    expect(migrationSql).toContain("create table if not exists public.ai_budgets");
  });

  it("enables RLS on AI tables exposed through the Data API", () => {
    for (const table of sprintNineRlsTables) {
      expect(migrationSql).toContain(`alter table public.${table} enable row level security;`);
      expect(migrationSql).toContain(`revoke all on public.${table} from anon;`);
    }
  });

  it("uses explicit grants for Data API exposure", () => {
    expect(migrationSql).toMatch(/grant\s+select\s+on\s+public\.ai_models\s+to\s+authenticated/i);
    expect(migrationSql).toMatch(/grant\s+select\s+on\s+public\.ai_budgets\s+to\s+authenticated/i);
    expect(migrationSql).not.toMatch(/grant\s+insert\s+on\s+public\.ai_budgets\s+to\s+authenticated/i);
    expect(migrationSql).toMatch(/grant\s+all\s+privileges\s+on\s+public\.ai_models,\s+public\.ai_budgets\s+to\s+service_role/i);
  });

  it("seeds the revalidated OpenRouter model without secrets", () => {
    expect(migrationSql).toContain("google/gemma-4-26b-a4b-it:free");
    expect(migrationSql).toContain("https://openrouter.ai/api/v1/chat/completions");
    expect(migrationSql).not.toMatch(/OPENROUTER_API_KEY\s*=/i);
    expect(migrationSql).not.toContain("sk-");
  });

  it("tracks guardrails and budget dimensions", () => {
    expect(migrationSql).toContain("pricing_unit in ('per_1k', 'per_1m')");
    expect(migrationSql).toContain("context_window");
    expect(migrationSql).toContain("max_input_tokens");
    expect(migrationSql).toContain("max_tokens");
    expect(migrationSql).toContain("max_cost_per_request");
    expect(migrationSql).toContain("feature_key");
    expect(migrationSql).toContain("on_exceed in ('block', 'warn')");
  });
});
