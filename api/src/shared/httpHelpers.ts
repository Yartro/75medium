import type { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { UnauthorizedError } from "./auth";
import { ValidationError, ConflictError } from "./httpErrors";
import { ensureTables } from "./tableClient";

// Dev convenience so the Vite client can be pointed straight at func host:7071
// without the proxy while debugging; harmless once SWA serves same-origin in prod.
const corsHeaders = { "Access-Control-Allow-Origin": "*" };

export function json(status: number, body: unknown): HttpResponseInit {
  return { status, jsonBody: body, headers: corsHeaders };
}

type Handler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;

export function withErrorHandling(handler: Handler): Handler {
  return async (request, context) => {
    try {
      await ensureTables();
      return await handler(request, context);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        return json(401, { error: "unauthorized", message: err.message });
      }
      if (err instanceof ValidationError) {
        return json(400, { error: "validation_error", message: err.message });
      }
      if (err instanceof ConflictError) {
        return json(409, { error: err.code, message: err.message });
      }
      context.error(err);
      return json(500, { error: "internal_error" });
    }
  };
}
