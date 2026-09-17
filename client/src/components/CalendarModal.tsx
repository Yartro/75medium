import { useMemo, useState } from "react";
import { useAddWater, useDay, useDaysRange, usePutDay, useSettings } from "../api/queries";
import { formatLongDutch, getMonthGrid, monthLabel } from "../lib/dateUtils";
import { DayTaskList } from "./DayTaskList";
import { Flap, type FlapState } from "./Flap";
import { IconChevronLeft, IconChevronRight } from "./icons";

const WEEKDAY_HEADERS = ["ma", "di", "wo", "do", "vr", "za", "zo"];

interface CalendarModalProps {
  today: string;
  onClose: () => void;
}

function DayEditorSection({ date }: { date: string }) {
  const { data: day, isLoading } = useDay(date);
  const putDay = usePutDay(date);
  const addWater = useAddWater(date);

  if (isLoading || !day) {
    return <div className="day-editor__title">Laden...</div>;
  }

  return (
    <div className="day-editor">
      <div className="day-editor__title">{formatLongDutch(date)}</div>
      <DayTaskList
        day={day}
        onTogglePatch={(patch) => putDay.mutate(patch)}
        onAddWater={(delta) => addWater.mutate(delta)}
        disabled={putDay.isPending || addWater.isPending}
      />
    </div>
  );
}

export function CalendarModal({ today, onClose }: CalendarModalProps) {
  const todayDate = new Date(`${today}T12:00:00Z`);
  const [year, setYear] = useState(todayDate.getUTCFullYear());
  const [month0, setMonth0] = useState(todayDate.getUTCMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: settings } = useSettings();
  const grid = useMemo(() => getMonthGrid(year, month0), [year, month0]);
  const { data } = useDaysRange(grid[0].date, grid[grid.length - 1].date);
  const byDate = new Map((data?.days ?? []).map((d) => [d.date, d]));

  const startDate = settings?.startDate;

  function goMonth(delta: number) {
    const d = new Date(Date.UTC(year, month0 + delta, 1));
    setYear(d.getUTCFullYear());
    setMonth0(d.getUTCMonth());
    setSelectedDate(null);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-sheet__header">
          <button type="button" className="icon-button" onClick={() => goMonth(-1)} aria-label="Vorige maand">
            <IconChevronLeft />
          </button>
          <span className="modal-sheet__title">{monthLabel(year, month0)}</span>
          <button type="button" className="icon-button" onClick={() => goMonth(1)} aria-label="Volgende maand">
            <IconChevronRight />
          </button>
        </div>

        <div className="month-grid">
          {WEEKDAY_HEADERS.map((w) => (
            <div key={w} className="month-grid__weekday">
              {w}
            </div>
          ))}
          {grid.map((cell) => {
            const info = byDate.get(cell.date);
            const disabled = !cell.inMonth || (startDate ? cell.date < startDate : false);
            const isToday = cell.date === today;
            let state: FlapState = "blank";
            if (info?.isFuture) state = "future";
            else if (info?.achieved) state = "done";
            else if (cell.inMonth && startDate && cell.date >= startDate && cell.date < today) state = "missed";

            return (
              <Flap
                key={cell.date}
                size="grid"
                state={state}
                interactive
                disabled={disabled}
                onClick={() => setSelectedDate(cell.date)}
                className={[
                  "month-cell",
                  !cell.inMonth && "outside",
                  isToday && "flap--today",
                  disabled && "disabled",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {new Date(`${cell.date}T12:00:00Z`).getUTCDate()}
              </Flap>
            );
          })}
        </div>

        {selectedDate && <DayEditorSection date={selectedDate} />}
      </div>
    </div>
  );
}
