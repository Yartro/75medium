import type { TaskId } from "../lib/tasks";

export interface ChallengeStatus {
  status: "not_started" | "active" | "complete";
  totalRequiredDays: number;
  dayNumber: number | null;
  endDate: string;
  missedDaysCount: number;
  achievedDaysCount: number;
  todayAchieved: boolean;
}

export interface DayLog {
  waterMl: number;
  workoutDone: boolean;
  readingOrPodcastDone: boolean;
  dietDone: boolean;
  dietCheatUsed: boolean;
  meditateDone: boolean;
  noAlcoholDone: boolean;
}

export interface DayResponse {
  date: string;
  log: DayLog;
  achieved: boolean;
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

export interface DaysRangeResponse {
  days: RangeDaySummary[];
  challenge: ChallengeStatus;
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

export interface TeamResponse {
  members: TeamMemberSummary[];
}

export interface Settings {
  weightKg: number;
  waterGoalMlOverride: number | null;
  cupSizeMl: number;
  startDate: string;
  taskLabels: Record<TaskId, string>;
}

export interface LoginResponse {
  token: string;
  userId: string;
  name: string;
}
