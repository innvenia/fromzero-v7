import { z } from "zod";

export const apiEndpointContractSchema = z.object({
  domain: z.string().min(1),
  basePath: z.string().regex(/^\/api\/v1(?:\/[a-z0-9-]+)+$/),
  ownerSprint: z.string().min(1),
  implemented: z.boolean(),
  requiresAuth: z.boolean(),
  rateLimited: z.boolean()
});

export const sprintThreeApiContracts = [
  {
    domain: "health",
    basePath: "/api/v1/health",
    ownerSprint: "Sprint 3",
    implemented: true,
    requiresAuth: false,
    rateLimited: false
  },
  {
    domain: "settings",
    basePath: "/api/v1/settings",
    ownerSprint: "Sprint 3",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  },
  {
    domain: "modules",
    basePath: "/api/v1/modules",
    ownerSprint: "Sprint 3",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  },
  {
    domain: "plans",
    basePath: "/api/v1/plans",
    ownerSprint: "Sprint 3",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  },
  {
    domain: "tenants",
    basePath: "/api/v1/tenants",
    ownerSprint: "Sprint 3",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  }
] as const;

export type ApiEndpointContract = z.infer<typeof apiEndpointContractSchema>;
