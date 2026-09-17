import type { ReactNode } from "react";

export type FlapState = "blank" | "done" | "partial" | "missed" | "today" | "future";

interface FlapProps {
  state?: FlapState;
  size?: "xs" | "sm" | "md" | "lg" | "grid";
  interactive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
  title?: string;
}

export function Flap({
  state = "blank",
  size = "md",
  interactive,
  onClick,
  disabled,
  className,
  children,
  ariaLabel,
  title,
}: FlapProps) {
  const classes = ["flap", `flap--${size}`, `flap--${state}`, className].filter(Boolean).join(" ");

  if (interactive) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        title={title}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={classes} title={title}>
      {children}
    </div>
  );
}

interface FlapDigitBankProps {
  value: number;
  minDigits?: number;
  size?: "md" | "lg" | "xl";
}

export function FlapDigitBank({ value, minDigits = 1, size = "lg" }: FlapDigitBankProps) {
  const str = String(Math.max(0, Math.trunc(value))).padStart(minDigits, "0");
  return (
    <div className={`flap-digit-bank flap-digit-bank--${size}`}>
      {str.split("").map((ch, i) => (
        <span key={i} className="flap flap--digit">
          {ch}
        </span>
      ))}
    </div>
  );
}
