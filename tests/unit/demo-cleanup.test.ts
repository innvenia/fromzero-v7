import { describe, expect, it } from "vitest";

import {
  assertDemoCleanupAllowed,
  demoCleanableTables,
  demoProtectedTables,
  demoRecordSchema
} from "../../src/framework/demo";
import { foundationTables } from "../../src/framework/db";

describe("demo cleanup contract", () => {
  it("requires every demo record to be explicitly marked", () => {
    expect(demoRecordSchema.parse({ is_demo: true })).toEqual({ is_demo: true });
    expect(() => demoRecordSchema.parse({ is_demo: false })).toThrow();
  });

  it("keeps foundation tables out of demo cleanup", () => {
    for (const table of foundationTables) {
      expect(demoProtectedTables).toContain(table);
      expect(demoCleanableTables).not.toContain(table);
      expect(() => assertDemoCleanupAllowed(table)).toThrow();
    }
  });

  it("allows cleanup only for explicit demo-capable tables", () => {
    expect(() => assertDemoCleanupAllowed("documents")).not.toThrow();
    expect(() => assertDemoCleanupAllowed("settings")).toThrow();
  });
});
