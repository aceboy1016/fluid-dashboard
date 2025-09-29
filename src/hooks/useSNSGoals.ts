import { useCallback } from 'react';
import type { CategoryGoals } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { INITIAL_GOALS } from '../constants/categories';

interface SNSGoalsHistory {
  date: string;
  weekNumber: number;
  year: number;
  goals: CategoryGoals;
}

export const useSNSGoals = () => {
  const [goals, setGoalsStorage] = useLocalStorage<CategoryGoals>('strategic-todo-goals', INITIAL_GOALS);
  const [history, setHistoryStorage] = useLocalStorage<SNSGoalsHistory[]>('sns-goals-history', []);

  const updateGoals = useCallback((newGoals: CategoryGoals) => {
    if (!goals) return;

    // 現在の週情報を取得
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

    // 履歴に現在のデータを保存（更新前の状態）
    const historyEntry: SNSGoalsHistory = {
      date: new Date().toISOString(),
      weekNumber,
      year: now.getFullYear(),
      goals: { ...goals }
    };

    setHistoryStorage(prev => {
      if (!prev) return [historyEntry];

      // 同じ週のエントリがあるかチェック
      const existingIndex = prev.findIndex(
        entry => entry.weekNumber === weekNumber && entry.year === now.getFullYear()
      );

      if (existingIndex >= 0) {
        // 同じ週のエントリを更新
        const updated = [...prev];
        updated[existingIndex] = historyEntry;
        return updated;
      } else {
        // 新しいエントリを追加（最新10週分のみ保持）
        return [historyEntry, ...prev].slice(0, 10);
      }
    });

    // 新しい目標を保存
    setGoalsStorage(newGoals);
  }, [goals, setGoalsStorage, setHistoryStorage]);

  const getWeeklyGrowth = useCallback((platform: keyof CategoryGoals): number => {
    if (!history || history.length < 2 || !goals) return 0;

    const currentValue = typeof goals[platform].current === 'number' ? goals[platform].current : 0;
    const previousGoal = history[0]?.goals[platform];
    const previousValue = previousGoal && typeof previousGoal.current === 'number'
      ? previousGoal.current
      : currentValue;

    return currentValue - previousValue;
  }, [goals, history]);

  const getGrowthTrend = useCallback((platform: keyof CategoryGoals, weeks: number = 4): number[] => {
    if (!history || !goals) return [];

    const trend: number[] = [];
    const sortedHistory = [...history].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // 現在の値も含める
    const currentValue = typeof goals[platform].current === 'number' ? goals[platform].current : 0;
    trend.push(currentValue);

    // 過去のデータを追加
    for (let i = 0; i < Math.min(weeks - 1, sortedHistory.length); i++) {
      const historicalGoal = sortedHistory[i].goals[platform];
      const value = historicalGoal && typeof historicalGoal.current === 'number'
        ? historicalGoal.current
        : 0;
      trend.push(value);
    }

    return trend.reverse(); // 古い順に並び替え
  }, [goals, history]);

  const getLastUpdateInfo = useCallback(() => {
    if (!history || history.length === 0) return null;

    const lastUpdate = history[0];
    return {
      date: new Date(lastUpdate.date).toLocaleDateString('ja-JP'),
      weekNumber: lastUpdate.weekNumber,
      year: lastUpdate.year
    };
  }, [history]);

  return {
    goals: goals || INITIAL_GOALS,
    history: history || [],
    updateGoals,
    getWeeklyGrowth,
    getGrowthTrend,
    getLastUpdateInfo
  };
};