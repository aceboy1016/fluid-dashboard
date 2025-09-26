import React from 'react';
import { BarChart3, Target, Calendar, Download, Upload, Settings } from 'lucide-react';

interface HeaderProps {
  currentWeek: number;
  dateRange: string;
  phase: number;
  onViewChange: (view: 'dashboard' | 'analytics' | 'history') => void;
  currentView: 'dashboard' | 'analytics' | 'history';
  onExport: () => void;
  onImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWeek,
  dateRange,
  phase,
  onViewChange,
  currentView,
  onExport,
  onImport
}) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-primary-cyan" />
              <h1 className="text-2xl font-bold gradient-text">
                戦略TODO
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>第{currentWeek}週</span>
              </div>
              <div className="w-px h-4 bg-slate-600"></div>
              <span>{dateRange}</span>
              <div className="w-px h-4 bg-slate-600"></div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-primary-green"></div>
                <span>Phase {phase}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:block">ダッシュボード</span>
              </div>
            </button>

            <button
              onClick={() => onViewChange('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'analytics'
                  ? 'bg-primary-green/20 text-primary-green border border-primary-green/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:block">分析</span>
              </div>
            </button>

            <button
              onClick={() => onViewChange('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'history'
                  ? 'bg-primary-green/20 text-primary-green border border-primary-green/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:block">履歴</span>
              </div>
            </button>

            <div className="w-px h-8 bg-slate-600 mx-2"></div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={onImport}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                title="データインポート"
              >
                <Upload className="h-4 w-4" />
              </button>

              <button
                onClick={onExport}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                title="データエクスポート"
              >
                <Download className="h-4 w-4" />
              </button>

              <button
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                title="設定"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Info Bar */}
        <div className="md:hidden flex items-center justify-between py-2 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3" />
            <span>第{currentWeek}週 • {dateRange}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-green"></div>
            <span>Phase {phase}</span>
          </div>
        </div>
      </div>
    </header>
  );
};