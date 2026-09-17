export const CHALLENGE_BASE_DAYS = 75;

export const TASK_IDS = [
  "water",
  "workout",
  "reading",
  "diet",
  "meditate",
  "noAlcohol",
] as const;

export type TaskId = (typeof TASK_IDS)[number];

export const DEFAULT_TASK_LABELS: Record<TaskId, string> = {
  water: "Water drinken",
  workout: "Workout (45 min)",
  reading: "Lees 10 pagina's of luister 10 minuten selfhelp/podcast",
  diet: "Volg gezond dieet",
  meditate: "Mediteer 5 minuten",
  noAlcohol: "Geen alcohol",
};

export const DEFAULT_TASK_EMOJI: Record<TaskId, string> = {
  water: "\u{1F4A7}",
  workout: "\u{1F3CB}\u{FE0F}",
  reading: "\u{1F4D6}",
  diet: "\u{1F957}",
  meditate: "\u{1F9D8}",
  noAlcohol: "\u{1F6AB}",
};

export const DEFAULT_WEIGHT_KG = 75;
export const DEFAULT_CUP_SIZE_ML = 250;
export const WATER_ML_PER_KG = 33;

export const DAILY_LOGS_TABLE = "DailyLogs";
export const USER_SETTINGS_TABLE = "UserSettings";
