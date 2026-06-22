import { z } from "zod";

import { moduleActionSchema, moduleCodeSchema } from "../auth/schema";

export const factoryOperationValues = ["list", "get", "create", "update", "delete"] as const;

export const factoryOperationSchema = z.enum(factoryOperationValues);

export const safeSqlIdentifierSchema = z.string().check(z.regex(/^[a-z][a-z0-9_]*$/));

export const sprintFiveModuleFactoryContractSchema = z.object({
  code: moduleCodeSchema,
  tableName: safeSqlIdentifierSchema.max(100),
  displayField: safeSqlIdentifierSchema.max(100),
  tenantScoped: z.boolean(),
  allowedOperations: z.array(factoryOperationSchema).min(1),
  allowedFilterFields: z.array(safeSqlIdentifierSchema.max(100)),
  allowedSortFields: z.array(safeSqlIdentifierSchema.max(100)),
  defaultPageSize: z.number().int().min(1).max(100),
  maxPageSize: z.number().int().min(1).max(100),
  permissionMap: z.object({
    list: moduleActionSchema.optional(),
    get: moduleActionSchema.optional(),
    create: moduleActionSchema.optional(),
    update: moduleActionSchema.optional(),
    delete: moduleActionSchema.optional()
  }).strict()
}).superRefine((contract, context) => {
  if (contract.defaultPageSize > contract.maxPageSize) {
    context.addIssue({
      code: "custom",
      message: "defaultPageSize cannot exceed maxPageSize."
    });
  }

  for (const operation of contract.allowedOperations) {
    if (!contract.permissionMap[operation]) {
      context.addIssue({
        code: "custom",
        message: `Missing permission mapping for ${operation}.`
      });
    }
  }
});

export type FactoryOperation = z.infer<typeof factoryOperationSchema>;
export type SprintFiveModuleFactoryContract = z.infer<typeof sprintFiveModuleFactoryContractSchema>;
