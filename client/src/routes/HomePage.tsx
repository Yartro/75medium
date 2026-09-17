import { useState } from "react";
import { useAddWater, usePutDay, useToday } from "../api/queries";
import { CalendarModal } from "../components/CalendarModal";
import { ConfettiCelebration } from "../components/ConfettiCelebration";
import { DayTaskList } from "../components/DayTaskList";
import { FlapDigitBank } from "../components/Flap";
import { WeekStrip } from "../components/WeekStrip";
import { formatLongDutch } from "../lib/dateUtils";

export function HomePage() {
  const { data: day, isLoading, isError } = useToday();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const putDay = usePutDay(day?.date ?? "today");
  const addWater = useAddWater(day?.date ?? "today");

  if (isLoading) return <div className="center-status">Laden...</div>;
  if (isError || !day) return <div className="center-status">Kon vandaag niet laden.</div>;

  const hasAnyProgress =
    day.log.waterMl > 0 ||
    day.log.workoutDone ||
    day.log.readingOrPodcastDone ||
    day.log.dietDone ||
    day.log.dietCheatUsed ||
    day.log.meditateDone ||
    day.log.noAlcoholDone;
  const dayStatus = day.achieved ? "done" : hasAnyProgress ? "partial" : "pending";

  return (
    <div className="page">
      <ConfettiCelebration achieved={day.achieved} />

      <div className="day-hero steel-plate">
        <p className="day-hero__date">{formatLongDutch(day.date)}</p>

        {day.challenge.status === "active" && (
          <>
            <div className="day-hero__count">
              <span className="day-hero__word">Dag</span>
              <FlapDigitBank value={day.challenge.dayNumber ?? 0} minDigits={2} size="xl" />
              <span className="day-hero__word">van</span>
              <FlapDigitBank value={day.challenge.totalRequiredDays} minDigits={2} size="lg" />
            </div>
            {day.challenge.missedDaysCount > 0 && (
              <p className="day-hero__sub">
                +{day.challenge.missedDaysCount} dag{day.challenge.missedDaysCount === 1 ? "" : "en"} extra door
                gemiste dagen
              </p>
            )}
          </>
        )}
        {day.challenge.status === "not_started" && (
          <p className="day-hero__word" style={{ fontSize: 16 }}>
            Challenge start binnenkort
          </p>
        )}
        {day.challenge.status === "complete" && (
          <p className="day-hero__word" style={{ fontSize: 16 }}>
            Challenge afgerond!
          </p>
        )}

        <span className={`day-hero__status ${dayStatus}`}>
          <span className="day-hero__status-dot" />
          {day.achieved ? "Vandaag gehaald" : "Nog bezig vandaag"}
        </span>
      </div>

      <section>
        <p className="section-title">Taken van vandaag</p>
        <DayTaskList
          day={day}
          onTogglePatch={(patch) => putDay.mutate(patch)}
          onAddWater={(delta) => addWater.mutate(delta)}
          disabled={putDay.isPending || addWater.isPending}
        />
      </section>

      <WeekStrip today={day.date} challenge={day.challenge} onOpenCalendar={() => setCalendarOpen(true)} />

      {calendarOpen && <CalendarModal today={day.date} onClose={() => setCalendarOpen(false)} />}
    </div>
  );
}
