import { z } from "zod";

export const apiEndpointContractSchema = z.object({
  domain: z.string().min(1),
  basePath: z.string().check(z.regex(/^\/api\/v1(?:\/[a-z0-9-]+)+$/)),
  ownerSprint: z.string().min(1),
  implemented: z.boolean(),
  requiresAuth: z.boolean(),
  rateLimited: z.boolean()
});

export type ApiEndpointContract = z.infer<typeof apiEndpointContractSchema>;

type ApiEndpointOptions = Partial<Pick<ApiEndpointContract, "implemented" | "requiresAuth" | "rateLimited">>;

function apiContract(
  ownerSprint: string,
  domain: string,
  basePath: string,
  options: ApiEndpointOptions = {}
): ApiEndpointContract {
  return {
    domain,
    basePath,
    ownerSprint,
    implemented: options.implemented ?? false,
    requiresAuth: options.requiresAuth ?? true,
    rateLimited: options.rateLimited ?? true
  };
}

export const sprintThreeApiContracts = [
  apiContract("Sprint 3", "health", "/api/v1/health", {
    implemented: true,
    requiresAuth: false,
    rateLimited: false
  }),
  apiContract("Sprint 3", "settings", "/api/v1/settings", { implemented: true }),
  apiContract("Sprint 3", "modules", "/api/v1/modules"),
  apiContract("Sprint 3", "plans", "/api/v1/plans"),
  apiContract("Sprint 3", "tenants", "/api/v1/tenants")
] as const;

export const sprintFourApiContracts = [
  apiContract("Sprint 4", "users", "/api/v1/users"),
  apiContract("Sprint 4", "profiles", "/api/v1/profiles"),
  apiContract("Sprint 4", "invitations", "/api/v1/invitations"),
  apiContract("Sprint 4", "api-keys", "/api/v1/api-keys")
] as const;

export const sprintFiveApiContracts = [
  apiContract("Sprint 5", "custom-fields", "/api/v1/custom-fields"),
  apiContract("Sprint 5", "filters", "/api/v1/filters"),
  apiContract("Sprint 5", "relationships", "/api/v1/relationships")
] as const;

export const sprintSixApiContracts = [
  apiContract("Sprint 6", "billing-subscriptions", "/api/v1/billing/subscriptions"),
  apiContract("Sprint 6", "billing-statements", "/api/v1/billing/statements"),
  apiContract("Sprint 6", "billing-invoices", "/api/v1/billing/invoices"),
  apiContract("Sprint 6", "billing-stripe-webhooks", "/api/v1/billing/webhooks/stripe", {
    requiresAuth: false
  })
] as const;

export const sprintSevenApiContracts = [
  apiContract("Sprint 7", "files", "/api/v1/files"),
  apiContract("Sprint 7", "documents", "/api/v1/documents"),
  apiContract("Sprint 7", "tags", "/api/v1/tags"),
  apiContract("Sprint 7", "bookmarks", "/api/v1/bookmarks"),
  apiContract("Sprint 7", "consent-records", "/api/v1/consent-records")
] as const;

export const sprintEightApiContracts = [
  apiContract("Sprint 8", "events", "/api/v1/events"),
  apiContract("Sprint 8", "jobs", "/api/v1/jobs"),
  apiContract("Sprint 8", "notifications", "/api/v1/notifications"),
  apiContract("Sprint 8", "rules", "/api/v1/rules"),
  apiContract("Sprint 8", "email-templates", "/api/v1/email-templates"),
  apiContract("Sprint 8", "integrations", "/api/v1/integrations"),
  apiContract("Sprint 8", "webhooks", "/api/v1/webhooks"),
  apiContract("Sprint 8", "imports", "/api/v1/import-jobs"),
  apiContract("Sprint 8", "exports", "/api/v1/export-jobs")
] as const;

export const sprintNineApiContracts = [
  apiContract("Sprint 9", "ai-models", "/api/v1/ai/models"),
  apiContract("Sprint 9", "ai-invoke", "/api/v1/ai/invoke")
] as const;

export const apiEndpointContracts = [
  ...sprintThreeApiContracts,
  ...sprintFourApiContracts,
  ...sprintFiveApiContracts,
  ...sprintSixApiContracts,
  ...sprintSevenApiContracts,
  ...sprintEightApiContracts,
  ...sprintNineApiContracts
] as const;
