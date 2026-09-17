import {
  IconDiet,
  IconMeditate,
  IconNoAlcohol,
  IconReading,
  IconWater,
  IconWorkout,
} from "../components/icons";

export const TASK_IDS = ["water", "workout", "reading", "diet", "meditate", "noAlcohol"] as const;

export type TaskId = (typeof TASK_IDS)[number];

export const DEFAULT_TASK_LABELS: Record<TaskId, string> = {
  water: "Water drinken",
  workout: "Workout (45 min)",
  reading: "Lees 10 pagina's of luister 10 minuten selfhelp/podcast",
  diet: "Volg gezond dieet",
  meditate: "Mediteer 5 minuten",
  noAlcohol: "Geen alcohol",
};

export const TASK_ICON: Record<TaskId, typeof IconWater> = {
  water: IconWater,
  workout: IconWorkout,
  reading: IconReading,
  diet: IconDiet,
  meditate: IconMeditate,
  noAlcohol: IconNoAlcohol,
};

export const BOOLEAN_TASK_IDS = TASK_IDS.filter((t) => t !== "water") as Exclude<TaskId, "water">[];
