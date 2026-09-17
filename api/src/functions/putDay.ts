import { app } from "@azure/functions";
import { requireAuth } from "../shared/auth";
import { isCheatAvailableForWeek } from "../shared/challengeMath";
import { addDays, getTodayISO, isValidDateIso, startOfIsoWeek } from "../shared/dateUtils";
import { buildDayResponse } from "../shared/dayResponse";
import { ConflictError, ValidationError } from "../shared/httpErrors";
import { json, withErrorHandling } from "../shared/httpHelpers";
import { getLogsInRange, getSettings, upsertDailyLogPatch } from "../shared/tableClient";
import type { DailyLogPatch } from "../shared/types";

const ALLOWED_KEYS = [
  "workoutDone",
  "workoutExtraDone",
  "readingOrPodcastDone",
  "dietDone",
  "dietCheatUsed",
  "meditateDone",
  "noAlcoholDone",
] as const;

app.http("putDay", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "days/{date}",
  handler: withErrorHandling(async (request) => {
    const userId = requireAuth(request);
    const rawDate = request.params.date;
    const date = rawDate === "today" ? getTodayISO() : rawDate;
    if (!isValidDateIso(date)) throw new ValidationError("invalid date");

    const settings = await getSettings(userId);
    if (date < settings.startDate) throw new ValidationError("date is before challenge start date");

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) throw new ValidationError("invalid body");

    const patch: DailyLogPatch = {};
    for (const key of ALLOWED_KEYS) {
      if (key in body) {
        if (typeof body[key] !== "boolean") throw new ValidationError(`${key} must be a boolean`);
        patch[key] = body[key] as boolean;
      }
    }

    if (patch.dietCheatUsed === true) {
      const weekStart = startOfIsoWeek(date);
      const weekEnd = addDays(weekStart, 6);
      const weekLogs = await getLogsInRange(userId, weekStart, weekEnd);
      if (!isCheatAvailableForWeek(date, weekLogs)) {
        throw new ConflictError("cheat_already_used", "De wekelijkse cheat is deze week al gebruikt");
      }
    }

    await upsertDailyLogPatch(userId, date, patch);
    const day = await buildDayResponse(userId, date, settings);
    return json(200, day);
  }),
});
