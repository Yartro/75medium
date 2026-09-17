import { createHmac, timingSafeEqual } from "node:crypto";
import type { HttpRequest } from "@azure/functions";
import { findUserById } from "./users";

// Azure Static Web Apps' managed-Functions proxy overwrites the standard
// "Authorization" header with its own internal SWA-to-Functions service
// token before the request reaches this code, so the app's own session
// token travels in a separate header instead.
export const AUTH_HEADER = "x-auth-token";

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured");
  return secret;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

export function issueToken(userId: string): string {
  const payload = base64url(JSON.stringify({ userId, iat: Date.now() }));
  const signature = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = createHmac("sha256", getSecret()).update(payload).digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const userId = decoded.userId;
    if (typeof userId !== "string" || !findUserById(userId)) return null;
    return userId;
  } catch {
    return null;
  }
}

export class UnauthorizedError extends Error {}

export function requireAuth(request: HttpRequest): string {
  const token = request.headers.get(AUTH_HEADER) ?? "";
  if (!token) throw new UnauthorizedError("Missing auth token");
  const userId = verifyToken(token);
  if (!userId) throw new UnauthorizedError("Invalid or expired token");
  return userId;
}
