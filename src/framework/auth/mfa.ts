import { type MfaPolicy, mfaPolicySchema } from "./schema";

const mfaStrength: Record<MfaPolicy, number> = {
  disabled: 0,
  optional: 1,
  required: 2
};

export function resolveEffectiveMfaPolicy(globalPolicy: MfaPolicy, tenantPolicy?: MfaPolicy | null): MfaPolicy {
  const parsedGlobalPolicy = mfaPolicySchema.parse(globalPolicy);
  const parsedTenantPolicy = tenantPolicy ? mfaPolicySchema.parse(tenantPolicy) : parsedGlobalPolicy;

  return mfaStrength[parsedTenantPolicy] > mfaStrength[parsedGlobalPolicy]
    ? parsedTenantPolicy
    : parsedGlobalPolicy;
}
