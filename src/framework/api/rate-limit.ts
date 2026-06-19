import { z } from "zod";

export const rateLimitScopeSchema = z.enum(["global", "tenant", "user", "endpoint"]);

export const rateLimitRuleSchema = z.object({
  scope: rateLimitScopeSchema,
  windowSeconds: z.number().int().positive(),
  maxRequests: z.number().int().positive()
});

export const defaultRateLimitRules = [
  { scope: "global", windowSeconds: 60, maxRequests: 1000 },
  { scope: "tenant", windowSeconds: 60, maxRequests: 300 },
  { scope: "user", windowSeconds: 60, maxRequests: 120 },
  { scope: "endpoint", windowSeconds: 60, maxRequests: 60 }
] as const;

export type RateLimitRule = z.infer<typeof rateLimitRuleSchema>;
