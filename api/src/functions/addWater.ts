import { app } from "@azure/functions";
import { requireAuth } from "../shared/auth";
import { getTodayISO, isValidDateIso } from "../shared/dateUtils";
import { buildDayResponse } from "../shared/dayResponse";
import { ValidationError } from "../shared/httpErrors";
import { json, withErrorHandling } from "../shared/httpHelpers";
import { addWaterMl, getSettings } from "../shared/tableClient";

app.http("addWater", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "days/{date}/water",
  handler: withErrorHandling(async (request) => {
    const userId = requireAuth(request);
    const rawDate = request.params.date;
    const date = rawDate === "today" ? getTodayISO() : rawDate;
    if (!isValidDateIso(date)) throw new ValidationError("invalid date");

    const settings = await getSettings(userId);
    if (date < settings.startDate) throw new ValidationError("date is before challenge start date");

    const body = (await request.json().catch(() => null)) as { deltaMl?: number } | null;
    const deltaMl = body?.deltaMl;
    if (typeof deltaMl !== "number" || !Number.isFinite(deltaMl)) {
      throw new ValidationError("deltaMl must be a number");
    }

    await addWaterMl(userId, date, deltaMl);
    const day = await buildDayResponse(userId, date, settings);
    return json(200, day);
  }),
});
