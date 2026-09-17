import { createHmac, timingSafeEqual } from "node:crypto";
import type { HttpRequest } from "@azure/functions";
import { findUserById } from "./users";

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
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) throw new UnauthorizedError("Missing bearer token");
  const userId = verifyToken(match[1]);
  if (!userId) throw new UnauthorizedError("Invalid or expired token");
  return userId;
}
