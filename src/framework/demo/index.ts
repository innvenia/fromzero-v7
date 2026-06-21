import { z } from "zod";

import {
  foundationTables,
  sprintEightRlsTables,
  sprintSevenRlsTables,
  sprintSixRlsTables
} from "../db";

export const demoRecordSchema = z.object({
  is_demo: z.literal(true)
});

export const demoProtectedTables = [...foundationTables, "consent_records"] as const;

export const demoCleanableTables = [
  ...sprintSixRlsTables,
  "custom_fields",
  "filters",
  "record_relationships",
  "relationship_types",
  ...sprintSevenRlsTables.filter((table) => table !== "consent_records"),
  ...sprintEightRlsTables
] as const;

export type DemoCleanableTable = (typeof demoCleanableTables)[number];

export function isDemoCleanableTable(table: string): table is DemoCleanableTable {
  return demoCleanableTables.includes(table as DemoCleanableTable);
}

export function assertDemoCleanupAllowed(table: string): asserts table is DemoCleanableTable {
  if (!isDemoCleanableTable(table)) {
    throw new Error(`Demo cleanup is not allowed for table: ${table}`);
  }
}
