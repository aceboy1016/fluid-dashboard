import React, { useMemo } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import type { Task } from '../../types';
import {
  getScheduledTasksForWeek,
  generateDateRange,
  formatDayOfWeek,
  shortenTaskTitle,
  type ScheduledTask
} from '../../utils/scheduleUtils';
import { getWeekDates } from '../../utils/dateUtils';
import clsx from 'clsx';

interface WeeklyCalendarProps {
  tasks: Task[];
  currentWeek: number;
  onTaskToggle: (taskId: number) => void;
  onDateClick?: (date: Date) => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  tasks,
  currentWeek,
  onTaskToggle,
  onDateClick
}) => {
  const { start: weekStart, end: weekEnd } = getWeekDates(currentWeek);

  const scheduledTasks = useMemo(() => {
    return getScheduledTasksForWeek(tasks, weekStart, weekEnd);
  }, [tasks, weekStart, weekEnd]);

  const dateRange = useMemo(() => {
    return generateDateRange(weekStart, weekEnd);
  }, [weekStart, weekEnd]);

  const getTasksForDate = (date: Date): ScheduledTask[] => {
    return scheduledTasks.filter(task => {
      const taskDate = task.scheduledDate;
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  const getDateMetrics = (date: Date) => {
    const dayTasks = getTasksForDate(date);
    const completed = dayTasks.filter(t => t.completed).length;
    const total = dayTasks.length;
    const highPriority = dayTasks.filter(t => t.priority === 'S').length;

    return { completed, total, highPriority };
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-primary-green" />
          <h3 className="text-lg font-bold text-white">週間カレンダー</h3>
        </div>
        <div className="text-sm text-slate-400">
          第{currentWeek}週
        </div>
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-2">
        {dateRange.map((date, index) => {
          const dayTasks = getTasksForDate(date);
          const metrics = getDateMetrics(date);
          const isToday = new Date().toDateString() === date.toDateString();
          const hasHighPriority = metrics.highPriority > 0;

          return (
            <div
              key={index}
              className={clsx(
                'aspect-square p-2 rounded-lg border cursor-pointer transition-all relative',
                isToday
                  ? 'bg-primary-cyan/20 border-primary-cyan/50'
                  : dayTasks.length > 0
                    ? 'bg-slate-800/70 border-slate-600/50 hover:bg-slate-700/70'
                    : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50'
              )}
              onClick={() => onDateClick?.(date)}
            >
              {/* 日付 */}
              <div className={clsx(
                'text-sm font-medium mb-1',
                isToday ? 'text-primary-cyan' : 'text-white'
              )}>
                {date.getDate()}
              </div>

              {/* 曜日 */}
              <div className={clsx(
                'text-xs mb-2',
                isToday ? 'text-primary-cyan/80' : 'text-slate-400'
              )}>
                {formatDayOfWeek(date)}
              </div>

              {/* タスク表示 */}
              {dayTasks.length > 0 && (
                <div className="space-y-1">
                  {/* 高優先度アラート */}
                  {hasHighPriority && (
                    <div className="absolute top-1 right-1">
                      <AlertCircle className="h-3 w-3 text-red-400" />
                    </div>
                  )}

                  {/* タスク名表示（全て） */}
                  <div className="space-y-1">
                    {dayTasks.map(task => (
                      <div
                        key={task.id}
                        className={clsx(
                          'text-xs px-1 py-0.5 rounded border cursor-pointer transition-all',
                          task.completed
                            ? 'bg-green-400/20 border-green-400/40 text-green-300 line-through'
                            : task.priority === 'S'
                              ? 'bg-red-400/20 border-red-400/40 text-red-300'
                              : task.priority === 'A'
                                ? 'bg-orange-400/20 border-orange-400/40 text-orange-300'
                                : 'bg-blue-400/20 border-blue-400/40 text-blue-300'
                        )}
                        title={task.title}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskToggle(task.id);
                        }}
                      >
                        {shortenTaskTitle(task.title).substring(0, 8)}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-slate-400 text-center">
                        +{dayTasks.length - 2}件
                      </div>
                    )}
                  </div>

                  {/* 進捗バー */}
                  {metrics.total > 0 && (
                    <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                      <div
                        className="bg-green-400 h-1 rounded-full transition-all"
                        style={{
                          width: `${(metrics.completed / metrics.total) * 100}%`
                        }}
                      />
                    </div>
                  )}

                  {/* タスク数表示 */}
                  <div className="text-xs text-slate-400 text-center">
                    {metrics.completed}/{metrics.total}
                  </div>
                </div>
              )}

              {/* 空の日 */}
              {dayTasks.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-slate-500 text-xs">-</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-slate-400">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span>S優先</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <span>A優先</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span>B優先</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>完了</span>
        </div>
      </div>
    </div>
  );
};