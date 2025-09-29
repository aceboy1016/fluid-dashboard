import React, { useMemo, useState } from 'react';
import { Header } from './Header';
import { ProgressCard } from '../analytics/ProgressCard';
import { AnalyticsCard } from '../analytics/AnalyticsCard';
import { TaskCategory } from '../tasks/TaskCategory';
import { TaskModal } from '../ui/TaskModal';
import { ReflectionForm } from '../reflection/ReflectionForm';
import { AIInsightPanel } from '../reflection/AIInsightPanel';
import { LongTermGoalsPanel } from '../goals/LongTermGoalsPanel';
import { SNSGoalsEditor } from '../goals/SNSGoalsEditor';
import type {
  AIInsight,
  CategoryGoals,
  Task,
  TaskFormData,
  WeekData,
  WeekHistoryEntry,
  WeeklyReflectionInput,
} from '../../types';
import { getCurrentWeekNumber, getWeekDateRange } from '../../utils/dateUtils';
import { INITIAL_GOALS, INITIAL_TASKS } from '../../constants/categories';
import { exportToJSON, downloadJSON } from '../../utils/exportUtils';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useWeeklyHistory, useReflectionProfile, createHistoryEntry } from '../../hooks/useWeeklyHistory';
import { useAIInsights } from '../../hooks/useAIInsights';

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
  const [tasks, setTasks] = useLocalStorage<Task[]>('strategic-todo-tasks-v2', INITIAL_TASKS);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const { entries, upsertEntry, getEntry } = useWeeklyHistory();
  const { profile } = useReflectionProfile();
  const { generateInsight, isGenerating, error: aiError } = useAIInsights();

  const defaultReflection: WeeklyReflectionInput = useMemo(
    () => ({
      wins: '',
      challenges: '',
      learnings: '',
      mood: 'neutral',
      energy: 'balanced',
      focusNextWeek: '',
      notes: '',
    }),
    []
  );

  const existingEntry = useMemo<WeekHistoryEntry | undefined>(
    () => getEntry(currentWeek, new Date().getFullYear()),
    [getEntry, currentWeek]
  );

  const [reflection, setReflection] = useState<WeeklyReflectionInput>(existingEntry?.reflection ?? defaultReflection);
  const [currentInsight, setCurrentInsight] = useState<AIInsight | undefined>(existingEntry?.aiInsight);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | undefined>(existingEntry?.createdAt);

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

  const getTasksByCategory = (category: keyof CategoryGoals | 'private' | 'other') => {
    return tasks.filter(task => task.category === category);
  };

  const calculateCompletionRate = () => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100);
  };

  const calculateCategoryProgress = (category: keyof CategoryGoals | 'private' | 'other') => {
    const categoryTasks = getTasksByCategory(category);
    if (categoryTasks.length === 0) return 0;
    return Math.round((categoryTasks.filter(task => task.completed).length / categoryTasks.length) * 100);
  };

  const handleReflectionChange = (updates: Partial<WeeklyReflectionInput>) => {
    setReflection((prev) => ({ ...prev, ...updates }));
    setSaveStatus('idle');
  };

  const handleSaveReflection = async () => {
    try {
      setSaveStatus('saving');
      setSaveError(null);

      const entry = createHistoryEntry({
        weekNumber: currentWeek,
        year: new Date().getFullYear(),
        dateRange,
        tasks,
        reflection,
        insight: currentInsight,
        existingEntry,
      });

      upsertEntry(entry);
      setLastSavedAt(entry.createdAt);
      setSaveStatus('saved');
    } catch (error) {
      console.error('[Reflection] Failed to save history', error);
      setSaveStatus('error');
      setSaveError('振り返りの保存に失敗しました。再度お試しください。');
    }
  };

  const handleGenerateInsight = async () => {
    try {
      const metricsEntry = createHistoryEntry({
        weekNumber: currentWeek,
        year: new Date().getFullYear(),
        dateRange,
        tasks,
        reflection,
        existingEntry,
      });

      const insight = await generateInsight({
        profile,
        metrics: metricsEntry.metrics,
        reflection,
        tasks,
      });

      setCurrentInsight(insight);
      const entryWithInsight = {
        ...metricsEntry,
        aiInsight: insight,
      };
      upsertEntry(entryWithInsight);
      setLastSavedAt(entryWithInsight.createdAt);
      setSaveStatus('saved');
    } catch (error) {
      console.error('[AI] Insight generation failed', error);
      setSaveStatus('error');
      setSaveError(aiError || 'AI提案の生成に失敗しました。');
    }
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ProgressCard
                  title="全体進捗"
                  current={calculateCompletionRate()}
                  target={100}
                  unit="%"
                  trend={5}
                  color="cyan"
                />
                <ProgressCard
                  title="note"
                  current={typeof goals.note.current === 'number' ? goals.note.current : 0}
                  target={typeof goals.note.target === 'number' ? goals.note.target : 0}
                  unit={goals.note.unit}
                  trend={8}
                  color="teal"
                />
                <ProgressCard
                  title="standFM"
                  current={typeof goals.standfm.current === 'number' ? goals.standfm.current : 0}
                  target={typeof goals.standfm.target === 'number' ? goals.standfm.target : 0}
                  unit={goals.standfm.unit}
                  trend={12}
                  color="orange"
                />
                <ProgressCard
                  title="Instagram"
                  current={typeof goals.instagram.current === 'number' ? goals.instagram.current : 0}
                  target={typeof goals.instagram.target === 'number' ? goals.instagram.target : 0}
                  unit={goals.instagram.unit}
                  trend={5}
                  color="pink"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <ProgressCard
                  title="YouTube"
                  current={typeof goals.youtube.current === 'number' ? goals.youtube.current : 0}
                  target={typeof goals.youtube.target === 'number' ? goals.youtube.target : 0}
                  unit={goals.youtube.unit}
                  trend={15}
                  color="red"
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
                  title="ビジネス"
                  current={calculateCategoryProgress('business')}
                  target={100}
                  unit="%"
                  trend={12}
                  color="yellow"
                />
                <ProgressCard
                  title="TOPFORM"
                  current={typeof goals.topform.current === 'number' ? goals.topform.current : 0}
                  target={typeof goals.topform.target === 'number' ? goals.topform.target : 0}
                  unit={goals.topform.unit}
                  trend={3}
                  color="gray"
                />
              </div>
            </section>

            {/* Task Categories */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white">タスク管理</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TaskCategory
                  category="note"
                  categoryName="note"
                  tasks={getTasksByCategory('note')}
                  onTaskToggle={handleTaskToggle}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskAdd={() => setIsTaskModalOpen(true)}
                  onTaskMove={handleTaskMove}
                  progress={calculateCategoryProgress('note')}
                />
                <TaskCategory
                  category="standfm"
                  categoryName="standFM"
                  tasks={getTasksByCategory('standfm')}
                  onTaskToggle={handleTaskToggle}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskAdd={() => setIsTaskModalOpen(true)}
                  onTaskMove={handleTaskMove}
                  progress={calculateCategoryProgress('standfm')}
                />
                <TaskCategory
                  category="instagram"
                  categoryName="Instagram"
                  tasks={getTasksByCategory('instagram')}
                  onTaskToggle={handleTaskToggle}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskAdd={() => setIsTaskModalOpen(true)}
                  onTaskMove={handleTaskMove}
                  progress={calculateCategoryProgress('instagram')}
                />
                <TaskCategory
                  category="youtube"
                  categoryName="YouTube"
                  tasks={getTasksByCategory('youtube')}
                  onTaskToggle={handleTaskToggle}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskAdd={() => setIsTaskModalOpen(true)}
                  onTaskMove={handleTaskMove}
                  progress={calculateCategoryProgress('youtube')}
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
                <TaskCategory
                  category="private"
                  categoryName="プライベート"
                  tasks={getTasksByCategory('private')}
                  onTaskToggle={handleTaskToggle}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskAdd={() => setIsTaskModalOpen(true)}
                  onTaskMove={handleTaskMove}
                  progress={calculateCategoryProgress('private')}
                />
                <TaskCategory
                  category="other"
                  categoryName="その他"
                  tasks={getTasksByCategory('other')}
                  onTaskToggle={handleTaskToggle}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskAdd={() => setIsTaskModalOpen(true)}
                  onTaskMove={handleTaskMove}
                  progress={calculateCategoryProgress('other')}
                />
              </div>
            </section>

            <section className="space-y-6">
              <ReflectionForm
                value={reflection}
                onChange={handleReflectionChange}
                onSave={handleSaveReflection}
                onGenerateInsight={handleGenerateInsight}
                isSaving={saveStatus === 'saving'}
                isGeneratingInsight={isGenerating}
                lastSavedAt={lastSavedAt}
              />

              {saveStatus === 'error' && saveError && (
                <div className="card border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
                  {saveError}
                </div>
              )}

              <AIInsightPanel
                insight={currentInsight}
                error={aiError}
                onRegenerate={handleGenerateInsight}
                isGenerating={isGenerating}
              />
            </section>

            {/* SNS Goals Weekly Update */}
            <section className="space-y-6">
              <SNSGoalsEditor />
            </section>

            {/* Long-term Goals */}
            <section className="space-y-6">
              <LongTermGoalsPanel />
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
            {entries.length === 0 ? (
              <div className="card p-6 text-slate-400">
                まだ履歴はありません。週次リフレクションを保存するとここに表示されます。
              </div>
            ) : (
              <div className="grid gap-4">
                {entries
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <div key={entry.id} className="card card-hover p-5 space-y-4">
                      <header className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            第{entry.weekNumber}週 {entry.dateRange}
                          </h3>
                          <p className="text-xs text-slate-400">
                            保存: {new Date(entry.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-sm text-slate-300">
                          完了率: <span className="text-primary-cyan font-semibold">{entry.metrics.completionRate}%</span>
                        </div>
                      </header>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-200">
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold uppercase text-primary-cyan">Wins</h4>
                          <p className="leading-relaxed bg-slate-900/50 border border-slate-700/60 rounded-lg p-3">
                            {entry.reflection.wins || '—'}
                          </p>
                          <h4 className="text-xs font-semibold uppercase text-primary-cyan">Challenges</h4>
                          <p className="leading-relaxed bg-slate-900/50 border border-slate-700/60 rounded-lg p-3">
                            {entry.reflection.challenges || '—'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold uppercase text-primary-cyan">Learnings</h4>
                          <p className="leading-relaxed bg-slate-900/50 border border-slate-700/60 rounded-lg p-3">
                            {entry.reflection.learnings || '—'}
                          </p>
                          <h4 className="text-xs font-semibold uppercase text-primary-cyan">Focus Next Week</h4>
                          <p className="leading-relaxed bg-slate-900/50 border border-slate-700/60 rounded-lg p-3">
                            {entry.reflection.focusNextWeek || '—'}
                          </p>
                        </div>
                      </div>

                      {entry.aiInsight && (
                        <div className="border border-primary-green/30 bg-primary-green/10 rounded-lg p-4 text-sm text-slate-100">
                          <div className="text-xs uppercase tracking-wide text-primary-green/80 mb-2">AI Insight</div>
                          <div className="space-y-2">
                            <p className="font-medium text-primary-cyan">{entry.aiInsight.summary}</p>
                            <ul className="list-disc pl-5 space-y-1">
                              {entry.aiInsight.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
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