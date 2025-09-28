import type { Category, Constants, CategoryGoals } from '../types';

export const DEFAULT_CATEGORIES: Record<string, Category> = {
  sns: {
    id: 'sns',
    name: 'SNS',
    color: '#ff6b6b',
    icon: '📱',
    goal: {
      type: 'number',
      target: 2000,
      current: 1850,
      unit: 'フォロワー'
    },
    editable: true
  },
  expertise: {
    id: 'expertise',
    name: '専門性開発',
    color: '#4ecdc4',
    icon: '🎯',
    goal: {
      type: 'text',
      target: '独自メソッド確立',
      current: '理論構築完了',
      unit: ''
    },
    editable: true
  },
  marketing: {
    id: 'marketing',
    name: 'マーケティング',
    color: '#45b7d1',
    icon: '📈',
    goal: {
      type: 'number',
      target: 3,
      current: 1,
      unit: '月間新規契約'
    },
    editable: true
  },
  business: {
    id: 'business',
    name: 'ビジネス',
    color: '#f9ca24',
    icon: '💼',
    goal: {
      type: 'number',
      target: 500000,
      current: 450000,
      unit: '月収（円）'
    },
    editable: true
  },
  topform: {
    id: 'topform',
    name: 'TOPFORM',
    color: '#e74c3c',
    icon: '🏢',
    goal: {
      type: 'percentage',
      target: 100,
      current: 85,
      unit: '月次業務完了率（%）'
    },
    editable: true
  }
};

export const PRIORITY_WEIGHTS = {
  'S': 3,
  'A': 2,
  'B': 1
};

export const ENERGY_MULTIPLIERS = {
  'high': 1.5,
  'medium': 1.0,
  'low': 0.7
};

export const PHASE_THRESHOLDS = [
  25,  // Phase 1 to 2
  50,  // Phase 2 to 3
  75,  // Phase 3 to 4
  90   // Phase 4 to 5
];

export const LOCAL_STORAGE_KEYS = {
  WEEK_DATA: 'ishihara-week-data',
  CATEGORIES: 'ishihara-categories',
  UI_STATE: 'ishihara-ui-state',
  ANALYTICS_CACHE: 'ishihara-analytics-cache'
};

export const CONSTANTS: Constants = {
  CATEGORIES: DEFAULT_CATEGORIES,
  PRIORITY_WEIGHTS,
  ENERGY_MULTIPLIERS,
  PHASE_THRESHOLDS,
  LOCAL_STORAGE_KEYS
};

export const INITIAL_GOALS: CategoryGoals = {
  sns: {
    target: 2000,
    current: 1850,
    label: 'Instagram フォロワー',
    unit: '人'
  },
  expertise: {
    target: '独自メソッド確立',
    current: '理論構築完了',
    label: '専門性開発'
  },
  marketing: {
    target: 3,
    current: 1,
    label: '月間新規契約',
    unit: '件'
  },
  business: {
    target: 500000,
    current: 450000,
    label: '月収',
    unit: '円'
  },
  topform: {
    target: 100,
    current: 85,
    label: 'TOPFORM月次業務',
    unit: '%'
  }
};

// Sample initial tasks for week 39
export const INITIAL_TASKS = [
  {
    id: 1,
    category: 'sns' as const,
    title: 'Instagram リール動画制作（週5本）',
    priority: 'S' as const,
    energy: 'high' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 8,
    notes: '毎日投稿で露出を最大化',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    category: 'expertise' as const,
    title: 'INTJ向けパーソナルトレーニング理論の体系化',
    priority: 'S' as const,
    energy: 'high' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 12,
    notes: '論理的アプローチを重視した独自メソッド',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    category: 'marketing' as const,
    title: 'ターゲット分析とペルソナ設定',
    priority: 'A' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 4,
    notes: 'INTJ特性を活かした戦略的マーケティング',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    category: 'business' as const,
    title: '収益構造の最適化分析',
    priority: 'A' as const,
    energy: 'high' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 6,
    notes: '効率的な収益化モデルの構築',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    category: 'sns' as const,
    title: 'YouTube チャンネル設計',
    priority: 'A' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 5,
    notes: '長期的なコンテンツ戦略',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 6,
    category: 'expertise' as const,
    title: 'クライアント向けアセスメントツール開発',
    priority: 'B' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 8,
    notes: 'データドリブンなアプローチ',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 7,
    category: 'marketing' as const,
    title: 'ウェブサイトSEO最適化',
    priority: 'B' as const,
    energy: 'low' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 3,
    notes: '検索流入を増やす',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 8,
    category: 'business' as const,
    title: '競合分析レポート作成',
    priority: 'B' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 4,
    notes: '差別化ポイントの明確化',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 毎月1日の業務
  {
    id: 9,
    category: 'topform' as const,
    title: '【毎月1日】【半蔵門】体全中会長の継続月数調整',
    priority: 'A' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 1,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 10,
    category: 'topform' as const,
    title: '【毎月1日】【2店舗】月末決済失敗分の対応とsquare確認',
    priority: 'A' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 2,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 11,
    category: 'topform' as const,
    title: '【毎月1日】【2店舗】決済失敗確認',
    priority: 'A' as const,
    energy: 'low' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 1,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 12,
    category: 'topform' as const,
    title: '【毎月1日】笹間さんへ一山中さん入会確認',
    priority: 'B' as const,
    energy: 'low' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 0.5,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 13,
    category: 'topform' as const,
    title: '【毎月1日】翌月HALLEL固定枠確保',
    priority: 'B' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 1,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 毎月3日の業務
  {
    id: 14,
    category: 'topform' as const,
    title: '【毎月3日】個人の楽々精算/勤怠提出',
    priority: 'S' as const,
    energy: 'low' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 1,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 15,
    category: 'topform' as const,
    title: '【毎月3日】勤怠',
    priority: 'S' as const,
    energy: 'low' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 0.5,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 毎月5日の業務
  {
    id: 16,
    category: 'topform' as const,
    title: '【毎月5日】【半蔵門】B日程（10日払い）決済設定→スプレ作成→星野さんへ',
    priority: 'A' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 2,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 17,
    category: 'topform' as const,
    title: '【毎月5日】【2店舗】前月分のsquareデータと取引状況/Amazon購入履歴を笹間さんへ共有',
    priority: 'A' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 1.5,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 18,
    category: 'topform' as const,
    title: '【毎月5日】月例資料の作成開始',
    priority: 'A' as const,
    energy: 'high' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 3,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 19,
    category: 'topform' as const,
    title: '【毎月5日】収支表アップデート（前月実績の売上合計入力・決済手数料の入力・コスト入力）',
    priority: 'A' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 2,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 20,
    category: 'topform' as const,
    title: '【毎月5日】小早&レジートを笹間さんへ郵送（なければ省略）',
    priority: 'B' as const,
    energy: 'low' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 0.5,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 毎月10日の業務
  {
    id: 21,
    category: 'topform' as const,
    title: '【毎月10日】扇田様・崎前様 領収書作成→笹間さん→LINEで送信',
    priority: 'A' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 1,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 22,
    category: 'topform' as const,
    title: '【毎月10日】西川さん 請求書を作成後宮崎さんへ送る',
    priority: 'A' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 1,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 23,
    category: 'topform' as const,
    title: '【毎月10日】当月の月例資料の完成',
    priority: 'S' as const,
    energy: 'high' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 2,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 毎月11日の業務
  {
    id: 24,
    category: 'topform' as const,
    title: '【毎月11日】【半蔵門】B日程の決済失敗確認',
    priority: 'A' as const,
    energy: 'low' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 1,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 毎月20日の業務
  {
    id: 25,
    category: 'topform' as const,
    title: '【毎月20日】【2店舗】営業管理ボードの更新依頼',
    priority: 'B' as const,
    energy: 'low' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 0.5,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 毎月26日の業務
  {
    id: 26,
    category: 'topform' as const,
    title: '【毎月26日】恵比寿/半蔵門 営業管理ボード更新',
    priority: 'A' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 2,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 27,
    category: 'topform' as const,
    title: '【毎月26日】請求書の完成→スプレッドシート出力',
    priority: 'A' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 1.5,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 28,
    category: 'topform' as const,
    title: '予約早見表のリッチメニューサムネ作り',
    priority: 'A' as const,
    energy: 'medium' as const,
    completed: false,
    completedDate: null,
    estimatedHours: 2,
    notes: 'TOPFORM業務',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const COLOR_PALETTE = {
  primary: {
    cyan: '#00b8ff',
    green: '#00ff88',
    gradient: 'linear-gradient(135deg, #00b8ff 0%, #00ff88 100%)'
  },
  background: {
    primary: 'from-gray-900 via-blue-900 to-gray-900',
    card: 'rgba(26, 26, 46, 0.8)',
    hover: 'rgba(26, 26, 46, 0.95)'
  },
  category: {
    sns: '#ff6b6b',
    expertise: '#4ecdc4',
    marketing: '#45b7d1',
    business: '#f9ca24',
    topform: '#e74c3c'
  },
  priority: {
    S: '#ff4757',
    A: '#ffa502',
    B: '#2ed573'
  },
  energy: {
    high: '#00ff88',
    medium: '#ffa502',
    low: '#ff4757'
  }
};