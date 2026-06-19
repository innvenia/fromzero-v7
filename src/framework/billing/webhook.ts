import { createHmac, timingSafeEqual } from "node:crypto";

type VerifyStripeWebhookSignatureInput = {
  payload: string;
  signatureHeader: string;
  secret: string;
  now: Date;
  toleranceSeconds: number;
};

function parseStripeSignatureHeader(signatureHeader: string) {
  const parts = signatureHeader.split(",");
  const timestampPart = parts.find((part) => part.startsWith("t="));
  const signaturePart = parts.find((part) => part.startsWith("v1="));

  return {
    timestamp: timestampPart ? Number(timestampPart.slice(2)) : Number.NaN,
    signature: signaturePart?.slice(3) ?? ""
  };
}

function safeEqualHex(left: string, right: string) {
  if (!/^[a-f0-9]+$/i.test(left) || !/^[a-f0-9]+$/i.test(right)) {
    return false;
  }

  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyStripeWebhookSignature(input: VerifyStripeWebhookSignatureInput): boolean {
  if (!input.secret || !input.signatureHeader) {
    return false;
  }

  const { timestamp, signature } = parseStripeSignatureHeader(input.signatureHeader);

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  const nowSeconds = Math.floor(input.now.getTime() / 1000);

  if (Math.abs(nowSeconds - timestamp) > input.toleranceSeconds) {
    return false;
  }

  const expectedSignature = createHmac("sha256", input.secret)
    .update(`${timestamp}.${input.payload}`)
    .digest("hex");

  return safeEqualHex(expectedSignature, signature);
}
