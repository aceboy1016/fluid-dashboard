import type { Task } from '../types';

/**
 * タスクタイトルから日付を抽出
 */
export function extractDateFromTitle(title: string): number | null {
  const match = title.match(/【毎月(\d+)日】/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * 現在の日付が指定された日付範囲内かチェック
 */
export function isDateInRange(date: number, startDate: number, endDate: number): boolean {
  if (startDate <= endDate) {
    return date >= startDate && date <= endDate;
  } else {
    // 月をまたぐ場合（例：26日〜3日）
    return date >= startDate || date <= endDate;
  }
}

/**
 * 現在の日付範囲に基づいてタスクをソート
 * 期間内のタスクを優先度順、期間外のタスクは日付順
 */
export function sortTasksByDatePriority(
  tasks: Task[],
  currentDate: number = new Date().getDate()
): Task[] {
  // 現在の日付を基準に期間を設定（7日間の範囲）
  const rangeStart = currentDate;
  const rangeEnd = currentDate + 6 > 31 ? (currentDate + 6) - 31 : currentDate + 6;

  return [...tasks].sort((a, b) => {
    // TOPFORMカテゴリーでない場合は元の順序を維持
    if (a.category !== 'topform' && b.category !== 'topform') {
      return 0;
    }

    // 片方だけTOPFORMの場合
    if (a.category !== 'topform') return 1;
    if (b.category !== 'topform') return -1;

    const dateA = extractDateFromTitle(a.title);
    const dateB = extractDateFromTitle(b.title);

    // 日付が抽出できない場合は後ろに
    if (dateA === null && dateB === null) return 0;
    if (dateA === null) return 1;
    if (dateB === null) return -1;

    const aInRange = isDateInRange(dateA, rangeStart, rangeEnd);
    const bInRange = isDateInRange(dateB, rangeStart, rangeEnd);

    // 期間内のタスクを優先
    if (aInRange && !bInRange) return -1;
    if (!aInRange && bInRange) return 1;

    // 両方とも期間内または期間外の場合
    if (aInRange && bInRange) {
      // 期間内の場合は優先度順、同じ優先度なら日付順
      if (a.priority !== b.priority) {
        const priorityOrder = { S: 0, A: 1, B: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return dateA - dateB;
    }

    // 両方とも期間外の場合は日付順
    return dateA - dateB;
  });
}

/**
 * カスタム日付範囲でタスクをソート
 */
export function sortTasksByCustomDateRange(
  tasks: Task[],
  startDate: number,
  endDate: number
): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.category !== 'topform' && b.category !== 'topform') return 0;
    if (a.category !== 'topform') return 1;
    if (b.category !== 'topform') return -1;

    const dateA = extractDateFromTitle(a.title);
    const dateB = extractDateFromTitle(b.title);

    if (dateA === null && dateB === null) return 0;
    if (dateA === null) return 1;
    if (dateB === null) return -1;

    const aInRange = isDateInRange(dateA, startDate, endDate);
    const bInRange = isDateInRange(dateB, startDate, endDate);

    if (aInRange && !bInRange) return -1;
    if (!aInRange && bInRange) return 1;

    if (aInRange && bInRange) {
      if (a.priority !== b.priority) {
        const priorityOrder = { S: 0, A: 1, B: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return dateA - dateB;
    }

    return dateA - dateB;
  });
}