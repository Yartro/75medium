import { CHALLENGE_BASE_DAYS } from "./constants";
import { addDays, diffDays } from "./dateUtils";
import type { ChallengeStatus, DailyLogEntity, Settings } from "./types";

export function resolveWaterGoalMl(settings: Settings): number {
  if (settings.waterGoalMlOverride != null) return settings.waterGoalMlOverride;
  return Math.round(settings.weightKg * 33);
}

export function isDayAchieved(
  log: DailyLogEntity | undefined,
  settings: Settings
): boolean {
  if (!log) return false;
  const waterGoal = resolveWaterGoalMl(settings);
  const dietOk = log.dietDone === true || log.dietCheatUsed === true;
  return (
    log.waterMl >= waterGoal &&
    log.workoutDone === true &&
    log.readingOrPodcastDone === true &&
    dietOk &&
    log.meditateDone === true &&
    log.noAlcoholDone === true
  );
}

/**
 * Every past day (startDate..yesterday) that was not fully achieved pushes the
 * required total length out by one day. Nothing here is stored as a counter -
 * it is recomputed fresh from logsByDate on every call, so retroactive edits
 * to past days are reflected immediately with no resync step.
 */
export function computeChallengeStatus(
  startDate: string,
  today: string,
  logsByDate: Map<string, DailyLogEntity>,
  settings: Settings
): ChallengeStatus {
  if (today < startDate) {
    return {
      status: "not_started",
      totalRequiredDays: CHALLENGE_BASE_DAYS,
      dayNumber: null,
      endDate: addDays(startDate, CHALLENGE_BASE_DAYS - 1),
      missedDaysCount: 0,
      achievedDaysCount: 0,
      todayAchieved: false,
    };
  }

  const yesterday = addDays(today, -1);
  let missedDaysCount = 0;
  let achievedDaysCount = 0;

  for (let d = startDate; d <= yesterday; d = addDays(d, 1)) {
    if (isDayAchieved(logsByDate.get(d), settings)) {
      achievedDaysCount++;
    } else {
      missedDaysCount++;
    }
  }

  const totalRequiredDays = CHALLENGE_BASE_DAYS + missedDaysCount;
  const endDate = addDays(startDate, totalRequiredDays - 1);
  const dayNumber = diffDays(today, startDate) + 1;
  const todayAchieved = isDayAchieved(logsByDate.get(today), settings);

  return {
    status: today > endDate ? "complete" : "active",
    totalRequiredDays,
    dayNumber,
    endDate,
    missedDaysCount,
    achievedDaysCount,
    todayAchieved,
  };
}

/**
 * Returns true if `date` is allowed to have its cheat flag set to true, i.e.
 * no OTHER day in the same ISO week (Mon-Sun) already has dietCheatUsed=true.
 */
export function isCheatAvailableForWeek(
  date: string,
  weekLogs: DailyLogEntity[]
): boolean {
  return !weekLogs.some((l) => l.rowKey !== date && l.dietCheatUsed === true);
}
