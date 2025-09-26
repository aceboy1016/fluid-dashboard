import type { WeekData, AnalyticsData, PerformancePattern, EnergyPattern, WeeklyTrend, InsightData } from '../types';
import { PRIORITY_WEIGHTS, ENERGY_MULTIPLIERS } from '../constants/categories';

export const calculateLearningEfficiency = (weekData: WeekData[]): number => {
  let totalLearningTasks = 0;
  let completedLearningTasks = 0;
  let totalWeightedScore = 0;

  weekData.forEach(week => {
    week.tasks.forEach(task => {
      if (task.category === 'expertise' || task.title.toLowerCase().includes('学習') || task.title.toLowerCase().includes('理論')) {
        totalLearningTasks++;
        if (task.completed) {
          completedLearningTasks++;
          totalWeightedScore += PRIORITY_WEIGHTS[task.priority] * ENERGY_MULTIPLIERS[task.energy];
        }
      }
    });
  });

  if (totalLearningTasks === 0) return 0;
  const weeks = weekData.length || 1;
  return Math.round((totalWeightedScore / weeks) * 100) / 100;
};

export const calculateSystemBuildingProgress = (weekData: WeekData[]): number => {
  let totalSystemTasks = 0;
  let completedSystemTasks = 0;

  weekData.forEach(week => {
    week.tasks.forEach(task => {
      if (task.title.toLowerCase().includes('システム') ||
          task.title.toLowerCase().includes('ツール') ||
          task.title.toLowerCase().includes('テンプレート') ||
          task.title.toLowerCase().includes('アセスメント')) {
        totalSystemTasks++;
        if (task.completed) {
          completedSystemTasks++;
        }
      }
    });
  });

  if (totalSystemTasks === 0) return 0;
  return Math.round((completedSystemTasks / totalSystemTasks) * 100);
};

export const calculateEnergyOptimization = (weekData: WeekData[]): number => {
  let totalTasks = 0;
  let totalCompletionRate = 0;
  let highEnergyTasks = 0;
  let highEnergyCompletedTasks = 0;

  weekData.forEach(week => {
    week.tasks.forEach(task => {
      totalTasks++;
      if (task.completed) totalCompletionRate++;

      if (task.energy === 'high') {
        highEnergyTasks++;
        if (task.completed) {
          highEnergyCompletedTasks++;
        }
      }
    });
  });

  if (totalTasks === 0 || highEnergyTasks === 0) return 0;

  const overallCompletionRate = totalCompletionRate / totalTasks;
  const highEnergyCompletionRate = highEnergyCompletedTasks / highEnergyTasks;

  return Math.round((highEnergyCompletionRate / overallCompletionRate) * 100) / 100;
};

export const calculateStrategicAlignment = (weekData: WeekData[]): number => {
  let totalPriorityTasks = 0;
  let completedPriorityTasks = 0;

  weekData.forEach(week => {
    week.tasks.forEach(task => {
      if (task.priority === 'S' || task.priority === 'A') {
        totalPriorityTasks++;
        if (task.completed) {
          completedPriorityTasks++;
        }
      }
    });
  });

  if (totalPriorityTasks === 0) return 0;
  return Math.round((completedPriorityTasks / totalPriorityTasks) * 100);
};

export const analyzePerformancePattern = (weekData: WeekData[]): PerformancePattern => {
  const categoryPerformance: Record<string, { completed: number; total: number }> = {};
  let totalWeeks = weekData.length;
  let totalCompletionRate = 0;

  weekData.forEach(week => {
    let weekCompleted = 0;
    let weekTotal = 0;

    week.tasks.forEach(task => {
      weekTotal++;
      if (task.completed) weekCompleted++;

      if (!categoryPerformance[task.category]) {
        categoryPerformance[task.category] = { completed: 0, total: 0 };
      }
      categoryPerformance[task.category].total++;
      if (task.completed) {
        categoryPerformance[task.category].completed++;
      }
    });

    totalCompletionRate += weekTotal > 0 ? weekCompleted / weekTotal : 0;
  });

  const categoryRates = Object.entries(categoryPerformance).map(([category, data]) => ({
    category,
    rate: data.total > 0 ? data.completed / data.total : 0
  }));

  const bestPerforming = categoryRates.reduce((best, current) =>
    current.rate > best.rate ? current : best, categoryRates[0]);

  const weakest = categoryRates.reduce((worst, current) =>
    current.rate < worst.rate ? current : worst, categoryRates[0]);

  const averageCompletionRate = totalWeeks > 0 ? totalCompletionRate / totalWeeks : 0;

  // Calculate improvement trend (last 3 weeks vs previous 3 weeks)
  let improvementTrend = 0;
  if (weekData.length >= 6) {
    const recent3 = weekData.slice(-3);
    const previous3 = weekData.slice(-6, -3);

    const recentRate = recent3.reduce((sum, week) => {
      const completed = week.tasks.filter(t => t.completed).length;
      return sum + (week.tasks.length > 0 ? completed / week.tasks.length : 0);
    }, 0) / 3;

    const previousRate = previous3.reduce((sum, week) => {
      const completed = week.tasks.filter(t => t.completed).length;
      return sum + (week.tasks.length > 0 ? completed / week.tasks.length : 0);
    }, 0) / 3;

    improvementTrend = recentRate - previousRate;
  }

  return {
    averageCompletionRate: Math.round(averageCompletionRate * 100),
    bestPerformingCategory: bestPerforming?.category || 'sns',
    weakestCategory: weakest?.category || 'sns',
    improvementTrend: Math.round(improvementTrend * 100)
  };
};

export const analyzeEnergyPattern = (weekData: WeekData[]): EnergyPattern => {
  let highEnergyCompleted = 0;
  const energyData: Record<string, { completed: number; total: number }> = {
    high: { completed: 0, total: 0 },
    medium: { completed: 0, total: 0 },
    low: { completed: 0, total: 0 }
  };

  weekData.forEach(week => {
    week.tasks.forEach(task => {
      energyData[task.energy].total++;
      if (task.completed) {
        energyData[task.energy].completed++;
        if (task.energy === 'high') {
          highEnergyCompleted++;
        }
      }
    });
  });

  const optimalSchedule = [
    '朝一番（9:00-11:00）は高エネルギータスク',
    '午後前半（14:00-16:00）で重要タスク完了',
    '夜（19:00-21:00）は創造的タスク'
  ];

  const totalHigh = energyData.high.total;
  const completedHigh = energyData.high.completed;
  const totalTasks = Object.values(energyData).reduce((sum, data) => sum + data.total, 0);
  const totalCompleted = Object.values(energyData).reduce((sum, data) => sum + data.completed, 0);

  const energyEfficiency = totalTasks > 0 && totalHigh > 0 ?
    (completedHigh / totalHigh) / (totalCompleted / totalTasks) : 1;

  return {
    highEnergyTasksCompleted: highEnergyCompleted,
    optimalEnergySchedule: optimalSchedule,
    energyEfficiencyScore: Math.round(energyEfficiency * 100)
  };
};

export const calculateWeeklyTrends = (weekData: WeekData[]): WeeklyTrend[] => {
  return weekData.map(week => {
    const totalTasks = week.tasks.length;
    const completedTasks = week.tasks.filter(task => task.completed).length;
    const priorityTasks = week.tasks.filter(task => task.priority === 'S' || task.priority === 'A');
    const completedPriorityTasks = priorityTasks.filter(task => task.completed).length;

    return {
      weekNumber: week.weekNumber,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      priorityTasksCompleted: completedPriorityTasks,
      totalTasks: totalTasks
    };
  });
};

export const generateAnalytics = (weekData: WeekData[]): AnalyticsData => {
  return {
    learningEfficiency: calculateLearningEfficiency(weekData),
    systemBuildingProgress: calculateSystemBuildingProgress(weekData),
    energyOptimization: calculateEnergyOptimization(weekData),
    strategicAlignment: calculateStrategicAlignment(weekData),
    performancePattern: analyzePerformancePattern(weekData),
    energyPattern: analyzeEnergyPattern(weekData),
    weeklyTrend: calculateWeeklyTrends(weekData)
  };
};

export const generateInsights = (weekData: WeekData[]): InsightData => {
  const analytics = generateAnalytics(weekData);
  const insights: InsightData = {
    performancePattern: [],
    energyOptimization: [],
    strategicAlignment: [],
    systemBuilding: [],
    recommendations: []
  };

  // Performance Pattern Insights
  if (analytics.performancePattern.averageCompletionRate < 70) {
    insights.performancePattern.push('タスク完了率が70%を下回っています。タスクの細分化を検討してください。');
  }
  if (analytics.performancePattern.improvementTrend > 10) {
    insights.performancePattern.push('素晴らしい改善傾向です！このペースを維持しましょう。');
  } else if (analytics.performancePattern.improvementTrend < -10) {
    insights.performancePattern.push('パフォーマンスが低下気味です。負荷を見直しましょう。');
  }

  // Energy Optimization Insights
  if (analytics.energyOptimization < 1.2) {
    insights.energyOptimization.push('高エネルギータスクの完了率が低いです。時間配分を見直しましょう。');
  }
  if (analytics.energyPattern.energyEfficiencyScore > 120) {
    insights.energyOptimization.push('エネルギー効率が非常に良好です！');
  }

  // Strategic Alignment Insights
  if (analytics.strategicAlignment < 60) {
    insights.strategicAlignment.push('重要タスクの完了率が低いです。優先順位の見直しが必要です。');
  }
  if (analytics.strategicAlignment > 80) {
    insights.strategicAlignment.push('戦略的なタスク実行ができています。継続してください。');
  }

  // System Building Insights
  if (analytics.systemBuildingProgress < 30) {
    insights.systemBuilding.push('システム化が進んでいません。効率化タスクを増やしましょう。');
  }
  if (analytics.systemBuildingProgress > 70) {
    insights.systemBuilding.push('システム化が順調に進んでいます。');
  }

  // General Recommendations
  const recentWeek = weekData[weekData.length - 1];
  if (recentWeek) {
    const highEnergyTasks = recentWeek.tasks.filter(t => t.energy === 'high' && !t.completed);
    if (highEnergyTasks.length > 3) {
      insights.recommendations.push('高エネルギータスクが多すぎます。分散させることを推奨します。');
    }

    const uncompletedSPriority = recentWeek.tasks.filter(t => t.priority === 'S' && !t.completed);
    if (uncompletedSPriority.length > 0) {
      insights.recommendations.push('最重要タスクが未完了です。他のタスクを見直してください。');
    }
  }

  return insights;
};

export const calculatePhaseProgress = (weekData: WeekData[]): number => {
  if (weekData.length === 0) return 0;

  const analytics = generateAnalytics(weekData);

  // Phase progress based on multiple factors
  const factors = [
    analytics.learningEfficiency / 3, // Learning efficiency contributes 33%
    analytics.systemBuildingProgress, // System building is crucial
    analytics.strategicAlignment, // Strategic execution matters
    analytics.performancePattern.averageCompletionRate // Overall performance
  ];

  const overallProgress = factors.reduce((sum, factor) => sum + factor, 0) / factors.length;

  return Math.round(Math.min(overallProgress, 100));
};