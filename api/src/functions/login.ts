import { app } from "@azure/functions";
import { issueToken } from "../shared/auth";
import { ValidationError } from "../shared/httpErrors";
import { json, withErrorHandling } from "../shared/httpHelpers";
import { findUserByCode } from "../shared/users";

app.http("login", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "login",
  handler: withErrorHandling(async (request) => {
    const body = (await request.json().catch(() => null)) as { code?: string } | null;
    const code = body?.code?.trim();
    if (!code) throw new ValidationError("code is required");

    const user = findUserByCode(code);
    if (!user) return json(401, { error: "invalid_code" });

    const token = issueToken(user.id);
    return json(200, { token, userId: user.id, name: user.name });
  }),
});
