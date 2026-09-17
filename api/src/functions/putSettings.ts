import { app } from "@azure/functions";
import { requireAuth } from "../shared/auth";
import { TASK_IDS, type TaskId } from "../shared/constants";
import { isValidDateIso } from "../shared/dateUtils";
import { ValidationError } from "../shared/httpErrors";
import { json, withErrorHandling } from "../shared/httpHelpers";
import { upsertSettingsPatch } from "../shared/tableClient";
import type { Settings } from "../shared/types";

app.http("putSettings", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "settings",
  handler: withErrorHandling(async (request) => {
    const userId = requireAuth(request);
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) throw new ValidationError("invalid body");

    const patch: Partial<Settings> = {};

    if ("weightKg" in body) {
      if (typeof body.weightKg !== "number" || body.weightKg <= 0) {
        throw new ValidationError("weightKg must be a positive number");
      }
      patch.weightKg = body.weightKg;
    }
    if ("waterGoalMlOverride" in body) {
      const v = body.waterGoalMlOverride;
      if (v !== null && (typeof v !== "number" || v <= 0)) {
        throw new ValidationError("waterGoalMlOverride must be a positive number or null");
      }
      patch.waterGoalMlOverride = v as number | null;
    }
    if ("cupSizeMl" in body) {
      if (typeof body.cupSizeMl !== "number" || body.cupSizeMl <= 0) {
        throw new ValidationError("cupSizeMl must be a positive number");
      }
      patch.cupSizeMl = body.cupSizeMl;
    }
    if ("startDate" in body) {
      if (typeof body.startDate !== "string" || !isValidDateIso(body.startDate)) {
        throw new ValidationError("startDate must be yyyy-MM-dd");
      }
      patch.startDate = body.startDate;
    }
    if ("taskLabels" in body) {
      const labels = body.taskLabels;
      if (typeof labels !== "object" || labels === null) throw new ValidationError("taskLabels must be an object");
      const cleaned: Partial<Record<TaskId, string>> = {};
      for (const [key, value] of Object.entries(labels as Record<string, unknown>)) {
        if (!(TASK_IDS as readonly string[]).includes(key)) throw new ValidationError(`unknown task id: ${key}`);
        if (typeof value !== "string" || !value.trim()) {
          throw new ValidationError(`label for ${key} must be a non-empty string`);
        }
        cleaned[key as TaskId] = value.trim();
      }
      patch.taskLabels = cleaned as Record<TaskId, string>;
    }

    const settings = await upsertSettingsPatch(userId, patch);
    return json(200, settings);
  }),
});
