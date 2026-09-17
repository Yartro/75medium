import { getAuth, setAuth } from "../auth/tokenStore";
import type {
  DayLog,
  DayResponse,
  DaysRangeResponse,
  LoginResponse,
  Settings,
  TeamResponse,
} from "./types";

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// Not "Authorization": Azure Static Web Apps' managed-Functions proxy
// overwrites that header with its own internal service token before the
// request reaches the API, so the session token travels separately.
const AUTH_HEADER = "x-auth-token";

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const auth = getAuth();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers[AUTH_HEADER] = auth.token;

  const res = await fetch(`/api/${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    setAuth(null);
    throw new ApiError(401, "unauthorized");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data?.message ?? data?.error ?? "request_failed", data?.error);
  }
  return data as T;
}

export const api = {
  login: (name: string) => request<LoginResponse>("POST", "login", { name }),
  getToday: () => request<DayResponse>("GET", "days/today"),
  getDay: (date: string) => request<DayResponse>("GET", `days/${date}`),
  putDay: (date: string, patch: Partial<DayLog>) => request<DayResponse>("PUT", `days/${date}`, patch),
  addWater: (date: string, deltaMl: number) =>
    request<DayResponse>("POST", `days/${date}/water`, { deltaMl }),
  getDaysRange: (from: string, to: string) =>
    request<DaysRangeResponse>("GET", `days?from=${from}&to=${to}`),
  getTeam: () => request<TeamResponse>("GET", "team"),
  getSettings: () => request<Settings>("GET", "settings"),
  putSettings: (patch: Partial<Settings>) => request<Settings>("PUT", "settings", patch),
};
