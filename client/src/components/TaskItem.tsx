import { motion } from "framer-motion";
import { TASK_ICON, type TaskId } from "../lib/tasks";
import { Flap } from "./Flap";

interface TaskItemProps {
  taskId: TaskId;
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  subLabel?: string;
}

export function TaskItem({ taskId, label, checked, onToggle, disabled, subLabel }: TaskItemProps) {
  const Icon = TASK_ICON[taskId];

  return (
    <button type="button" className={`flap-row${checked ? " done" : ""}`} onClick={onToggle} disabled={disabled}>
      <span className="flap-row__icon">
        <Icon />
      </span>
      <span className="flap-row__body">
        <span className="flap-row__label">{label}</span>
        {subLabel && <span className="flap-row__sub">{subLabel}</span>}
      </span>
      <Flap size="sm" state={checked ? "done" : "blank"}>
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
    </button>
  );
}
