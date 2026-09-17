import type { TaskId } from "./constants";

export interface DailyLogEntity {
  partitionKey: string; // userId
  rowKey: string; // date yyyy-MM-dd
  waterMl: number;
  workoutDone: boolean;
  // An extra 45min workout done THIS day, banking the requirement for the
  // immediately following day only (see isDayAchieved's previousLog param).
  workoutExtraDone: boolean;
  readingOrPodcastDone: boolean;
  dietDone: boolean;
  dietCheatUsed: boolean;
  meditateDone: boolean;
  noAlcoholDone: boolean;
  updatedAt: string;
  etag?: string;
}

export type DailyLogPatch = Partial<
  Pick<
    DailyLogEntity,
    | "workoutDone"
    | "workoutExtraDone"
    | "readingOrPodcastDone"
    | "dietDone"
    | "dietCheatUsed"
    | "meditateDone"
    | "noAlcoholDone"
  >
>;

export interface UserSettingsEntity {
  partitionKey: string; // userId
  rowKey: "settings";
  weightKg: number;
  waterGoalMlOverride: number | null;
  cupSizeMl: number;
  startDate: string;
  taskLabelsJson: string;
  updatedAt: string;
  etag?: string;
}

export interface Settings {
  weightKg: number;
  waterGoalMlOverride: number | null;
  cupSizeMl: number;
  startDate: string;
  taskLabels: Record<TaskId, string>;
}

export interface ChallengeStatus {
  status: "not_started" | "active" | "complete";
  totalRequiredDays: number;
  dayNumber: number | null;
  endDate: string;
  missedDaysCount: number;
  achievedDaysCount: number;
  todayAchieved: boolean;
}

export interface DayResponse {
  date: string;
  log: {
    waterMl: number;
    workoutDone: boolean;
    workoutExtraDone: boolean;
    readingOrPodcastDone: boolean;
    dietDone: boolean;
    dietCheatUsed: boolean;
    meditateDone: boolean;
    noAlcoholDone: boolean;
  };
  achieved: boolean;
  // True when yesterday's workoutExtraDone already satisfies today's workout,
  // regardless of today's own workoutDone value.
  workoutCoveredByYesterday: boolean;
  waterGoalMl: number;
  cheatAvailable: boolean;
  taskLabels: Record<TaskId, string>;
  isToday: boolean;
  isFuture: boolean;
  isBeforeStart: boolean;
  challenge: ChallengeStatus;
}

export interface RangeDaySummary {
  date: string;
  achieved: boolean;
  hasLog: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export interface TeamMemberSummary {
  userId: string;
  name: string;
  status: ChallengeStatus["status"];
  dayNumber: number | null;
  totalRequiredDays: number;
  achievedDaysCount: number;
  recentDays: { date: string; achieved: boolean; isToday: boolean }[];
}
