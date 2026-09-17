import { computeChallengeStatus, isCheatAvailableForWeek, isDayAchieved, resolveWaterGoalMl } from "./challengeMath";
import { addDays, getTodayISO, startOfIsoWeek } from "./dateUtils";
import { getLogsMapInRange } from "./tableClient";
import type { DayResponse, Settings } from "./types";

export async function buildDayResponse(userId: string, date: string, settings: Settings): Promise<DayResponse> {
  const today = getTodayISO();
  const weekStart = startOfIsoWeek(date);
  const weekEnd = addDays(weekStart, 6);

  // One range query covers the challenge-status window (startDate..today),
  // this date's own ISO week (needed for cheat-day availability), and the
  // day right before `date` (needed to check a banked workout extra).
  const dayBefore = addDays(date, -1);
  let rangeFrom = settings.startDate < weekStart ? settings.startDate : weekStart;
  if (dayBefore < rangeFrom) rangeFrom = dayBefore;
  const rangeTo = today > weekEnd ? today : weekEnd;
  const logsByDate = await getLogsMapInRange(userId, rangeFrom, rangeTo);

  const challenge = computeChallengeStatus(settings.startDate, today, logsByDate, settings);
  const log = logsByDate.get(date);
  const previousLog = logsByDate.get(dayBefore);
  const weekLogs = Array.from(logsByDate.values()).filter((l) => l.rowKey >= weekStart && l.rowKey <= weekEnd);

  return {
    date,
    log: {
      waterMl: log?.waterMl ?? 0,
      workoutDone: log?.workoutDone ?? false,
      workoutExtraDone: log?.workoutExtraDone ?? false,
      readingOrPodcastDone: log?.readingOrPodcastDone ?? false,
      dietDone: log?.dietDone ?? false,
      dietCheatUsed: log?.dietCheatUsed ?? false,
      meditateDone: log?.meditateDone ?? false,
      noAlcoholDone: log?.noAlcoholDone ?? false,
    },
    achieved: isDayAchieved(log, settings, previousLog),
    workoutCoveredByYesterday: previousLog?.workoutExtraDone === true,
    waterGoalMl: resolveWaterGoalMl(settings),
    cheatAvailable: isCheatAvailableForWeek(date, weekLogs),
    taskLabels: settings.taskLabels,
    isToday: date === today,
    isFuture: date > today,
    isBeforeStart: date < settings.startDate,
    challenge,
  };
}
