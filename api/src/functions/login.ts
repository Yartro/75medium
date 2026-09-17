import { app } from "@azure/functions";
import { issueToken } from "../shared/auth";
import { ValidationError } from "../shared/httpErrors";
import { json, withErrorHandling } from "../shared/httpHelpers";
import { findUserByName } from "../shared/users";

app.http("login", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "login",
  handler: withErrorHandling(async (request) => {
    const body = (await request.json().catch(() => null)) as { name?: string } | null;
    const name = body?.name?.trim();
    if (!name) throw new ValidationError("name is required");

    const user = findUserByName(name);
    if (!user) return json(401, { error: "invalid_name" });

    const token = issueToken(user.id);
    return json(200, { token, userId: user.id, name: user.name });
  }),
});
