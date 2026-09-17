import { app } from "@azure/functions";
import { requireAuth } from "../shared/auth";
import { computeChallengeStatus, isDayAchieved } from "../shared/challengeMath";
import { addDays, getTodayISO, isValidDateIso } from "../shared/dateUtils";
import { ValidationError } from "../shared/httpErrors";
import { json, withErrorHandling } from "../shared/httpHelpers";
import { getLogsMapInRange, getSettings } from "../shared/tableClient";
import type { RangeDaySummary } from "../shared/types";

app.http("getDaysRange", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "days",
  handler: withErrorHandling(async (request) => {
    const userId = requireAuth(request);
    const from = request.query.get("from");
    const to = request.query.get("to");
    if (!from || !to || !isValidDateIso(from) || !isValidDateIso(to)) {
      throw new ValidationError("from and to query params (yyyy-MM-dd) are required");
    }
    if (from > to) throw new ValidationError("from must be <= to");

    const settings = await getSettings(userId);
    const today = getTodayISO();
    const challengeFrom = settings.startDate < from ? settings.startDate : from;
    const rangeTo = to > today ? to : today;
    const logsByDate = await getLogsMapInRange(userId, challengeFrom, rangeTo);

    const challenge = computeChallengeStatus(settings.startDate, today, logsByDate, settings);

    const days: RangeDaySummary[] = [];
    for (let d = from; d <= to; d = addDays(d, 1)) {
      days.push({
        date: d,
        achieved: isDayAchieved(logsByDate.get(d), settings),
        hasLog: logsByDate.has(d),
        isToday: d === today,
        isFuture: d > today,
      });
    }

    return json(200, { days, challenge });
  }),
});
