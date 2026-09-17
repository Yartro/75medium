import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function IconWater(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5c3 3.8 6 7.4 6 11a6 6 0 1 1-12 0c0-3.6 3-7.2 6-11Z" />
    </svg>
  );
}

export function IconWorkout(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 9v6M3.5 10.5v3M20.5 10.5v3M19 9v6" />
      <path d="M8 12h8" strokeWidth={2.75} />
      <rect x="6" y="10" width="2.4" height="4" rx="0.6" fill="currentColor" stroke="none" />
      <rect x="15.6" y="10" width="2.4" height="4" rx="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconReading(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5.5c-1.6-1.1-3.7-1.5-6-1.5v13.5c2.3 0 4.4.4 6 1.5 1.6-1.1 3.7-1.5 6-1.5V4c-2.3 0-4.4.4-6 1.5Z" />
      <path d="M12 5.5v13" />
    </svg>
  );
}

export function IconDiet(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4c-4.5 0-7.5 3.6-7.5 8 0 4.6 3.2 8 6 8 .7 0 1.1-.3 1.5-.6.4.3.8.6 1.5.6 2.8 0 6-3.4 6-8 0-1.7-.5-3.1-1.3-4.3" />
      <path d="M12 4c0-1 .6-2 1.8-2.4" />
    </svg>
  );
}

export function IconMeditate(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.25" />
      <circle cx="12" cy="12" r="2.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconNoAlcohol(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9.5 2.5h5l.8 4.2c1.3.9 2.2 2.5 2.2 4.3v7.3a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-7.3c0-1.8.9-3.4 2.2-4.3l.8-4.2Z" />
      <path d="M8.8 9.5h6.4" />
      <path d="M4.5 4.5l15 15" />
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v3.4M16 3v3.4" />
    </svg>
  );
}

export function IconLogout(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 4.5H7.5A1.5 1.5 0 0 0 6 6v12a1.5 1.5 0 0 0 1.5 1.5H14" />
      <path d="M11 12h9.5M17.5 8.5 21 12l-3.5 3.5" />
    </svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9.5 5.5 16 12l-6.5 6.5" />
    </svg>
  );
}

export function IconToday(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M8 12.5l2.5 2.5L16.5 9" />
    </svg>
  );
}

export function IconTeam(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8.5" r="2.75" />
      <circle cx="17" cy="9.5" r="2.1" />
      <path d="M3.5 19c.4-3 2.6-5 5.5-5s5.1 2 5.5 5" />
      <path d="M15.2 14.4c2 .3 3.5 2 3.8 4.6" />
    </svg>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.4M12 18.1v2.4M4.9 6.4l1.7 1.7M17.4 15.9l1.7 1.7M3.5 12h2.4M18.1 12h2.4M4.9 17.6l1.7-1.7M17.4 8.1l1.7-1.7" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5.5 12h13" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12.5 10 17l9-10" strokeWidth={2.5} />
    </svg>
  );
}
