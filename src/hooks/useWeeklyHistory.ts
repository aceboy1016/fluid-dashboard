import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { CONSTANTS } from '../constants/categories';
import type {
  AIInsight,
  ReflectionProfile,
  Task,
  WeeklyMetricsSnapshot,
  WeeklyReflectionInput,
  WeekHistoryEntry,
} from '../types';

const STORAGE_KEY = CONSTANTS.LOCAL_STORAGE_KEYS.WEEKLY_HISTORY;
const PROFILE_KEY = CONSTANTS.LOCAL_STORAGE_KEYS.REFLECTION_PROFILE;

type HistoryStore = WeekHistoryEntry[];

type HistoryApi = {
  entries: WeekHistoryEntry[];
  addEntry: (entry: WeekHistoryEntry) => void;
  upsertEntry: (entry: WeekHistoryEntry) => void;
  getEntry: (weekNumber: number, year: number) => WeekHistoryEntry | undefined;
  clear: () => void;
};

type ProfileApi = {
  profile: ReflectionProfile;
  updateProfile: (updates: Partial<ReflectionProfile>) => void;
};

const DEFAULT_PROFILE: ReflectionProfile = {
  persona: 'INTJ',
  tone: 'direct',
  allowRuleFallback: true,
  lastUpdated: new Date().toISOString(),
};

const defaultHistory: HistoryStore = [];

const loadHistory = (): HistoryStore => {
  if (typeof window === 'undefined') return defaultHistory;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultHistory;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultHistory;
    return parsed;
  } catch (error) {
    console.warn('[History] Failed to read history:', error);
    return defaultHistory;
  }
};

const saveHistory = (entries: HistoryStore) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('[History] Failed to save history:', error);
  }
};

const loadProfile = (): ReflectionProfile => {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      lastUpdated: parsed?.lastUpdated || new Date().toISOString(),
    } as ReflectionProfile;
  } catch (error) {
    console.warn('[History] Failed to read profile:', error);
    return DEFAULT_PROFILE;
  }
};

const saveProfile = (profile: ReflectionProfile) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('[History] Failed to save profile:', error);
  }
};

export const createMetricsSnapshot = (tasks: Task[]): WeeklyMetricsSnapshot => {
  const completedTasks = tasks.filter((task) => task.completed);
  const highPriorityCompleted = completedTasks.filter((task) => task.priority === 'S').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks.length / totalTasks) * 100);

  const categoryTotals: Record<string, number> = {
    note: 0,
    standfm: 0,
    instagram: 0,
    youtube: 0,
    expertise: 0,
    marketing: 0,
    business: 0,
    topform: 0,
    private: 0,
    other: 0,
  };

  const categoryCompletedCounts: Record<string, number> = {
    note: 0,
    standfm: 0,
    instagram: 0,
    youtube: 0,
    expertise: 0,
    marketing: 0,
    business: 0,
    topform: 0,
    private: 0,
    other: 0,
  };

  const energyCounts = { high: 0, medium: 0, low: 0 } as WeeklyMetricsSnapshot['energyDistribution'];
  const priorityCounts = { S: 0, A: 0, B: 0 } as WeeklyMetricsSnapshot['priorityDistribution'];

  tasks.forEach((task) => {
    categoryTotals[task.category] += 1;
    if (task.completed) {
      categoryCompletedCounts[task.category] += 1;
    }
    energyCounts[task.energy] += 1;
    priorityCounts[task.priority] += 1;
  });

  const categoryProgress = Object.keys(categoryTotals)
    .filter(key => !['private', 'other'].includes(key))
    .reduce((acc, key) => {
      const typedKey = key as keyof WeeklyMetricsSnapshot['categoryProgress'];
      const total = categoryTotals[typedKey];
      const completed = categoryCompletedCounts[typedKey];
      acc[typedKey] = total === 0 ? 0 : Math.round((completed / total) * 100);
      return acc;
    }, {
    note: 0,
    standfm: 0,
    instagram: 0,
    youtube: 0,
    expertise: 0,
    marketing: 0,
    business: 0,
    topform: 0,
  } as WeeklyMetricsSnapshot['categoryProgress']);

  return {
    completionRate,
    totalTasks,
    completedTasks: completedTasks.length,
    highPriorityCompleted,
    categoryProgress,
    energyDistribution: energyCounts,
    priorityDistribution: priorityCounts,
    createdAt: new Date().toISOString(),
  };
};

export const useWeeklyHistory = (): HistoryApi => {
  const [entries, setEntries] = useState<HistoryStore>(() => loadHistory());

  const addEntry = useCallback((entry: WeekHistoryEntry) => {
    setEntries((prev) => {
      const updated = [...prev, entry];
      saveHistory(updated);
      return updated;
    });
  }, []);

  const upsertEntry = useCallback((entry: WeekHistoryEntry) => {
    setEntries((prev) => {
      const index = prev.findIndex((item) => item.id === entry.id);
      let updated: WeekHistoryEntry[];

      if (index === -1) {
        updated = [...prev, entry];
      } else {
        updated = [...prev];
        updated[index] = entry;
      }

      saveHistory(updated);
      return updated;
    });
  }, []);

  const getEntry = useCallback(
    (weekNumber: number, year: number) => entries.find((entry) => entry.weekNumber === weekNumber && entry.year === year),
    [entries]
  );

  const clear = useCallback(() => {
    saveHistory([]);
    setEntries([]);
  }, []);

  return {
    entries,
    addEntry,
    upsertEntry,
    getEntry,
    clear,
  };
};

export const useReflectionProfile = (): ProfileApi => {
  const [profile, setProfile] = useState<ReflectionProfile>(() => loadProfile());

  const updateProfile = useCallback((updates: Partial<ReflectionProfile>) => {
    setProfile((prev) => {
      const newProfile: ReflectionProfile = {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };

      saveProfile(newProfile);
      return newProfile;
    });
  }, []);

  return {
    profile,
    updateProfile,
  };
};

export const createHistoryEntry = (params: {
  weekNumber: number;
  year: number;
  dateRange: string;
  tasks: Task[];
  reflection: WeeklyReflectionInput;
  insight?: AIInsight;
  existingEntry?: WeekHistoryEntry;
}): WeekHistoryEntry => {
  const baseMetrics = createMetricsSnapshot(params.tasks);
  const existing = params.existingEntry;

  return {
    id: existing?.id ?? uuid(),
    weekNumber: params.weekNumber,
    year: params.year,
    dateRange: params.dateRange,
    metrics: baseMetrics,
    reflection: params.reflection,
    aiInsight: params.insight,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
};
