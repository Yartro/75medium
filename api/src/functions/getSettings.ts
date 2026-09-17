import { app } from "@azure/functions";
import { requireAuth } from "../shared/auth";
import { json, withErrorHandling } from "../shared/httpHelpers";
import { getSettings } from "../shared/tableClient";

app.http("getSettings", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "settings",
  handler: withErrorHandling(async (request) => {
    const userId = requireAuth(request);
    const settings = await getSettings(userId);
    return json(200, settings);
  }),
});
