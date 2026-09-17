import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type { DayLog, DayResponse, Settings } from "./types";

export function useToday() {
  return useQuery({
    queryKey: ["day", "today"],
    queryFn: api.getToday,
    refetchOnWindowFocus: true,
  });
}

export function useDay(date: string | undefined) {
  return useQuery({
    queryKey: ["day", date],
    queryFn: () => api.getDay(date as string),
    enabled: !!date,
  });
}

export function useDaysRange(from: string, to: string) {
  return useQuery({
    queryKey: ["days-range", from, to],
    queryFn: () => api.getDaysRange(from, to),
  });
}

export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: api.getTeam,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: api.getSettings,
  });
}

function applyDayResult(queryClient: ReturnType<typeof useQueryClient>, day: DayResponse) {
  queryClient.setQueryData(["day", day.date], day);
  if (day.isToday) {
    queryClient.setQueryData(["day", "today"], day);
  } else {
    // Editing a past day changes the shared challenge status (day number, total
    // required days, ...) embedded in every day response, including today's cached one.
    queryClient.invalidateQueries({ queryKey: ["day", "today"] });
  }
  queryClient.invalidateQueries({ queryKey: ["days-range"] });
  queryClient.invalidateQueries({ queryKey: ["team"] });
}

export function usePutDay(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<DayLog>) => api.putDay(date, patch),
    onSuccess: (day) => applyDayResult(queryClient, day),
  });
}

export function useAddWater(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deltaMl: number) => api.addWater(date, deltaMl),
    onSuccess: (day) => applyDayResult(queryClient, day),
  });
}

export function usePutSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<Settings>) => api.putSettings(patch),
    onSuccess: (settings) => {
      queryClient.setQueryData(["settings"], settings);
      queryClient.invalidateQueries({ queryKey: ["day"] });
      queryClient.invalidateQueries({ queryKey: ["days-range"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
}
