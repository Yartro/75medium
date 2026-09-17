import { motion } from "framer-motion";
import { TASK_ICON } from "../lib/tasks";
import type { DayLog } from "../api/types";
import { Flap } from "./Flap";

interface DietTaskItemProps {
  label: string;
  log: DayLog;
  cheatAvailable: boolean;
  onToggleDone: () => void;
  onUseCheat: () => void;
  disabled?: boolean;
}

export function DietTaskItem({ label, log, cheatAvailable, onToggleDone, onUseCheat, disabled }: DietTaskItemProps) {
  const checked = log.dietDone || log.dietCheatUsed;
  const Icon = TASK_ICON.diet;

  return (
    <div className={`flap-row${checked ? " done" : ""}`}>
      <span className="flap-row__icon">
        <Icon />
      </span>
      <span className="flap-row__body">
        <button
          type="button"
          onClick={onToggleDone}
          disabled={disabled || log.dietCheatUsed}
          style={{ all: "unset", cursor: "pointer", display: "block" }}
        >
          <span className="flap-row__label">{label}</span>
        </button>
        {log.dietCheatUsed ? (
          <div className="cheat-chip used">Cheat gebruikt deze week</div>
        ) : (
          <button type="button" className="cheat-chip" onClick={onUseCheat} disabled={disabled || !cheatAvailable}>
            {cheatAvailable ? "Gebruik wekelijkse cheat" : "Cheat al gebruikt deze week"}
          </button>
        )}
      </span>
      <Flap
        size="sm"
        state={checked ? "done" : "blank"}
        interactive
        onClick={onToggleDone}
        disabled={disabled || log.dietCheatUsed}
        ariaLabel="Gezond dieet gevolgd"
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
