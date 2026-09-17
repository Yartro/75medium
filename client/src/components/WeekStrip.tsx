import { useDaysRange } from "../api/queries";
import type { ChallengeStatus } from "../api/types";
import { dayOfMonth, getWorkWeekDates, weekdayShort } from "../lib/dateUtils";
import { Flap, type FlapState } from "./Flap";
import { IconCalendar } from "./icons";

interface WeekStripProps {
  today: string;
  challenge: ChallengeStatus;
  onOpenCalendar: () => void;
}

export function WeekStrip({ today, challenge, onOpenCalendar }: WeekStripProps) {
  const weekDates = getWorkWeekDates(today);
  const { data } = useDaysRange(weekDates[0], weekDates[weekDates.length - 1]);
  const byDate = new Map((data?.days ?? []).map((d) => [d.date, d]));

  return (
    <section className="card week-strip">
      <div className="week-strip__header">
        <span className="section-title" style={{ margin: 0 }}>
          Deze week
        </span>
        <button type="button" className="chip-btn" onClick={onOpenCalendar}>
          <IconCalendar /> Kalender
        </button>
      </div>

      <div className="week-strip__days">
        {weekDates.map((date) => {
          const info = byDate.get(date);
          const isToday = date === today;
          const state: FlapState = info?.isFuture ? "future" : info?.achieved ? "done" : isToday ? "blank" : "missed";
          return (
            <div key={date} className="day-chip">
              <span className="day-chip__weekday">{weekdayShort(date)}</span>
              <Flap size="sm" state={state} className={isToday ? "flap--today" : undefined}>
                {dayOfMonth(date)}
              </Flap>
            </div>
          );
        })}
      </div>

      <p className="week-strip__caption">
        {challenge.status === "not_started" && "De challenge is nog niet gestart."}
        {challenge.status === "active" && (
          <>
            Dag <strong>{challenge.dayNumber}</strong> van <strong>{challenge.totalRequiredDays}</strong>
            {challenge.missedDaysCount > 0 &&
              ` · +${challenge.missedDaysCount} dag${challenge.missedDaysCount === 1 ? "" : "en"} extra door gemiste dagen`}
          </>
        )}
        {challenge.status === "complete" && "Challenge afgerond!"}
      </p>
    </section>
  );
}
