import type { WeekData, ExportData, AnalyticsData, Category } from '../types';
import { validateExportData, createAppError, cleanupOldData } from './validationUtils';
import { generateAnalytics } from './analyticsUtils';
import { DEFAULT_CATEGORIES } from '../constants/categories';

export const exportToJSON = (
  weekData: WeekData[],
  categories: Category[] = Object.values(DEFAULT_CATEGORIES)
): string => {
  try {
    const analytics = generateAnalytics(weekData);

    const exportData: ExportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      weekData: cleanupOldData(weekData),
      categories,
      analytics
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error: any) {
    throw createAppError('CALCULATION_ERROR', 'Export failed', error);
  }
};

export const importFromJSON = (jsonString: string): {
  weekData: WeekData[];
  categories: Category[];
  analytics: AnalyticsData;
} => {
  try {
    const data = JSON.parse(jsonString);

    if (!validateExportData(data)) {
      throw createAppError('IMPORT_ERROR', 'Invalid data format');
    }

    // Migrate old data format if necessary
    const migratedData = migrateDataFormat(data);

    return {
      weekData: migratedData.weekData,
      categories: migratedData.categories,
      analytics: migratedData.analytics
    };
  } catch (error: any) {
    if (error.type) {
      throw error; // Re-throw AppError
    }
    throw createAppError('IMPORT_ERROR', 'Failed to parse JSON', error);
  }
};

export const downloadJSON = (data: string, filename: string = `ishihara-todo-${new Date().toISOString().split('T')[0]}.json`): void => {
  try {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error: any) {
    throw createAppError('STORAGE_ERROR', 'Download failed', error);
  }
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(createAppError('IMPORT_ERROR', 'Failed to read file as text'));
      }
    };

    reader.onerror = () => {
      reject(createAppError('IMPORT_ERROR', 'File reading failed'));
    };

    reader.readAsText(file);
  });
};

export const exportToCSV = (weekData: WeekData[]): string => {
  try {
    const headers = [
      'Week Number',
      'Date Range',
      'Phase',
      'Task Title',
      'Category',
      'Priority',
      'Energy',
      'Completed',
      'Estimated Hours',
      'Actual Hours',
      'Notes'
    ].join(',');

    const rows = weekData.flatMap(week =>
      week.tasks.map(task => [
        week.weekNumber,
        `"${week.dateRange}"`,
        week.phase,
        `"${task.title.replace(/"/g, '""')}"`,
        task.category,
        task.priority,
        task.energy,
        task.completed,
        task.estimatedHours,
        task.actualHours || '',
        `"${(task.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    );

    return [headers, ...rows].join('\n');
  } catch (error: any) {
    throw createAppError('CALCULATION_ERROR', 'CSV export failed', error);
  }
};

export const exportAnalyticsToCSV = (weekData: WeekData[]): string => {
  try {
    // const analytics = generateAnalytics(weekData);

    const headers = [
      'Week Number',
      'Date Range',
      'Completion Rate',
      'Priority Tasks Completed',
      'Total Tasks',
      'Learning Tasks',
      'System Tasks',
      'High Energy Tasks Completed'
    ].join(',');

    const rows = weekData.map(week => {
      const completedTasks = week.tasks.filter(t => t.completed).length;
      const priorityTasks = week.tasks.filter(t => (t.priority === 'S' || t.priority === 'A') && t.completed).length;
      const learningTasks = week.tasks.filter(t => t.category === 'expertise' && t.completed).length;
      const systemTasks = week.tasks.filter(t =>
        (t.title.toLowerCase().includes('システム') ||
         t.title.toLowerCase().includes('ツール')) && t.completed).length;
      const highEnergyTasks = week.tasks.filter(t => t.energy === 'high' && t.completed).length;

      return [
        week.weekNumber,
        `"${week.dateRange}"`,
        week.tasks.length > 0 ? Math.round((completedTasks / week.tasks.length) * 100) : 0,
        priorityTasks,
        week.tasks.length,
        learningTasks,
        systemTasks,
        highEnergyTasks
      ].join(',');
    });

    return [headers, ...rows].join('\n');
  } catch (error: any) {
    throw createAppError('CALCULATION_ERROR', 'Analytics CSV export failed', error);
  }
};

export const migrateDataFormat = (data: any): ExportData => {
  // Handle version 1.0.0 (current format)
  if (data.version === '1.0.0') {
    return data as ExportData;
  }

  // Migration logic for future versions
  let migratedData = { ...data };

  // Add default categories if missing
  if (!migratedData.categories || migratedData.categories.length === 0) {
    migratedData.categories = Object.values(DEFAULT_CATEGORIES);
  }

  // Ensure all tasks have required fields
  if (migratedData.weekData) {
    migratedData.weekData = migratedData.weekData.map((week: any) => ({
      ...week,
      tasks: week.tasks.map((task: any) => ({
        ...task,
        createdAt: task.createdAt || new Date().toISOString(),
        updatedAt: task.updatedAt || new Date().toISOString(),
        estimatedHours: task.estimatedHours || 1
      }))
    }));
  }

  // Recalculate analytics if missing
  if (!migratedData.analytics && migratedData.weekData) {
    migratedData.analytics = generateAnalytics(migratedData.weekData);
  }

  // Set version
  migratedData.version = '1.0.0';

  return migratedData as ExportData;
};

export const createBackup = (weekData: WeekData[]): void => {
  try {
    const backupData = exportToJSON(weekData);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    downloadJSON(backupData, `ishihara-todo-backup-${timestamp}.json`);
  } catch (error: any) {
    throw createAppError('STORAGE_ERROR', 'Backup creation failed', error);
  }
};

export const validateImportFile = (file: File): Promise<boolean> => {
  return new Promise(async (resolve) => {
    try {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        resolve(false);
        return;
      }

      // Check file type
      if (!file.type.includes('json') && !file.name.endsWith('.json')) {
        resolve(false);
        return;
      }

      // Try to read and validate content
      const content = await readFileAsText(file);
      const data = JSON.parse(content);
      resolve(validateExportData(data));
    } catch {
      resolve(false);
    }
  });
};

export const getExportSummary = (weekData: WeekData[]): {
  totalWeeks: number;
  totalTasks: number;
  completedTasks: number;
  categories: string[];
  dateRange: { start: string; end: string };
} => {
  if (weekData.length === 0) {
    return {
      totalWeeks: 0,
      totalTasks: 0,
      completedTasks: 0,
      categories: [],
      dateRange: { start: '', end: '' }
    };
  }

  const sortedWeeks = weekData.sort((a, b) => a.weekNumber - b.weekNumber);
  const totalTasks = weekData.reduce((sum, week) => sum + week.tasks.length, 0);
  const completedTasks = weekData.reduce((sum, week) =>
    sum + week.tasks.filter(task => task.completed).length, 0);

  const categories = Array.from(new Set(
    weekData.flatMap(week => week.tasks.map(task => task.category))
  ));

  return {
    totalWeeks: weekData.length,
    totalTasks,
    completedTasks,
    categories,
    dateRange: {
      start: sortedWeeks[0].dateRange.split(' - ')[0],
      end: sortedWeeks[sortedWeeks.length - 1].dateRange.split(' - ')[1]
    }
  };
};