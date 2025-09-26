import React, { useState } from 'react';
import { Header } from './Header';
import { ProgressCard } from '../analytics/ProgressCard';
import { AnalyticsCard } from '../analytics/AnalyticsCard';
import { TaskCategory } from '../tasks/TaskCategory';
import { TaskModal } from '../ui/TaskModal';
import type { WeekData, Task, CategoryGoals, TaskFormData } from '../../types';
import { getCurrentWeekNumber, getWeekDateRange } from '../../utils/dateUtils';
import { INITIAL_GOALS, INITIAL_TASKS } from '../../constants/categories';
import { exportToJSON, downloadJSON } from '../../utils/exportUtils';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface DashboardProps {
  // This will be populated with hooks later
}

export const Dashboard: React.FC<DashboardProps> = () => {
  // Temporary state - will be replaced with custom hooks
  const [currentWeek] = useState(getCurrentWeekNumber());
  const [dateRange] = useState(getWeekDateRange(currentWeek));
  const [phase] = useState(1);
  const [currentView, setCurrentView] = useState<'dashboard' | 'analytics' | 'history'>('dashboard');
  const [goals] = useLocalStorage<CategoryGoals>('strategic-todo-goals', INITIAL_GOALS);
  const [tasks, setTasks] = useLocalStorage<Task[]>('strategic-todo-tasks', INITIAL_TASKS);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Sample week data for demonstration
  const weekData: WeekData = {
    weekNumber: currentWeek,
    dateRange,
    phase,
    phaseProgress: {
      overall: 45,
      methodology: 60,
      onlinePlatform: 30,
      revenue: 40
    },
    tasks,
    goals,
    insights: [
      '高エネルギータスクの完了率が向上しています',
      'SNSカテゴリで一定の進展が見られます',
      'システム化タスクを増やすことを推奨します'
    ],
    weeklyReflection: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const handleExport = () => {
    try {
      const exportData = exportToJSON([weekData]);
      downloadJSON(exportData);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = () => {
    // Will implement file upload later
    console.log('Import functionality will be implemented');
  };

  const handleTaskToggle = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedDate: !task.completed ? new Date().toISOString() : null,
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );
  };

  const handleTaskUpdate = (taskId: number, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const handleAddTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      ...taskData,
      completed: false,
      completedDate: null,
      actualHours: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleTaskMove = (taskId: number, newCategory: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, category: newCategory as Task['category'], updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const getTasksByCategory = (category: keyof CategoryGoals) => {
    return tasks.filter(task => task.category === category);
  };

  const calculateCompletionRate = () => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100);
  };

  const calculateCategoryProgress = (category: keyof CategoryGoals) => {
    const categoryTasks = getTasksByCategory(category);
    if (categoryTasks.length === 0) return 0;
    return Math.round((categoryTasks.filter(task => task.completed).length / categoryTasks.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header
        currentWeek={currentWeek}
        dateRange={dateRange}
        phase={phase}
        onViewChange={setCurrentView}
        currentView={currentView}
        onExport={handleExport}
        onImport={handleImport}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            {/* Progress Overview */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">進捗概要</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <ProgressCard
                  title="全体進捗"
                  current={calculateCompletionRate()}
                  target={100}
                  unit="%"
                  trend={5}
                  color="cyan"
                />
                <ProgressCard
                  title="SNS"
                  current={typeof goals.sns.current === 'number' ? goals.sns.current : 0}
                  target={typeof goals.sns.target === 'number' ? goals.sns.target : 0}
                  unit={goals.sns.unit}
                  trend={8}
                  color="pink"
                />
                <ProgressCard
                  title="マーケティング"
                  current={typeof goals.marketing.current === 'number' ? goals.marketing.current : 0}
                  target={typeof goals.marketing.target === 'number' ? goals.marketing.target : 0}
                  unit={goals.marketing.unit}
                  trend={-2}
                  color="blue"
                />
                <ProgressCard
                  title="収益"
                  current={typeof goals.business.current === 'number' ? goals.business.current : 0}
                  target={typeof goals.business.target === 'number' ? goals.business.target : 0}
                  unit={goals.business.unit}
                  trend={12}
                  color="yellow"
                />
                <ProgressCard
                  title="TOPFORM"
                  current={typeof goals.topform.current === 'number' ? goals.topform.current : 0}
                  target={typeof goals.topform.target === 'number' ? goals.topform.target : 0}
                  unit={goals.topform.unit}
                  trend={3}
                  color="red"
                />
              </div>
            </section>

            {/* Task Categories */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white">タスク管理</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TaskCategory
                  category="sns"
                  categoryName="SNS"
                  tasks={getTasksByCategory('sns')}
                  onTaskToggle={handleTaskToggle}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskAdd={() => setIsTaskModalOpen(true)}
                  onTaskMove={handleTaskMove}
                  progress={calculateCategoryProgress('sns')}
                />
                <TaskCategory
                  category="expertise"
                  categoryName="専門性開発"
                  tasks={getTasksByCategory('expertise')}
                  onTaskToggle={handleTaskToggle}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskAdd={() => setIsTaskModalOpen(true)}
                  onTaskMove={handleTaskMove}
                  progress={calculateCategoryProgress('expertise')}
                />
                <TaskCategory
                  category="marketing"
                  categoryName="マーケティング"
                  tasks={getTasksByCategory('marketing')}
                  onTaskToggle={handleTaskToggle}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskAdd={() => setIsTaskModalOpen(true)}
                  onTaskMove={handleTaskMove}
                  progress={calculateCategoryProgress('marketing')}
                />
                <TaskCategory
                  category="business"
                  categoryName="ビジネス"
                  tasks={getTasksByCategory('business')}
                  onTaskToggle={handleTaskToggle}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskAdd={() => setIsTaskModalOpen(true)}
                  onTaskMove={handleTaskMove}
                  progress={calculateCategoryProgress('business')}
                />
                <TaskCategory
                  category="topform"
                  categoryName="TOPFORM"
                  tasks={getTasksByCategory('topform')}
                  onTaskToggle={handleTaskToggle}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskAdd={() => setIsTaskModalOpen(true)}
                  onTaskMove={handleTaskMove}
                  progress={calculateCategoryProgress('topform')}
                />
              </div>
            </section>
          </div>
        )}

        {currentView === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">分析ダッシュボード</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnalyticsCard
                title="学習効率"
                value="85%"
                subtitle="前週比 +12%"
                trend={12}
                color="green"
                icon="📚"
              />
              <AnalyticsCard
                title="システム化進捗"
                value="67%"
                subtitle="効率化タスク完了率"
                trend={8}
                color="blue"
                icon="⚙️"
              />
              <AnalyticsCard
                title="エネルギー効率"
                value="1.3x"
                subtitle="高エネルギータスク最適化"
                trend={-5}
                color="orange"
                icon="⚡"
              />
            </div>
          </div>
        )}

        {currentView === 'history' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">履歴</h2>
            <div className="text-slate-400">
              履歴機能は実装中です...
            </div>
          </div>
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleAddTask}
        title="新しいタスクを追加"
      />
    </div>
  );
};