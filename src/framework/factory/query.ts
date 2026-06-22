import { z } from "zod";

import {
  safeSqlIdentifierSchema,
  sprintFiveModuleFactoryContractSchema,
  type SprintFiveModuleFactoryContract
} from "./schema";

export const factorySortSchema = z.object({
  field: safeSqlIdentifierSchema.max(100),
  direction: z.enum(["asc", "desc"])
});

export const factoryListQuerySchema = z.object({
  tenantId: z.uuid(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
  sort: factorySortSchema.optional(),
  filters: z.record(z.string(), z.unknown()).default({}),
  search: z.string().trim().max(200).optional()
});

export const boundedFactoryListRequestSchema = z.object({
  moduleCode: z.string().min(1),
  tenantId: z.uuid(),
  limit: z.number().int().min(1).max(100),
  offset: z.number().int().min(0),
  sort: factorySortSchema.nullable(),
  filters: z.record(z.string(), z.unknown()),
  search: z.string().nullable()
});

export type FactorySort = z.infer<typeof factorySortSchema>;
export type FactoryListQuery = z.infer<typeof factoryListQuerySchema>;
export type BoundedFactoryListRequest = z.infer<typeof boundedFactoryListRequestSchema>;

export function buildFactoryListRequest(
  contractInput: SprintFiveModuleFactoryContract,
  queryInput: unknown
): BoundedFactoryListRequest {
  const contract = sprintFiveModuleFactoryContractSchema.parse(contractInput);
  const rawQuery = z.record(z.string(), z.unknown()).parse(queryInput);

  if (!Object.hasOwn(rawQuery, "pageSize")) {
    throw new Error("pageSize is required for bounded factory list requests.");
  }

  const query = factoryListQuerySchema.parse(rawQuery);

  if (query.pageSize > contract.maxPageSize) {
    throw new Error("pageSize exceeds the module maxPageSize.");
  }

  if (query.sort && !contract.allowedSortFields.includes(query.sort.field)) {
    throw new Error("Sort field is not allowlisted for this module.");
  }

  for (const filterField of Object.keys(query.filters)) {
    if (!contract.allowedFilterFields.includes(filterField)) {
      throw new Error("Filter field is not allowlisted for this module.");
    }
  }

  return boundedFactoryListRequestSchema.parse({
    moduleCode: contract.code,
    tenantId: query.tenantId,
    limit: query.pageSize,
    offset: (query.page - 1) * query.pageSize,
    sort: query.sort ?? null,
    filters: query.filters,
    search: query.search ?? null
  });
}
