import { motion } from "framer-motion";
import { useSettings } from "../api/queries";
import { Flap } from "./Flap";
import { IconMinus, IconPlus, IconWater } from "./icons";

interface WaterWidgetProps {
  label: string;
  waterMl: number;
  waterGoalMl: number;
  onAddWater: (deltaMl: number) => void;
  disabled?: boolean;
}

export function WaterWidget({ label, waterMl, waterGoalMl, onAddWater, disabled }: WaterWidgetProps) {
  const { data: settings } = useSettings();
  const cupSizeMl = settings?.cupSizeMl ?? 250;
  const done = waterMl >= waterGoalMl;

  const segmentCount = Math.max(4, Math.ceil(waterGoalMl / cupSizeMl) || 4);
  const filledFull = done ? segmentCount : Math.min(segmentCount, Math.floor(waterMl / cupSizeMl));
  const partialPct = done ? 0 : Math.min(1, Math.max(0, (waterMl % cupSizeMl) / cupSizeMl)) * 100;
  const fillColor = done ? "var(--green)" : "var(--amber)";

  function toggleComplete() {
    onAddWater(done ? -waterMl : waterGoalMl - waterMl);
  }

  return (
    <div className={`flap-row${done ? " done" : ""}`} style={{ flexDirection: "column", alignItems: "stretch" }}>
      <div className="water-widget__top">
        <span className="flap-row__icon">
          <IconWater />
        </span>
        <span className="water-widget__title">{label}</span>
        <span className="water-widget__amount">
          {waterMl} / {waterGoalMl} ml
        </span>
        <Flap
          size="sm"
          state={done ? "done" : "blank"}
          interactive
          onClick={toggleComplete}
          disabled={disabled}
          ariaLabel={done ? "Water resetten" : "Water in één keer afronden"}
          title={done ? "Water resetten" : "In één keer afronden"}
        >
          {done && (
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

      <div className="flap-meter">
        {Array.from({ length: segmentCount }, (_, i) => {
          if (i < filledFull) {
            return <div key={i} className="flap-meter__seg flap-meter__seg--full" style={{ background: fillColor }} />;
          }
          if (i === filledFull && partialPct > 0) {
            return (
              <div key={i} className="flap-meter__seg">
                <div
                  className="flap-meter__seg-fill"
                  style={{ "--fill": `${partialPct}%`, background: fillColor } as React.CSSProperties}
                />
              </div>
            );
          }
          return <div key={i} className="flap-meter__seg" />;
        })}
      </div>

      <div className="water-widget__actions">
        <button type="button" className="chip-btn primary" onClick={() => onAddWater(cupSizeMl)} disabled={disabled}>
          <IconPlus /> Beker ({cupSizeMl}ml)
        </button>
        <button type="button" className="chip-btn" onClick={() => onAddWater(250)} disabled={disabled}>
          <IconPlus /> 250ml
        </button>
        <button
          type="button"
          className="chip-btn ghost"
          onClick={() => onAddWater(-250)}
          disabled={disabled || waterMl <= 0}
        >
          <IconMinus /> 250ml
        </button>
      </div>
    </div>
  );
}
