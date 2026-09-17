import { app } from "@azure/functions";
import { requireAuth } from "../shared/auth";
import { computeChallengeStatus, isDayAchieved } from "../shared/challengeMath";
import { addDays, getTodayISO } from "../shared/dateUtils";
import { json, withErrorHandling } from "../shared/httpHelpers";
import { getLogsMapInRange, getSettings } from "../shared/tableClient";
import { USERS } from "../shared/users";
import type { TeamMemberSummary } from "../shared/types";

const RECENT_DAYS_COUNT = 7;

app.http("getTeam", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "team",
  handler: withErrorHandling(async (request) => {
    requireAuth(request); // any logged-in team member may view the team overview
    const today = getTodayISO();
    const recentStart = addDays(today, -(RECENT_DAYS_COUNT - 1));

    const members: TeamMemberSummary[] = await Promise.all(
      USERS.map(async (user) => {
        const settings = await getSettings(user.id);
        const from = settings.startDate < recentStart ? settings.startDate : recentStart;
        const logsByDate = await getLogsMapInRange(user.id, from, today);
        const challenge = computeChallengeStatus(settings.startDate, today, logsByDate, settings);

        const recentDays: { date: string; achieved: boolean; isToday: boolean }[] = [];
        for (let d = recentStart; d <= today; d = addDays(d, 1)) {
          if (d < settings.startDate) continue;
          recentDays.push({ date: d, achieved: isDayAchieved(logsByDate.get(d), settings), isToday: d === today });
        }

        return {
          userId: user.id,
          name: user.name,
          status: challenge.status,
          dayNumber: challenge.dayNumber,
          totalRequiredDays: challenge.totalRequiredDays,
          achievedDaysCount: challenge.achievedDaysCount,
          recentDays,
        };
      })
    );

    return json(200, { members });
  }),
});
