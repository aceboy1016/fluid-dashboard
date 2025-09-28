import { useCallback, useState } from 'react';
import type {
  AIInsight,
  AIInsightRequest,
  ReflectionProfile,
  Task,
  WeeklyMetricsSnapshot,
  WeeklyReflectionInput,
} from '../types';

const RULE_BASED_ENGINE = 'rule-based' as const;

const summarizeArray = (items: string[], fallback: string) => {
  return items.length > 0 ? items : [fallback];
};

const buildRuleBasedInsight = (params: {
  metrics: WeeklyMetricsSnapshot;
  reflection: WeeklyReflectionInput;
  tasks: Task[];
}): AIInsight => {
  const { metrics, reflection } = params;
  const focusAreas: string[] = [];
  const recommendations: string[] = [];

  if (metrics.completionRate >= 80) {
    focusAreas.push('高い完了率を維持しています。現状のワークフローを継続しましょう。');
  } else if (metrics.completionRate >= 60) {
    focusAreas.push('一定の成果が出ていますが、優先度Sタスクに時間を集中させましょう。');
    recommendations.push('優先度Sタスクを午前中に固定化し、深い集中時間を確保する。');
  } else {
    focusAreas.push('完了率が伸び悩んでいます。タスクのボリュームと重要度を再評価してください。');
    recommendations.push('今週の振り返りをもとに、タスク数を削減して重要案件に集中する。');
  }

  const highEnergyUsage = metrics.energyDistribution.high;
  if (highEnergyUsage <= metrics.totalTasks * 0.25) {
    recommendations.push('高エネルギータスクが少ないため、週初に高強度タスクをまとめるブロックを設定。');
  }

  const topformProgress = metrics.categoryProgress.topform;
  if (topformProgress >= 80) {
    focusAreas.push('TOPFORMの業務は順調です。ルーチン化されているため要点をメモ化しておきましょう。');
  }

  if (reflection.mood === 'low') {
    recommendations.push('気分が落ちているので、意図的に回復時間を確保し、翌週のスタートを軽めに設定。');
  } else if (reflection.mood === 'high') {
    focusAreas.push('気分が高い状態です。この勢いを活かして、次週の高難度タスクに着手する準備を。');
  }

  const summary = `完了率は${metrics.completionRate}%。高優先度タスク完了数は${metrics.highPriorityCompleted}件。`;

  return {
    summary,
    focusAreas: summarizeArray(focusAreas, '主要な進捗ポイントを整理しましょう。'),
    recommendations: summarizeArray(
      recommendations,
      '来週に向けて重要度の高いタスクを3件ほど先にブロックしておきましょう。'
    ),
    encouragement: reflection.wins
      ? `今週の成果：「${reflection.wins}」が大きな勝因です。引き続き集中力を活かしていきましょう。`
      : '今週の成果を振り返り、来週も同様の取り組みを計画しましょう。',
    energyAdvice:
      reflection.energy === 'depleted'
        ? 'エネルギーが消耗しているため、深い集中が不要なタスクは翌週前半に回すと軽く始められます。'
        : 'エネルギーは維持されています。高エネルギー帯のタスクを午前中に配置しましょう。',
    generatedAt: new Date().toISOString(),
    engine: RULE_BASED_ENGINE,
  };
};

const callOpenAI = async (params: {
  request: AIInsightRequest;
  profile: ReflectionProfile;
}): Promise<AIInsight> => {
  const { request, profile } = params;
  if (!profile.openAIApiKey) {
    throw new Error('OpenAI API key is not configured.');
  }

  const model = profile.preferredModel || 'gpt-4o-mini';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${profile.openAIApiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: `You are an AI productivity coach specializing in ${profile.persona} personalities. Provide concise weekly analysis (max 5 bullet points each). Tone: ${profile.tone}.`,
        },
        {
          role: 'user',
          content: JSON.stringify(request),
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = (await response.json()) as any;
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI response missing content.');
  }

  return {
    summary: 'AI提案',
    focusAreas: [content],
    recommendations: [],
    encouragement: '',
    energyAdvice: '',
    generatedAt: new Date().toISOString(),
    engine: 'openai',
  };
};

export const useAIInsights = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsight = useCallback(
    async (params: {
      profile: ReflectionProfile;
      metrics: WeeklyMetricsSnapshot;
      reflection: WeeklyReflectionInput;
      tasks: Task[];
    }): Promise<AIInsight> => {
      const { profile, metrics, reflection, tasks } = params;
      setIsGenerating(true);
      setError(null);

      const request: AIInsightRequest = {
        profile: {
          persona: profile.persona,
          tone: profile.tone,
        },
        metrics,
        reflection,
        tasks,
      };

      try {
        if (profile.openAIApiKey) {
          const aiResponse = await callOpenAI({ request, profile });
          return aiResponse;
        }

        if (!profile.allowRuleFallback) {
          throw new Error('AI提案を生成するには OpenAI API キーが必要です。');
        }

        return buildRuleBasedInsight({ metrics, reflection, tasks });
      } catch (err) {
        console.error('[AIInsights] Failed to generate AI insight:', err);
        const message = err instanceof Error ? err.message : 'AI提案の生成に失敗しました。';

        if (profile.allowRuleFallback) {
          return buildRuleBasedInsight({ metrics, reflection, tasks });
        }

        setError(message);
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    generateInsight,
    isGenerating,
    error,
  };
};
