import type { LongTermGoals } from '../types';

export const INITIAL_LONG_TERM_GOALS: LongTermGoals = {
  phases: [
    {
      id: 'phase-1',
      title: 'Phase 1: 基盤確立',
      period: '2025-2026',
      description: 'ビジネスの基盤を確立し、安定した収益とメソッドを構築する',
      currentPhase: true,
      goals: [
        {
          id: 'phase1-revenue',
          title: '月収¥500,000達成',
          target: '¥500,000/月',
          description: '安定した月収50万円を達成し、経済的基盤を確立',
          isAchieved: false
        },
        {
          id: 'phase1-method',
          title: '石原メソッド確立',
          description: 'INTJ特性を活かした独自のパーソナルトレーニングメソッドを確立',
          isAchieved: false
        },
        {
          id: 'phase1-online',
          title: 'オンラインサービス開始',
          description: 'オンラインでのサービス提供体制を構築し、地理的制約を緩和',
          isAchieved: false
        },
        {
          id: 'phase1-acquisition',
          title: '新規月2名獲得',
          target: '2名/月',
          description: '安定した新規顧客獲得システムを構築',
          isAchieved: false
        }
      ]
    },
    {
      id: 'phase-2',
      title: 'Phase 2: オンライン特化',
      period: '2027-2028',
      description: 'オンラインサービスを主軸とした事業展開とスケールアップ',
      currentPhase: false,
      goals: [
        {
          id: 'phase2-revenue',
          title: '月収¥700,000-1,000,000',
          target: '¥700,000-1,000,000/月',
          description: '事業規模の拡大により収益を大幅に向上',
          isAchieved: false
        },
        {
          id: 'phase2-partnership',
          title: '企業提携収益構築',
          description: '企業との提携により安定した収益源を確保',
          isAchieved: false
        },
        {
          id: 'phase2-geographic',
          title: '地理的制約克服',
          description: '全国・海外の顧客にサービス提供可能な体制を確立',
          isAchieved: false
        },
        {
          id: 'phase2-community',
          title: 'コミュニティ運営',
          description: '顧客同士のコミュニティを形成し、継続率向上とブランド力強化',
          isAchieved: false
        }
      ]
    },
    {
      id: 'phase-3',
      title: 'Phase 3: 統合プロデューサー',
      period: '2029-2030',
      description: '業界のリーダーとして影響力を持ち、次世代育成に貢献',
      currentPhase: false,
      goals: [
        {
          id: 'phase3-revenue',
          title: '月収¥1,000,000以上',
          target: '¥1,000,000+/月',
          description: '業界トップクラスの収益を安定的に維持',
          isAchieved: false
        },
        {
          id: 'phase3-publishing',
          title: '書籍出版・講演',
          description: '専門知識を書籍化し、講演活動で影響力を拡大',
          isAchieved: false
        },
        {
          id: 'phase3-education',
          title: 'トレーナー育成',
          description: '石原メソッドを継承する次世代トレーナーの育成システム構築',
          isAchieved: false
        },
        {
          id: 'phase3-recognition',
          title: '業界認知度確立',
          description: 'パーソナルトレーニング業界での権威としての地位確立',
          isAchieved: false
        }
      ]
    }
  ],
  lastUpdated: new Date().toISOString()
};