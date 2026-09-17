import { describe, expect, it } from "vitest";
import {
  computeChallengeStatus,
  isCheatAvailableForWeek,
  isDayAchieved,
  resolveWaterGoalMl,
} from "../src/shared/challengeMath";
import { addDays } from "../src/shared/dateUtils";
import type { DailyLogEntity, Settings } from "../src/shared/types";

const baseSettings: Settings = {
  weightKg: 80,
  waterGoalMlOverride: null,
  cupSizeMl: 250,
  startDate: "2026-01-01",
  taskLabels: {
    water: "Water",
    workout: "Workout",
    reading: "Reading",
    diet: "Diet",
    meditate: "Meditate",
    noAlcohol: "No alcohol",
  },
};

function achievedLog(date: string): DailyLogEntity {
  return {
    partitionKey: "u1",
    rowKey: date,
    waterMl: 2640, // 80kg * 33
    workoutDone: true,
    workoutExtraDone: false,
    readingOrPodcastDone: true,
    dietDone: true,
    dietCheatUsed: false,
    meditateDone: true,
    noAlcoholDone: true,
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

function missedLog(date: string): DailyLogEntity {
  return { ...achievedLog(date), workoutDone: false };
}

describe("resolveWaterGoalMl", () => {
  it("uses weight * 33 by default", () => {
    expect(resolveWaterGoalMl(baseSettings)).toBe(2640);
  });

  it("prefers an explicit override", () => {
    expect(resolveWaterGoalMl({ ...baseSettings, waterGoalMlOverride: 3000 })).toBe(3000);
  });
});

describe("isDayAchieved", () => {
  it("is false when there is no log", () => {
    expect(isDayAchieved(undefined, baseSettings)) .toBe(false);
  });

  it("is true only when every task including water goal is met", () => {
    expect(isDayAchieved(achievedLog("2026-01-05"), baseSettings)).toBe(true);
    expect(isDayAchieved(missedLog("2026-01-05"), baseSettings)).toBe(false);
  });

  it("treats a used weekly cheat as satisfying diet", () => {
    const log = { ...achievedLog("2026-01-05"), dietDone: false, dietCheatUsed: true };
    expect(isDayAchieved(log, baseSettings)).toBe(true);
  });

  it("requires water to reach the goal, not just be logged", () => {
    const log = { ...achievedLog("2026-01-05"), waterMl: 1000 };
    expect(isDayAchieved(log, baseSettings)).toBe(false);
  });

  it("lets an extra workout logged the day before cover today's workout", () => {
    const today = { ...achievedLog("2026-01-06"), workoutDone: false };
    const yesterday = { ...achievedLog("2026-01-05"), workoutExtraDone: true };
    expect(isDayAchieved(today, baseSettings, yesterday)).toBe(true);
  });

  it("still requires today's own workout when yesterday had no extra", () => {
    const today = { ...achievedLog("2026-01-06"), workoutDone: false };
    const yesterday = achievedLog("2026-01-05");
    expect(isDayAchieved(today, baseSettings, yesterday)).toBe(false);
  });
});

describe("computeChallengeStatus", () => {
  it("returns not_started when start date is in the future", () => {
    const startDate = "2026-06-01";
    const today = "2026-05-01";
    const status = computeChallengeStatus(startDate, today, new Map(), baseSettings);
    expect(status.status).toBe("not_started");
    expect(status.dayNumber).toBeNull();
    expect(status.totalRequiredDays).toBe(75);
    expect(status.endDate).toBe(addDays(startDate, 74));
  });

  it("is day 1 of 75 when start date is today, with no missed days yet", () => {
    const startDate = "2026-01-01";
    const status = computeChallengeStatus(startDate, startDate, new Map(), baseSettings);
    expect(status.dayNumber).toBe(1);
    expect(status.totalRequiredDays).toBe(75);
    expect(status.missedDaysCount).toBe(0);
    expect(status.status).toBe("active");
  });

  it("does not extend the total when every past day was achieved", () => {
    const startDate = "2026-01-01";
    const today = "2026-01-11"; // 10 full past days
    const logs = new Map<string, DailyLogEntity>();
    for (let d = startDate; d < today; d = addDays(d, 1)) {
      logs.set(d, achievedLog(d));
    }
    const status = computeChallengeStatus(startDate, today, logs, baseSettings);
    expect(status.missedDaysCount).toBe(0);
    expect(status.achievedDaysCount).toBe(10);
    expect(status.totalRequiredDays).toBe(75);
    expect(status.dayNumber).toBe(11);
  });

  it("extends the total end date by one day per missed past day", () => {
    const startDate = "2026-01-01";
    const today = "2026-01-11";
    const logs = new Map<string, DailyLogEntity>();
    for (let d = startDate; d < today; d = addDays(d, 1)) {
      logs.set(d, achievedLog(d));
    }
    // Fail two of the past days.
    logs.set("2026-01-03", missedLog("2026-01-03"));
    logs.set("2026-01-07", missedLog("2026-01-07"));

    const status = computeChallengeStatus(startDate, today, logs, baseSettings);
    expect(status.missedDaysCount).toBe(2);
    expect(status.achievedDaysCount).toBe(8);
    expect(status.totalRequiredDays).toBe(77);
    expect(status.endDate).toBe(addDays(startDate, 76));
  });

  it("never lets editing today change totalRequiredDays", () => {
    const startDate = "2026-01-01";
    const today = "2026-01-11";
    const logs = new Map<string, DailyLogEntity>();
    for (let d = startDate; d < today; d = addDays(d, 1)) logs.set(d, achievedLog(d));

    const withTodayMissed = new Map(logs);
    withTodayMissed.set(today, missedLog(today));
    const withTodayAchieved = new Map(logs);
    withTodayAchieved.set(today, achievedLog(today));

    const statusA = computeChallengeStatus(startDate, today, withTodayMissed, baseSettings);
    const statusB = computeChallengeStatus(startDate, today, withTodayAchieved, baseSettings);
    expect(statusA.totalRequiredDays).toBe(statusB.totalRequiredDays);
    expect(statusA.todayAchieved).toBe(false);
    expect(statusB.todayAchieved).toBe(true);
  });

  it("immediately reflects a retroactive edit to a past day on the next compute", () => {
    const startDate = "2026-01-01";
    const today = "2026-01-11";
    const logs = new Map<string, DailyLogEntity>();
    for (let d = startDate; d < today; d = addDays(d, 1)) logs.set(d, missedLog(d));

    const before = computeChallengeStatus(startDate, today, logs, baseSettings);
    expect(before.missedDaysCount).toBe(10);
    expect(before.totalRequiredDays).toBe(85);

    // Backfill/correct one historical day to "achieved".
    logs.set("2026-01-05", achievedLog("2026-01-05"));
    const after = computeChallengeStatus(startDate, today, logs, baseSettings);
    expect(after.missedDaysCount).toBe(9);
    expect(after.totalRequiredDays).toBe(84);
  });

  it("does not count a day as missed when yesterday's extra workout covers it", () => {
    const startDate = "2026-01-01";
    const today = "2026-01-11";
    const logs = new Map<string, DailyLogEntity>();
    for (let d = startDate; d < today; d = addDays(d, 1)) logs.set(d, achievedLog(d));

    // 2026-01-05 skips its own workout but banked an extra the day before.
    logs.set("2026-01-04", { ...achievedLog("2026-01-04"), workoutExtraDone: true });
    logs.set("2026-01-05", { ...achievedLog("2026-01-05"), workoutDone: false });

    const status = computeChallengeStatus(startDate, today, logs, baseSettings);
    expect(status.missedDaysCount).toBe(0);
    expect(status.achievedDaysCount).toBe(10);
  });

  it("does not let a banked extra reach past the very next day", () => {
    const startDate = "2026-01-01";
    const today = "2026-01-11";
    const logs = new Map<string, DailyLogEntity>();
    for (let d = startDate; d < today; d = addDays(d, 1)) logs.set(d, achievedLog(d));

    // Banked on 01-04, but 01-05 does its own workout; 01-06 skips relying on
    // the (already two days stale) bank, which must not cover it.
    logs.set("2026-01-04", { ...achievedLog("2026-01-04"), workoutExtraDone: true });
    logs.set("2026-01-06", { ...achievedLog("2026-01-06"), workoutDone: false });

    const status = computeChallengeStatus(startDate, today, logs, baseSettings);
    expect(status.missedDaysCount).toBe(1);
    expect(status.achievedDaysCount).toBe(9);
  });

  it("flips to complete once today is past the (possibly extended) end date", () => {
    const startDate = "2026-01-01";
    // 75 achieved days -> endDate = startDate + 74 = 2026-03-16
    const logs = new Map<string, DailyLogEntity>();
    let d = startDate;
    for (let i = 0; i < 75; i++, d = addDays(d, 1)) logs.set(d, achievedLog(d));

    const endDate = addDays(startDate, 74);
    const dayAfterEnd = addDays(endDate, 1);
    const status = computeChallengeStatus(startDate, dayAfterEnd, logs, baseSettings);
    expect(status.endDate).toBe(endDate);
    expect(status.status).toBe("complete");
  });
});

describe("isCheatAvailableForWeek", () => {
  it("is available when no day in the week used the cheat", () => {
    expect(isCheatAvailableForWeek("2026-01-07", [])).toBe(true);
  });

  it("is unavailable when a different day in the week already used it", () => {
    const weekLogs = [{ ...achievedLog("2026-01-05"), dietCheatUsed: true }];
    expect(isCheatAvailableForWeek("2026-01-07", weekLogs)).toBe(false);
  });

  it("is still available for the same day re-confirming its own cheat", () => {
    const weekLogs = [{ ...achievedLog("2026-01-07"), dietCheatUsed: true }];
    expect(isCheatAvailableForWeek("2026-01-07", weekLogs)).toBe(true);
  });
});
