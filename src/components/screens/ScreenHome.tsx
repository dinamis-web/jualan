import React from 'react';
import { TargetSettings, Prospect, ActionItem, MainTab } from '../../types';
import { MoneyLeakItem } from '../../data/initialData';
import { formatRupiah, calculateProgressPercentage } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';
import { Radio, AlertTriangle, Flame, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ScreenHomeProps {
  targetSettings: TargetSettings;
  prospects: Prospect[];
  moneyLeaks: MoneyLeakItem[];
  actions: ActionItem[];
  onNavigateTab: (tab: MainTab) => void;
  onOpenMoneyLeak: () => void;
  onOpenTargetEdit: () => void;
}

export const ScreenHome: React.FC<ScreenHomeProps> = ({
  targetSettings,
  prospects,
  moneyLeaks,
  actions,
  onNavigateTab,
  onOpenMoneyLeak,
  onOpenTargetEdit,
}) => {
  const gap = Math.max(targetSettings.targetAmount - targetSettings.achievedAmount, 0);
  const progressPercent = calculateProgressPercentage(
    targetSettings.achievedAmount,
    targetSettings.targetAmount
  );

  // Hot prospects calculations
  const hotProspects = prospects.filter((p) => p.priority === 'HOT' && !p.closed);
  const hotTotalPotential = hotProspects.reduce((acc, p) => acc + p.potential, 0);

  // Money leak calculations (unresolved)
  const activeLeaks = moneyLeaks.filter((l) => !l.resolved);
  const leakTotal = activeLeaks.reduce((acc, l) => acc + l.potential, 0);

  // Actions calculations
  const completedActions = actions.filter((a) => a.isCompleted || a.completedCount >= a.targetCount).length;
  const totalActions = actions.length;

  // Estimated sales/closing count remaining based on average profit or 100k
  const avgTicket = 100000;
  const estimatedSalesLeft = Math.max(Math.ceil(gap / avgTicket), 1);

  return (
    <div className="p-4 sm:p-5 max-w-md mx-auto space-y-4 sm:space-y-5 animate-in fade-in duration-300 pb-20">
      {/* Top Greeting */}
      <div className="flex justify-between items-center pt-1">
        <div>
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Halo, Penjual Handal
          </div>
          <h2 id="home-greeting" className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            Siap kejar target?
          </h2>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-sm font-bold text-[#10B981]">
          DM
        </div>
      </div>

      {/* TARGET PROGRESS HERO CARD */}
      <div
        id="home-target-card"
        className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] p-5 rounded-[24px] border border-white/10 shadow-xl relative overflow-hidden"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            TARGET {targetSettings.monthName.toUpperCase()}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#10B981] font-mono font-bold">
              {formatRupiah(targetSettings.targetAmount)}
            </span>
            <button
              onClick={onOpenTargetEdit}
              className="text-[10px] text-gray-400 hover:text-[#10B981] underline underline-offset-2 font-medium"
            >
              Ubah
            </button>
          </div>
        </div>

        {/* Amount in Big High-Density Font */}
        <div className="mb-2 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
            {formatRupiah(targetSettings.achievedAmount)}
          </span>
          <span className="text-gray-500 text-sm font-medium">
            / {formatRupiah(targetSettings.targetAmount)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/5 rounded-full mb-2 overflow-hidden border border-white/5">
          <div
            className="h-full bg-[#10B981] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Gap info */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-tight mt-2.5 pt-2 border-t border-white/5 font-mono">
          <span>
            {gap === 0
              ? 'Target tercapai penuh! 🏆'
              : `Kurang ${formatRupiah(gap)} (${estimatedSalesLeft} Penjualan Lagi)`}
          </span>
          <span className="text-[#10B981] font-bold">{progressPercent}%</span>
        </div>
      </div>

      {/* TWO-COLUMN HIGH DENSITY GRID: RADAR & LEAK */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* CARD 1 — MONEY RADAR */}
        <div
          id="home-card-radar"
          onClick={() => onNavigateTab('radar')}
          className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 hover:border-[#F59E0B]/30 cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-[#F59E0B]/10 flex items-center justify-center text-[10px] text-[#F59E0B]">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">RADAR</span>
          </div>
          <div className="text-xl font-bold font-mono text-white group-hover:text-[#F59E0B] transition-colors">
            {formatRupiah(hotTotalPotential)}
          </div>
          <div className="text-[10px] text-[#F59E0B] mt-1 font-semibold flex items-center justify-between">
            <span>{hotProspects.length} Peluang Hot</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 2 — MONEY LEAK */}
        <div
          id="home-card-leak"
          onClick={onOpenMoneyLeak}
          className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 hover:border-red-500/30 cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-red-500/10 flex items-center justify-center text-[10px] text-red-500">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">LEAK</span>
          </div>
          <div className="text-xl font-bold font-mono text-white group-hover:text-red-400 transition-colors">
            {formatRupiah(leakTotal)}
          </div>
          <div className="text-[10px] text-red-400 mt-1 font-semibold flex items-center justify-between">
            <span>{activeLeaks.length} Berisiko</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* CARD 3 — HIGH DENSITY ACTION HARI INI */}
      <div
        id="home-card-action"
        className="bg-[#1A1A1A] rounded-2xl sm:rounded-t-[32px] p-5 sm:p-6 border border-white/10 shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#10B981]" />
            <h3 className="font-bold text-sm text-white tracking-tight">ACTION HARI INI</h3>
          </div>
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 font-mono border border-white/5">
            {completedActions} / {totalActions} SELESAI
          </span>
        </div>

        {/* Action Items List */}
        <div className="space-y-2.5">
          {actions.map((act, index) => {
            const isDone = act.isCompleted || act.completedCount >= act.targetCount;
            const isFocus =
              !isDone &&
              index === actions.findIndex((a) => !a.isCompleted && a.completedCount < a.targetCount);

            if (isDone) {
              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#10B981]/20 flex items-center justify-center text-xs text-[#10B981] font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold line-through text-gray-500">{act.title}</div>
                      <div className="text-[10px] text-gray-600 font-mono">
                        Selesai • {act.completedCount}/{act.targetCount}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (isFocus) {
              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 bg-[#262626] rounded-xl border border-[#10B981]/30 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-mono font-bold text-white border border-white/10">
                      {act.code}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{act.title}</div>
                      <div className="text-[10px] text-[#F59E0B] font-semibold">
                        Prioritas Tinggi • {act.completedCount}/{act.targetCount}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateTab('action')}
                    className="bg-[#10B981] hover:bg-emerald-400 text-black text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors active:scale-95"
                  >
                    MULAI
                  </button>
                </div>
              );
            }

            return (
              <div
                key={act.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-mono font-bold text-gray-400 border border-white/5">
                    {act.code}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-300">{act.title}</div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      {act.completedCount}/{act.targetCount} tercapai
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Prominent CTA */}
        <button
          id="btn-home-kejar-target-hari-ini"
          onClick={() => onNavigateTab('action')}
          className="w-full mt-6 bg-[#10B981] hover:bg-emerald-400 text-black font-bold py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.3)] active:scale-98"
        >
          <span>🔥 KEJAR TARGET HARI INI</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
        </button>
      </div>
    </div>
  );
};
