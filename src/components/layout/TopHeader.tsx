import React from 'react';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { ActiveScreen } from '../../types';

interface TopHeaderProps {
  currentScreen: ActiveScreen;
  onBack?: () => void;
  onResetDemo: () => void;
  onRestartJourney: () => void;
  targetPercent: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentScreen,
  onBack,
  onResetDemo,
  onRestartJourney,
  targetPercent,
}) => {
  const isSubScreen = currentScreen === 'money-leak' || currentScreen === 'prospect-detail';

  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md border-b border-white/10 px-4 py-3"
    >
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-2">
          {isSubScreen && onBack ? (
            <button
              id="btn-header-back"
              onClick={onBack}
              className="p-1.5 -ml-1 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-[#10B981]" />
              <span>Kembali</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center font-extrabold text-black text-xs tracking-tight shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                D
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
                  DINAMIS <span className="text-[#10B981]">MONEY</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-medium leading-none mt-1">
                  Cari jualan berikutnya.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Target Progress Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-gray-300">
            <span className="text-gray-500">Target:</span>
            <span className="font-bold text-[#10B981]">{targetPercent}%</span>
          </div>

          {/* Demo Actions Dropdown / Pill */}
          <div className="flex items-center gap-1">
            <button
              id="btn-restart-journey"
              onClick={onRestartJourney}
              title="Mulai Ulang Alur Onboarding"
              className="px-2 py-1 text-[10px] font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors flex items-center gap-1 uppercase tracking-wider"
            >
              <Sparkles className="w-3 h-3 text-[#10B981]" />
              <span className="hidden xs:inline">Alur</span> Awal
            </button>

            <button
              id="btn-reset-demo"
              onClick={onResetDemo}
              title="Reset Data Demo ke Awal"
              className="p-1.5 text-gray-400 hover:text-[#F59E0B] hover:bg-white/5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
