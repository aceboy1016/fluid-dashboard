import React, { useRef, useState } from 'react';
import { Check, Clock, Zap, Edit3, Trash2, MoreVertical, GripVertical } from 'lucide-react';
import { useDrag } from 'react-dnd';
import type { Task } from '../../types';
import clsx from 'clsx';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: number) => void;
  onUpdate: (taskId: number, updates: Partial<Task>) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onUpdate,
  onEdit,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const itemRef = useRef<HTMLDivElement | null>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id, category: task.category },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'S':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          label: '最重要'
        };
      case 'A':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          text: 'text-orange-400',
          label: '重要'
        };
      case 'B':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          text: 'text-green-400',
          label: '通常'
        };
      default:
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          text: 'text-slate-400',
          label: '不明'
        };
    }
  };

  const getEnergyConfig = (energy: string) => {
    switch (energy) {
      case 'high':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          icon: <Zap className="h-3 w-3" />,
          label: '高エネルギー'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400',
          icon: <Clock className="h-3 w-3" />,
          label: '中エネルギー'
        };
      case 'low':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          icon: <Clock className="h-3 w-3" />,
          label: '低エネルギー'
        };
      default:
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          text: 'text-slate-400',
          icon: <Clock className="h-3 w-3" />,
          label: '不明'
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const energyConfig = getEnergyConfig(task.energy);

  const handleToggle = () => {
    onToggle(task.id);
  };

  const handleActualHoursChange = (hours: number) => {
    onUpdate(task.id, { actualHours: hours });
  };

  drag(itemRef);

  return (
    <div
      ref={itemRef}
      className={clsx(
        'group relative',
        'bg-slate-800/50 border border-slate-700/50 rounded-lg',
        'hover:bg-slate-800/70 hover:border-slate-600/50',
        'transition-all duration-200',
        'cursor-move',
        task.completed && 'opacity-75',
        isDragging && 'opacity-50 scale-95'
      )}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Drag Handle */}
          <div className="flex-shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-slate-400" />
          </div>

          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={clsx(
              'flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200',
              'flex items-center justify-center',
              task.completed
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-slate-400 hover:border-emerald-400 hover:bg-emerald-400/10'
            )}
          >
            {task.completed && <Check className="h-3 w-3" />}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className={clsx(
                  'text-sm font-medium transition-colors',
                  task.completed
                    ? 'text-slate-400 line-through'
                    : 'text-white group-hover:text-slate-100'
                )}>
                  {task.title}
                </h4>

                {/* Badges */}
                <div className="flex items-center space-x-2 mt-2">
                  <span className={clsx(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
                    priorityConfig.bg,
                    priorityConfig.border,
                    priorityConfig.text
                  )}>
                    {task.priority}
                  </span>

                  <span className={clsx(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border space-x-1',
                    energyConfig.bg,
                    energyConfig.border,
                    energyConfig.text
                  )}>
                    {energyConfig.icon}
                    <span>{energyConfig.label}</span>
                  </span>

                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-700/50 border border-slate-600/50 text-slate-300">
                    <Clock className="h-3 w-3 mr-1" />
                    {task.estimatedHours}h予定
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/50"
                  title="詳細を表示"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {onEdit && (
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                    title="編集"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    title="削除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                <div className="space-y-3">
                  {/* Notes */}
                  {task.notes && (
                    <div>
                      <label className="text-xs font-medium text-slate-400">メモ</label>
                      <p className="text-sm text-slate-300 mt-1">{task.notes}</p>
                    </div>
                  )}

                  {/* Time Tracking */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400">予定時間</label>
                      <p className="text-sm text-slate-300 mt-1">{task.estimatedHours}時間</p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400">実績時間</label>
                      <div className="mt-1">
                        {task.completed ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            value={task.actualHours || task.estimatedHours}
                            onChange={(e) => handleActualHoursChange(parseFloat(e.target.value))}
                            className="w-20 px-2 py-1 text-sm bg-slate-800 border border-slate-600 rounded text-white focus:border-blue-400 focus:outline-none"
                          />
                        ) : (
                          <span className="text-sm text-slate-400">
                            {task.actualHours || '-'}時間
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Completion Date */}
                  {task.completed && task.completedDate && (
                    <div>
                      <label className="text-xs font-medium text-slate-400">完了日時</label>
                      <p className="text-sm text-slate-300 mt-1">
                        {new Date(task.completedDate).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-700/50">
                    <div>作成: {new Date(task.createdAt).toLocaleString('ja-JP')}</div>
                    {task.updatedAt !== task.createdAt && (
                      <div>更新: {new Date(task.updatedAt).toLocaleString('ja-JP')}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Animation */}
      {task.completed && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-2 text-emerald-400 opacity-80 animate-pulse">
            <Check className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );
};