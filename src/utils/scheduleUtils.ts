import type { Task } from '../types';

export interface ScheduledTask {
  id: number;
  title: string;
  category: Task['category'];
  priority: Task['priority'];
  energy: Task['energy'];
  completed: boolean;
  estimatedHours: number;
  scheduledDate: Date;
  scheduledDay: number; // 日付（1-31）
  isMonthly: boolean;
  isFixed: boolean; // 固定日程かどうか
  notes?: string;
}

/**
 * タスクタイトルから日付情報を抽出
 */
export function extractScheduleFromTitle(title: string): { day: number | null; isMonthly: boolean } {
  // 【毎月X日】パターン
  const monthlyMatch = title.match(/【毎月(\d+)日】/);
  if (monthlyMatch) {
    return { day: parseInt(monthlyMatch[1], 10), isMonthly: true };
  }

  // 【X月】パターン（月単位のタスク）
  const monthMatch = title.match(/【(\d+)月】/);
  if (monthMatch) {
    return { day: null, isMonthly: false };
  }

  return { day: null, isMonthly: false };
}

/**
 * タスクリストからスケジュール付きタスクを抽出
 */
export function extractScheduledTasks(
  tasks: Task[],
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth() + 1
): ScheduledTask[] {
  const scheduledTasks: ScheduledTask[] = [];

  for (const task of tasks) {
    const schedule = extractScheduleFromTitle(task.title);

    if (schedule.day && schedule.isMonthly) {
      scheduledTasks.push({
        id: task.id,
        title: task.title,
        category: task.category,
        priority: task.priority,
        energy: task.energy,
        completed: task.completed,
        estimatedHours: task.estimatedHours,
        scheduledDate: new Date(year, month - 1, schedule.day),
        scheduledDay: schedule.day,
        isMonthly: true,
        isFixed: true,
        notes: task.notes
      });
    }
  }

  return scheduledTasks.sort((a, b) => a.scheduledDay - b.scheduledDay);
}

/**
 * 週の範囲内にあるスケジュール付きタスクを取得
 */
export function getScheduledTasksForWeek(
  tasks: Task[],
  weekStart: Date,
  weekEnd: Date
): ScheduledTask[] {
  const year = weekStart.getFullYear();
  const month = weekStart.getMonth() + 1;

  const scheduledTasks = extractScheduledTasks(tasks, year, month);

  return scheduledTasks.filter(task => {
    const taskDate = task.scheduledDate;
    return taskDate >= weekStart && taskDate <= weekEnd;
  });
}

/**
 * 日付範囲の配列を生成
 */
export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * 日付フォーマット関数
 */
export function formatScheduleDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function formatDayOfWeek(date: Date): string {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[date.getDay()];
}

/**
 * 優先度に基づく色を取得
 */
export function getPriorityColor(priority: Task['priority']): string {
  switch (priority) {
    case 'S': return 'bg-red-500/20 border-red-500/40 text-red-300';
    case 'A': return 'bg-orange-500/20 border-orange-500/40 text-orange-300';
    case 'B': return 'bg-green-500/20 border-green-500/40 text-green-300';
    default: return 'bg-gray-500/20 border-gray-500/40 text-gray-300';
  }
}

/**
 * エネルギーレベルに基づくアイコンを取得
 */
export function getEnergyIcon(energy: Task['energy']): string {
  switch (energy) {
    case 'high': return '⚡';
    case 'medium': return '💡';
    case 'low': return '🔋';
    default: return '💡';
  }
}