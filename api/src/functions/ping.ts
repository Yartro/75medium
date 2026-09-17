import { app } from "@azure/functions";
import { debugSecretFingerprint } from "../shared/auth";

app.http("ping", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "ping",
  // TEMP DIAGNOSTIC - fp field, remove after the 401 investigation.
  handler: async () => ({ status: 200, jsonBody: { ok: true, fp: debugSecretFingerprint() } }),
});
