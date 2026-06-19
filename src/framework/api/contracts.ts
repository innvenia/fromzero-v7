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

export const sprintFourApiContracts = [
  {
    domain: "users",
    basePath: "/api/v1/users",
    ownerSprint: "Sprint 4",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  },
  {
    domain: "profiles",
    basePath: "/api/v1/profiles",
    ownerSprint: "Sprint 4",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  },
  {
    domain: "invitations",
    basePath: "/api/v1/invitations",
    ownerSprint: "Sprint 4",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  },
  {
    domain: "api-keys",
    basePath: "/api/v1/api-keys",
    ownerSprint: "Sprint 4",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  }
] as const;

export const sprintFiveApiContracts = [
  {
    domain: "custom-fields",
    basePath: "/api/v1/custom-fields",
    ownerSprint: "Sprint 5",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  },
  {
    domain: "filters",
    basePath: "/api/v1/filters",
    ownerSprint: "Sprint 5",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  },
  {
    domain: "relationships",
    basePath: "/api/v1/relationships",
    ownerSprint: "Sprint 5",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  }
] as const;

export const sprintSixApiContracts = [
  {
    domain: "billing-subscriptions",
    basePath: "/api/v1/billing/subscriptions",
    ownerSprint: "Sprint 6",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  },
  {
    domain: "billing-statements",
    basePath: "/api/v1/billing/statements",
    ownerSprint: "Sprint 6",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  },
  {
    domain: "billing-invoices",
    basePath: "/api/v1/billing/invoices",
    ownerSprint: "Sprint 6",
    implemented: false,
    requiresAuth: true,
    rateLimited: true
  },
  {
    domain: "billing-stripe-webhooks",
    basePath: "/api/v1/billing/webhooks/stripe",
    ownerSprint: "Sprint 6",
    implemented: false,
    requiresAuth: false,
    rateLimited: true
  }
] as const;

export const apiEndpointContracts = [
  ...sprintThreeApiContracts,
  ...sprintFourApiContracts,
  ...sprintFiveApiContracts,
  ...sprintSixApiContracts
] as const;

export type ApiEndpointContract = z.infer<typeof apiEndpointContractSchema>;
