import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { apiKeyEnvironmentSchema, type ApiKeyEnvironment } from "./schema";

const apiKeyRandomByteLength = 32;

export interface GenerateApiKeyInput {
  environment: ApiKeyEnvironment;
}

export function generateApiKey(input: GenerateApiKeyInput): string {
  const environment = apiKeyEnvironmentSchema.parse(input.environment);
  const secret = randomBytes(apiKeyRandomByteLength).toString("base64url");

  return `sk_${environment}_${secret}`;
}

export function hashApiKey(plaintextApiKey: string): string {
  return createHash("sha256").update(plaintextApiKey, "utf8").digest("hex");
}

export function verifyApiKeyHash(plaintextApiKey: string, expectedHash: string): boolean {
  const actualHash = hashApiKey(plaintextApiKey);

  if (!/^[a-f0-9]{64}$/.test(expectedHash)) {
    return false;
  }

  return timingSafeEqual(Buffer.from(actualHash, "hex"), Buffer.from(expectedHash, "hex"));
}

export function getApiKeyPrefix(plaintextApiKey: string): string {
  return plaintextApiKey.slice(0, 10);
}
