import { useEffect, useState } from "react";
import { usePutSettings, useSettings } from "../api/queries";
import { IconCheck } from "../components/icons";
import { DEFAULT_TASK_LABELS, TASK_IDS, type TaskId } from "../lib/tasks";

export function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const putSettings = usePutSettings();

  const [weightKg, setWeightKg] = useState("");
  const [waterOverride, setWaterOverride] = useState("");
  const [cupSizeMl, setCupSizeMl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [labels, setLabels] = useState<Record<TaskId, string>>(DEFAULT_TASK_LABELS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setWeightKg(String(settings.weightKg));
    setWaterOverride(settings.waterGoalMlOverride != null ? String(settings.waterGoalMlOverride) : "");
    setCupSizeMl(String(settings.cupSizeMl));
    setStartDate(settings.startDate);
    setLabels(settings.taskLabels);
  }, [settings]);

  if (isLoading || !settings) return <div className="center-status">Laden...</div>;

  function handleSave() {
    putSettings.mutate(
      {
        weightKg: Number(weightKg),
        waterGoalMlOverride: waterOverride.trim() ? Number(waterOverride) : null,
        cupSizeMl: Number(cupSizeMl),
        startDate,
        taskLabels: labels,
      },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        },
      }
    );
  }

  const computedGoal = Math.round(Number(weightKg || 0) * 33);

  return (
    <div className="page">
      <section className="card">
        <p className="section-title">Challenge</p>
        <div className="field">
          <label htmlFor="startDate">Startdatum</label>
          <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span className="field__hint">Mag in het verleden liggen — de challenge is al begonnen.</span>
        </div>
      </section>

      <section className="card">
        <p className="section-title">Water</p>
        <div className="field">
          <label htmlFor="weight">Gewicht (kg)</label>
          <input
            id="weight"
            type="number"
            min={1}
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
          <span className="field__hint">Standaard doel: gewicht × 33ml = {computedGoal}ml per dag.</span>
        </div>
        <div className="field">
          <label htmlFor="waterOverride">Eigen waterdoel (ml, optioneel)</label>
          <input
            id="waterOverride"
            type="number"
            min={1}
            placeholder="laat leeg voor standaard"
            value={waterOverride}
            onChange={(e) => setWaterOverride(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="cupSize">Bekergrootte (ml)</label>
          <input
            id="cupSize"
            type="number"
            min={1}
            value={cupSizeMl}
            onChange={(e) => setCupSizeMl(e.target.value)}
          />
        </div>
      </section>

      <section className="card">
        <p className="section-title">Tekst van je taken aanpassen</p>
        {TASK_IDS.map((taskId) => (
          <div className="field" key={taskId}>
            <label htmlFor={`label-${taskId}`}>{DEFAULT_TASK_LABELS[taskId]}</label>
            <textarea
              id={`label-${taskId}`}
              value={labels[taskId]}
              onChange={(e) => setLabels((prev) => ({ ...prev, [taskId]: e.target.value }))}
            />
          </div>
        ))}
      </section>

      <button type="button" className="btn primary block" onClick={handleSave} disabled={putSettings.isPending}>
        {putSettings.isPending ? "Opslaan..." : "Opslaan"}
      </button>
      {saved && (
        <span className="save-toast">
          <IconCheck /> Opgeslagen
        </span>
      )}
    </div>
  );
}
