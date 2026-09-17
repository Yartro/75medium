import type { DayResponse, DayLog } from "../api/types";
import { BOOLEAN_TASK_IDS } from "../lib/tasks";
import { DietTaskItem } from "./DietTaskItem";
import { TaskItem } from "./TaskItem";
import { WaterWidget } from "./WaterWidget";
import { WorkoutTaskItem } from "./WorkoutTaskItem";

interface DayTaskListProps {
  day: DayResponse;
  onTogglePatch: (patch: Partial<DayLog>) => void;
  onAddWater: (deltaMl: number) => void;
  disabled?: boolean;
}

export function DayTaskList({ day, onTogglePatch, onAddWater, disabled }: DayTaskListProps) {
  return (
    <div className="day-task-list">
      <WaterWidget
        label={day.taskLabels.water}
        waterMl={day.log.waterMl}
        waterGoalMl={day.waterGoalMl}
        onAddWater={onAddWater}
        disabled={disabled}
      />
      {BOOLEAN_TASK_IDS.map((taskId) => {
        if (taskId === "diet") {
          return (
            <DietTaskItem
              key={taskId}
              label={day.taskLabels.diet}
              log={day.log}
              cheatAvailable={day.cheatAvailable}
              onToggleDone={() => onTogglePatch({ dietDone: !day.log.dietDone })}
              onUseCheat={() => onTogglePatch({ dietCheatUsed: true })}
              disabled={disabled}
            />
          );
        }
        if (taskId === "workout") {
          return (
            <WorkoutTaskItem
              key={taskId}
              label={day.taskLabels.workout}
              log={day.log}
              coveredByYesterday={day.workoutCoveredByYesterday}
              onToggleDone={() => onTogglePatch({ workoutDone: !day.log.workoutDone })}
              onToggleExtra={() => onTogglePatch({ workoutExtraDone: !day.log.workoutExtraDone })}
              disabled={disabled}
            />
          );
        }
        const doneKey =
          taskId === "reading"
            ? "readingOrPodcastDone"
            : taskId === "meditate"
              ? "meditateDone"
              : "noAlcoholDone";
        const checked = day.log[doneKey as keyof DayLog] as boolean;
        return (
          <TaskItem
            key={taskId}
            taskId={taskId}
            label={day.taskLabels[taskId]}
            checked={checked}
            onToggle={() => onTogglePatch({ [doneKey]: !checked })}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
}
