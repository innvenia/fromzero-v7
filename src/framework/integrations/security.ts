const blockedHostnames = new Set([
  "localhost",
  "metadata.google.internal"
]);

function isPrivateIpv4Address(hostname: string): boolean {
  const octets = hostname.split(".").map((value) => Number(value));

  if (octets.length !== 4 || octets.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
    return false;
  }

  const [first, second] = octets;

  return first === 0
    || first === 10
    || first === 127
    || (first === 100 && second >= 64 && second <= 127)
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 168);
}

function isPrivateIpv6Address(hostname: string): boolean {
  const normalized = hostname.toLowerCase();

  return normalized === "::1"
    || normalized.startsWith("fc")
    || normalized.startsWith("fd")
    || normalized.startsWith("fe80:")
    || normalized.includes(":127.")
    || normalized.includes(":10.")
    || normalized.includes(":192.168.")
    || normalized.includes(":169.254.");
}

export function assertSafeOutboundUrl(rawUrl: string): URL {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Outbound URL is invalid.");
  }

  if (url.protocol !== "https:") {
    throw new Error("Outbound URL must use HTTPS.");
  }

  if (url.username || url.password) {
    throw new Error("Outbound URL cannot include credentials.");
  }

  const hostname = url.hostname.toLowerCase();

  if (
    blockedHostnames.has(hostname)
    || hostname.endsWith(".localhost")
    || hostname.endsWith(".local")
    || isPrivateIpv4Address(hostname)
    || isPrivateIpv6Address(hostname)
  ) {
    throw new Error("Outbound URL points to a blocked private host.");
  }

  return url;
}

export function redactSensitiveObject(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).map(([key, value]) => {
    if (/secret|token|key|password|credential/i.test(key)) {
      return [key, "[redacted]"];
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return [key, redactSensitiveObject(value as Record<string, unknown>)];
    }

    return [key, value];
  }));
}
