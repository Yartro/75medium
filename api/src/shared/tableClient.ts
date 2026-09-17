import { TableClient, odata, RestError } from "@azure/data-tables";
import {
  DAILY_LOGS_TABLE,
  USER_SETTINGS_TABLE,
  DEFAULT_WEIGHT_KG,
  DEFAULT_CUP_SIZE_ML,
  DEFAULT_TASK_LABELS,
} from "./constants";
import type { TaskId } from "./constants";
import { getTodayISO } from "./dateUtils";
import type { DailyLogEntity, DailyLogPatch, Settings } from "./types";

function getConnectionString(): string {
  const cs = process.env.TABLES_CONNECTION_STRING ?? process.env.AzureWebJobsStorage;
  if (!cs) throw new Error("TABLES_CONNECTION_STRING is not configured");
  return cs;
}

let dailyLogsClient: TableClient | undefined;
let userSettingsClient: TableClient | undefined;
let ensured = false;

export function getDailyLogsClient(): TableClient {
  if (!dailyLogsClient) {
    dailyLogsClient = TableClient.fromConnectionString(getConnectionString(), DAILY_LOGS_TABLE, {
      allowInsecureConnection: true,
    });
  }
  return dailyLogsClient;
}

export function getUserSettingsClient(): TableClient {
  if (!userSettingsClient) {
    userSettingsClient = TableClient.fromConnectionString(getConnectionString(), USER_SETTINGS_TABLE, {
      allowInsecureConnection: true,
    });
  }
  return userSettingsClient;
}

async function createTableIfNotExists(client: TableClient): Promise<void> {
  try {
    await client.createTable();
  } catch (err) {
    if (err instanceof RestError && err.statusCode === 409) return;
    throw err;
  }
}

export async function ensureTables(): Promise<void> {
  if (ensured) return;
  await Promise.all([
    createTableIfNotExists(getDailyLogsClient()),
    createTableIfNotExists(getUserSettingsClient()),
  ]);
  ensured = true;
}

function mapLogEntity(entity: Record<string, unknown>): DailyLogEntity {
  return {
    partitionKey: String(entity.partitionKey),
    rowKey: String(entity.rowKey),
    waterMl: (entity.waterMl as number) ?? 0,
    workoutDone: (entity.workoutDone as boolean) ?? false,
    readingOrPodcastDone: (entity.readingOrPodcastDone as boolean) ?? false,
    dietDone: (entity.dietDone as boolean) ?? false,
    dietCheatUsed: (entity.dietCheatUsed as boolean) ?? false,
    meditateDone: (entity.meditateDone as boolean) ?? false,
    noAlcoholDone: (entity.noAlcoholDone as boolean) ?? false,
    updatedAt: (entity.updatedAt as string) ?? new Date().toISOString(),
    etag: entity.etag as string | undefined,
  };
}

export async function getDailyLog(userId: string, date: string): Promise<DailyLogEntity | undefined> {
  try {
    const entity = await getDailyLogsClient().getEntity(userId, date);
    return mapLogEntity(entity);
  } catch (err) {
    if (err instanceof RestError && err.statusCode === 404) return undefined;
    throw err;
  }
}

export async function getLogsInRange(userId: string, from: string, to: string): Promise<DailyLogEntity[]> {
  const client = getDailyLogsClient();
  const results: DailyLogEntity[] = [];
  const iter = client.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${userId} and RowKey ge ${from} and RowKey le ${to}` },
  });
  for await (const entity of iter) {
    results.push(mapLogEntity(entity));
  }
  return results;
}

export async function getLogsMapInRange(
  userId: string,
  from: string,
  to: string
): Promise<Map<string, DailyLogEntity>> {
  const logs = await getLogsInRange(userId, from, to);
  return new Map(logs.map((l) => [l.rowKey, l]));
}

function defaultLog(userId: string, date: string): Omit<DailyLogEntity, "etag"> {
  return {
    partitionKey: userId,
    rowKey: date,
    waterMl: 0,
    workoutDone: false,
    readingOrPodcastDone: false,
    dietDone: false,
    dietCheatUsed: false,
    meditateDone: false,
    noAlcoholDone: false,
    updatedAt: new Date().toISOString(),
  };
}

export async function upsertDailyLogPatch(
  userId: string,
  date: string,
  patch: DailyLogPatch
): Promise<DailyLogEntity> {
  const existing = await getDailyLog(userId, date);
  const merged = {
    ...(existing ?? defaultLog(userId, date)),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  delete (merged as { etag?: string }).etag;
  await getDailyLogsClient().upsertEntity(merged, "Merge");
  return merged as DailyLogEntity;
}

export async function addWaterMl(userId: string, date: string, deltaMl: number): Promise<DailyLogEntity> {
  const client = getDailyLogsClient();
  for (let attempt = 0; attempt < 2; attempt++) {
    const existing = await getDailyLog(userId, date);
    const base = existing ?? defaultLog(userId, date);
    const merged = {
      ...base,
      waterMl: Math.max(0, base.waterMl + deltaMl),
      updatedAt: new Date().toISOString(),
    };
    delete (merged as { etag?: string }).etag;
    try {
      if (existing?.etag) {
        await client.updateEntity(merged, "Merge", { etag: existing.etag });
      } else {
        await client.upsertEntity(merged, "Merge");
      }
      return merged as DailyLogEntity;
    } catch (err) {
      if (err instanceof RestError && err.statusCode === 412 && attempt === 0) continue;
      throw err;
    }
  }
  throw new Error("Failed to update water after retry");
}

function defaultSettings(): Settings {
  return {
    weightKg: DEFAULT_WEIGHT_KG,
    waterGoalMlOverride: null,
    cupSizeMl: DEFAULT_CUP_SIZE_ML,
    startDate: getTodayISO(),
    taskLabels: { ...DEFAULT_TASK_LABELS },
  };
}

function mapSettingsEntity(entity: Record<string, unknown>): Settings {
  let taskLabels: Record<TaskId, string> = { ...DEFAULT_TASK_LABELS };
  const rawJson = entity.taskLabelsJson as string | undefined;
  if (rawJson) {
    try {
      taskLabels = { ...taskLabels, ...JSON.parse(rawJson) };
    } catch {
      // malformed json, fall back to defaults
    }
  }
  return {
    weightKg: (entity.weightKg as number) ?? DEFAULT_WEIGHT_KG,
    waterGoalMlOverride: (entity.waterGoalMlOverride as number | undefined) ?? null,
    cupSizeMl: (entity.cupSizeMl as number) ?? DEFAULT_CUP_SIZE_ML,
    startDate: (entity.startDate as string) ?? getTodayISO(),
    taskLabels,
  };
}

export async function getSettings(userId: string): Promise<Settings> {
  try {
    const entity = await getUserSettingsClient().getEntity(userId, "settings");
    return mapSettingsEntity(entity);
  } catch (err) {
    if (err instanceof RestError && err.statusCode === 404) return defaultSettings();
    throw err;
  }
}

export async function upsertSettingsPatch(userId: string, patch: Partial<Settings>): Promise<Settings> {
  const existing = await getSettings(userId);
  const merged: Settings = {
    weightKg: patch.weightKg ?? existing.weightKg,
    waterGoalMlOverride:
      patch.waterGoalMlOverride !== undefined ? patch.waterGoalMlOverride : existing.waterGoalMlOverride,
    cupSizeMl: patch.cupSizeMl ?? existing.cupSizeMl,
    startDate: patch.startDate ?? existing.startDate,
    taskLabels: patch.taskLabels ? { ...existing.taskLabels, ...patch.taskLabels } : existing.taskLabels,
  };

  const entity: Record<string, unknown> = {
    partitionKey: userId,
    rowKey: "settings",
    weightKg: merged.weightKg,
    cupSizeMl: merged.cupSizeMl,
    startDate: merged.startDate,
    taskLabelsJson: JSON.stringify(merged.taskLabels),
    updatedAt: new Date().toISOString(),
  };
  // Table Storage has no null type - omit the property entirely to mean "unset".
  if (merged.waterGoalMlOverride !== null) {
    entity.waterGoalMlOverride = merged.waterGoalMlOverride;
  }

  await getUserSettingsClient().upsertEntity(entity as never, "Replace");
  return merged;
}
