import type { Task, WeekData, ExportData, AppError, TaskFormData, GoalFormData } from '../types';

export const validateTask = (task: any): task is Task => {
  try {
    return (
      typeof task.id === 'number' &&
      ['sns', 'expertise', 'marketing', 'business'].includes(task.category) &&
      typeof task.title === 'string' &&
      task.title.trim().length > 0 &&
      ['S', 'A', 'B'].includes(task.priority) &&
      ['high', 'medium', 'low'].includes(task.energy) &&
      typeof task.completed === 'boolean' &&
      (task.completedDate === null || typeof task.completedDate === 'string') &&
      typeof task.estimatedHours === 'number' &&
      task.estimatedHours >= 0 &&
      typeof task.createdAt === 'string' &&
      typeof task.updatedAt === 'string'
    );
  } catch {
    return false;
  }
};

export const validateWeekData = (weekData: any): weekData is WeekData => {
  try {
    return (
      typeof weekData.weekNumber === 'number' &&
      weekData.weekNumber > 0 &&
      weekData.weekNumber <= 53 &&
      typeof weekData.dateRange === 'string' &&
      typeof weekData.phase === 'number' &&
      weekData.phase >= 1 &&
      weekData.phase <= 5 &&
      typeof weekData.phaseProgress === 'object' &&
      typeof weekData.phaseProgress.overall === 'number' &&
      Array.isArray(weekData.tasks) &&
      weekData.tasks.every(validateTask) &&
      typeof weekData.goals === 'object' &&
      validateCategoryGoals(weekData.goals) &&
      Array.isArray(weekData.insights) &&
      weekData.insights.every((insight: any) => typeof insight === 'string') &&
      typeof weekData.weeklyReflection === 'string' &&
      typeof weekData.createdAt === 'string' &&
      typeof weekData.updatedAt === 'string'
    );
  } catch {
    return false;
  }
};

export const validateCategoryGoals = (goals: any): boolean => {
  try {
    const requiredCategories = ['sns', 'expertise', 'marketing', 'business'];

    return requiredCategories.every(category => {
      const goal = goals[category];
      return (
        goal &&
        (typeof goal.target === 'number' || typeof goal.target === 'string') &&
        (typeof goal.current === 'number' || typeof goal.current === 'string') &&
        typeof goal.label === 'string' &&
        goal.label.trim().length > 0
      );
    });
  } catch {
    return false;
  }
};

export const validateTaskFormData = (data: any): data is TaskFormData => {
  try {
    return (
      typeof data.title === 'string' &&
      data.title.trim().length > 0 &&
      data.title.length <= 200 &&
      ['sns', 'expertise', 'marketing', 'business'].includes(data.category) &&
      ['S', 'A', 'B'].includes(data.priority) &&
      ['high', 'medium', 'low'].includes(data.energy) &&
      typeof data.estimatedHours === 'number' &&
      data.estimatedHours >= 0 &&
      data.estimatedHours <= 100 &&
      (data.notes === undefined || typeof data.notes === 'string')
    );
  } catch {
    return false;
  }
};

export const validateGoalFormData = (data: any): data is GoalFormData => {
  try {
    return (
      typeof data.category === 'string' &&
      data.category.trim().length > 0 &&
      (typeof data.target === 'number' || typeof data.target === 'string') &&
      (typeof data.current === 'number' || typeof data.current === 'string') &&
      typeof data.label === 'string' &&
      data.label.trim().length > 0 &&
      data.label.length <= 100
    );
  } catch {
    return false;
  }
};

export const validateExportData = (data: any): data is ExportData => {
  try {
    return (
      typeof data.version === 'string' &&
      typeof data.exportDate === 'string' &&
      Array.isArray(data.weekData) &&
      data.weekData.every(validateWeekData) &&
      Array.isArray(data.categories) &&
      typeof data.analytics === 'object'
    );
  } catch {
    return false;
  }
};

export const sanitizeTaskTitle = (title: string): string => {
  return title
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially harmful characters
    .substring(0, 200); // Limit length
};

export const sanitizeTaskNotes = (notes: string | undefined): string | undefined => {
  if (!notes) return undefined;

  return notes
    .trim()
    .replace(/[<>\"'&]/g, '')
    .substring(0, 1000);
};

export const sanitizeGoalLabel = (label: string): string => {
  return label
    .trim()
    .replace(/[<>\"'&]/g, '')
    .substring(0, 100);
};

export const createAppError = (
  type: AppError['type'],
  message: string,
  details?: any
): AppError => {
  return {
    type,
    message,
    details,
    timestamp: new Date().toISOString()
  };
};

export const handleValidationError = (field: string, value: any): AppError => {
  return createAppError(
    'VALIDATION_ERROR',
    `Invalid ${field}: ${JSON.stringify(value)}`,
    { field, value }
  );
};

export const handleStorageError = (operation: string, error: any): AppError => {
  return createAppError(
    'STORAGE_ERROR',
    `Storage ${operation} failed: ${error.message}`,
    { operation, originalError: error }
  );
};

export const handleImportError = (error: any): AppError => {
  return createAppError(
    'IMPORT_ERROR',
    `Data import failed: ${error.message}`,
    { originalError: error }
  );
};

export const handleCalculationError = (calculation: string, error: any): AppError => {
  return createAppError(
    'CALCULATION_ERROR',
    `Analytics calculation failed: ${calculation} - ${error.message}`,
    { calculation, originalError: error }
  );
};

export const isValidWeekNumber = (weekNumber: number): boolean => {
  return Number.isInteger(weekNumber) && weekNumber >= 1 && weekNumber <= 53;
};

export const isValidPhaseNumber = (phase: number): boolean => {
  return Number.isInteger(phase) && phase >= 1 && phase <= 5;
};

export const isValidPriority = (priority: string): priority is 'S' | 'A' | 'B' => {
  return ['S', 'A', 'B'].includes(priority);
};

export const isValidEnergy = (energy: string): energy is 'high' | 'medium' | 'low' => {
  return ['high', 'medium', 'low'].includes(energy);
};

export const isValidCategory = (category: string): category is 'sns' | 'expertise' | 'marketing' | 'business' => {
  return ['sns', 'expertise', 'marketing', 'business'].includes(category);
};

export const cleanupOldData = (weekData: WeekData[], maxWeeks: number = 100): WeekData[] => {
  if (weekData.length <= maxWeeks) return weekData;

  // Keep most recent weeks
  return weekData
    .sort((a, b) => b.weekNumber - a.weekNumber)
    .slice(0, maxWeeks);
};

export const validateLocalStorageCapacity = (): { available: boolean; usage: number; limit: number } => {
  try {
    const testKey = 'storage-test';
    const testData = 'x'.repeat(1024); // 1KB test

    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);

    // Estimate current usage
    let usage = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        usage += localStorage.getItem(key)?.length || 0;
      }
    }

    const limit = 5 * 1024 * 1024; // 5MB typical limit
    const available = usage < limit * 0.9; // Use 90% as threshold

    return { available, usage, limit };
  } catch (error) {
    return { available: false, usage: 0, limit: 0 };
  }
};