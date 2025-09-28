import React, { useRef, useState } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useDrop } from 'react-dnd';
import { TaskItem } from './TaskItem';
import type { Task } from '../../types';
import clsx from 'clsx';

interface TaskCategoryProps {
  category: 'note' | 'standfm' | 'instagram' | 'youtube' | 'expertise' | 'marketing' | 'business' | 'topform';
  categoryName: string;
  tasks: Task[];
  onTaskToggle: (taskId: number) => void;
  onTaskUpdate: (taskId: number, updates: Partial<Task>) => void;
  onTaskAdd?: () => void;
  onTaskMove?: (taskId: number, newCategory: string) => void;
  progress: number;
}

const categoryConfig = {
  note: {
    icon: '📝',
    color: 'teal',
    gradient: 'from-teal-500/20 to-cyan-600/20',
    border: 'border-teal-500/30',
    accent: 'text-teal-400'
  },
  standfm: {
    icon: '🎙️',
    color: 'orange',
    gradient: 'from-orange-500/20 to-red-600/20',
    border: 'border-orange-500/30',
    accent: 'text-orange-400'
  },
  instagram: {
    icon: '📷',
    color: 'pink',
    gradient: 'from-pink-500/20 to-rose-600/20',
    border: 'border-pink-500/30',
    accent: 'text-pink-400'
  },
  youtube: {
    icon: '📺',
    color: 'red',
    gradient: 'from-red-500/20 to-rose-600/20',
    border: 'border-red-500/30',
    accent: 'text-red-400'
  },
  expertise: {
    icon: '🎯',
    color: 'teal',
    gradient: 'from-teal-500/20 to-cyan-600/20',
    border: 'border-teal-500/30',
    accent: 'text-teal-400'
  },
  marketing: {
    icon: '📈',
    color: 'blue',
    gradient: 'from-blue-500/20 to-indigo-600/20',
    border: 'border-blue-500/30',
    accent: 'text-blue-400'
  },
  business: {
    icon: '💼',
    color: 'yellow',
    gradient: 'from-yellow-500/20 to-orange-600/20',
    border: 'border-yellow-500/30',
    accent: 'text-yellow-400'
  },
  topform: {
    icon: '🏢',
    color: 'red',
    gradient: 'from-red-500/20 to-rose-600/20',
    border: 'border-red-500/30',
    accent: 'text-red-400'
  }
};

export const TaskCategory: React.FC<TaskCategoryProps> = ({
  category,
  categoryName,
  tasks,
  onTaskToggle,
  onTaskUpdate,
  onTaskAdd,
  onTaskMove,
  progress
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const config = categoryConfig[category];

  const categoryRef = useRef<HTMLDivElement | null>(null);
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: number; category: string }) => {
      if (item.category !== category && onTaskMove) {
        onTaskMove(item.id, category);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const priorityTasks = {
    S: tasks.filter(task => task.priority === 'S'),
    A: tasks.filter(task => task.priority === 'A'),
    B: tasks.filter(task => task.priority === 'B')
  };

  const getProgressColor = () => {
    if (progress >= 80) return 'from-emerald-500 to-green-600';
    if (progress >= 60) return 'from-blue-500 to-indigo-600';
    if (progress >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  drop(categoryRef);

  return (
    <div
      ref={categoryRef}
      className={clsx(
        'card',
        'bg-gradient-to-br', config.gradient,
        'border', config.border,
        'transition-all duration-200',
        isOver && 'ring-2 ring-primary-cyan ring-opacity-50 scale-102'
      )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center space-x-2">
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
              <span className="text-xl">{config.icon}</span>
            </div>
            <div className="text-left">
              <h3 className={clsx('text-lg font-bold', config.accent)}>
                {categoryName}
              </h3>
              <div className="text-xs text-slate-400">
                {completedTasks}/{totalTasks} 完了
              </div>
            </div>
          </button>

          <div className="flex items-center space-x-3">
            {/* Progress Circle */}
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  className="text-slate-600"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="url(#progress-gradient)"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                  className="transition-all duration-500 ease-out"
                />
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={`${getProgressColor().split(' ')[0].replace('from-', 'text-')}`} />
                    <stop offset="100%" className={`${getProgressColor().split(' ')[1].replace('to-', 'text-')}`} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={clsx('text-xs font-bold', config.accent)}>
                  {progress}%
                </span>
              </div>
            </div>

            {/* Add Task Button */}
            {onTaskAdd && (
              <button
                onClick={onTaskAdd}
                className={clsx(
                  'p-2 rounded-lg border transition-colors',
                  'hover:bg-white opacity-10',
                  config.border,
                  'text-slate-300 hover:text-white'
                )}
                title="タスクを追加"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-1000 ease-out',
                `bg-gradient-to-r ${getProgressColor()}`
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Task Summary */}
        {!isCollapsed && (
          <div className="mt-3 flex items-center space-x-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>S優先: {priorityTasks.S.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span>A優先: {priorityTasks.A.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>B優先: {priorityTasks.B.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-sm">タスクがありません</p>
              <p className="text-xs mt-1">「+」ボタンでタスクを追加しましょう</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Priority S Tasks */}
              {priorityTasks.S.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onTaskToggle}
                  onUpdate={onTaskUpdate}
                />
              ))}

              {/* Priority A Tasks */}
              {priorityTasks.A.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onTaskToggle}
                  onUpdate={onTaskUpdate}
                />
              ))}

              {/* Priority B Tasks */}
              {priorityTasks.B.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onTaskToggle}
                  onUpdate={onTaskUpdate}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};