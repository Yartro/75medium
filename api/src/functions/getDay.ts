import { app } from "@azure/functions";
import { requireAuth } from "../shared/auth";
import { buildDayResponse } from "../shared/dayResponse";
import { getTodayISO, isValidDateIso } from "../shared/dateUtils";
import { ValidationError } from "../shared/httpErrors";
import { json, withErrorHandling } from "../shared/httpHelpers";
import { getSettings } from "../shared/tableClient";

app.http("getDay", {
  methods: ["GET"],
  authLevel: "anonymous",
  // "today" is handled here (not as a separate route) because Azure Functions
  // does not reliably prefer a literal "days/today" registration over this
  // templated one when both are registered - so there is only ever one route.
  route: "days/{date}",
  handler: withErrorHandling(async (request) => {
    const userId = requireAuth(request);
    const rawDate = request.params.date;
    const date = rawDate === "today" ? getTodayISO() : rawDate;
    if (!isValidDateIso(date)) throw new ValidationError("invalid date");

    const settings = await getSettings(userId);
    const day = await buildDayResponse(userId, date, settings);
    return json(200, day);
  }),
});
