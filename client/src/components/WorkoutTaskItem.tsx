import { motion } from "framer-motion";
import { TASK_ICON } from "../lib/tasks";
import type { DayLog } from "../api/types";
import { Flap } from "./Flap";

interface WorkoutTaskItemProps {
  label: string;
  log: DayLog;
  coveredByYesterday: boolean;
  onToggleDone: () => void;
  onToggleExtra: () => void;
  disabled?: boolean;
}

export function WorkoutTaskItem({
  label,
  log,
  coveredByYesterday,
  onToggleDone,
  onToggleExtra,
  disabled,
}: WorkoutTaskItemProps) {
  const checked = log.workoutDone || coveredByYesterday;
  const Icon = TASK_ICON.workout;

  return (
    <div className={`flap-row${checked ? " done" : ""}`}>
      <span className="flap-row__icon">
        <Icon />
      </span>
      <span className="flap-row__body">
        <button
          type="button"
          onClick={onToggleDone}
          disabled={disabled || coveredByYesterday}
          style={{ all: "unset", cursor: "pointer", display: "block" }}
        >
          <span className="flap-row__label">{label}</span>
        </button>
        {coveredByYesterday && <span className="flap-row__sub">Extra van gisteren</span>}
        <button
          type="button"
          className={`cheat-chip${log.workoutExtraDone ? " used" : ""}`}
          onClick={onToggleExtra}
          disabled={disabled}
        >
          +45 min
        </button>
      </span>
      <Flap
        size="sm"
        state={checked ? "done" : "blank"}
        interactive
        onClick={onToggleDone}
        disabled={disabled || coveredByYesterday}
        ariaLabel="Workout gedaan"
      >
        {checked && (
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ rotateX: -100, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 480, damping: 16 }}
            style={{ transformOrigin: "top", width: "60%", height: "60%" }}
          >
            <path d="M5 12.5 10 17l9-10" />
          </motion.svg>
        )}
      </Flap>
    </div>
  );
}
