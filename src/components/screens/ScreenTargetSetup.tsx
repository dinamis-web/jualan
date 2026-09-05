import React, { useState } from 'react';
import { TargetSettings } from '../../types';
import { formatRupiah, parseRupiahInput, calculateProgressPercentage } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';
import { ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';

interface ScreenTargetSetupProps {
  initialSettings: TargetSettings;
  onSaveAndNext: (settings: TargetSettings) => void;
  onBack: () => void;
}

export const ScreenTargetSetup: React.FC<ScreenTargetSetupProps> = ({
  initialSettings,
  onSaveAndNext,
}) => {
  const [targetStr, setTargetStr] = useState(initialSettings.targetAmount.toString());
  const [achievedStr, setAchievedStr] = useState(initialSettings.achievedAmount.toString());
  const [avgCommissionStr, setAvgCommissionStr] = useState(initialSettings.avgCommission.toString());
  const [hasCalculated, setHasCalculated] = useState(true);

  const targetAmount = parseRupiahInput(targetStr);
  const achievedAmount = parseRupiahInput(achievedStr);
  const avgCommission = parseRupiahInput(avgCommissionStr) || 100000;

  const gap = Math.max(targetAmount - achievedAmount, 0);
  const salesNeeded = Math.ceil(gap / avgCommission);
  const progressPercent = calculateProgressPercentage(achievedAmount, targetAmount);

  const handleCalculate = () => {
    setHasCalculated(true);
  };

  const handleContinue = () => {
    onSaveAndNext({
      monthName: initialSettings.monthName,
      targetAmount,
      achievedAmount,
      avgCommission,
    });
  };

  return (
    <div className="p-5 max-w-md mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Langkah 1 dari 3 — MONEY TARGET
        </span>
        <span className="text-xs text-slate-400">Setup Target</span>
      </div>

      <div>
        <h2 id="screen-target-title" className="text-2xl font-black text-white tracking-tight uppercase">
          Berapa targetmu bulan ini?
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Tentukan target untuk bulan {initialSettings.monthName} agar DINAMIS bisa memecahnya ke aksi harian.
        </p>
      </div>

      {/* Inputs Form */}
      <div className="space-y-4 bg-[#1A1A1A] p-5 rounded-2xl border border-white/10 shadow-xl">
        {/* Target bulan ini */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Target bulan ini
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-sm font-bold text-gray-400 font-mono">Rp</span>
            <input
              id="input-target-amount"
              type="text"
              value={formatRupiah(targetAmount).replace('Rp', '')}
              onChange={(e) => {
                setTargetStr(e.target.value);
              }}
              className="w-full bg-[#262626] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-base font-mono font-bold text-white focus:outline-none focus:border-[#10B981]"
            />
          </div>
        </div>

        {/* Sudah tercapai */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Sudah tercapai
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-sm font-bold text-[#10B981] font-mono">Rp</span>
            <input
              id="input-achieved-amount"
              type="text"
              value={formatRupiah(achievedAmount).replace('Rp', '')}
              onChange={(e) => {
                setAchievedStr(e.target.value);
              }}
              className="w-full bg-[#262626] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-base font-mono font-bold text-[#10B981] focus:outline-none focus:border-[#10B981]"
            />
          </div>
        </div>

        {/* Rata-rata untung / komisi */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Rata-rata untung / komisi per penjualan
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-sm font-bold text-gray-400 font-mono">Rp</span>
            <input
              id="input-avg-commission"
              type="text"
              value={formatRupiah(avgCommission).replace('Rp', '')}
              onChange={(e) => {
                setAvgCommissionStr(e.target.value);
              }}
              className="w-full bg-[#262626] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-base font-mono font-bold text-white focus:outline-none focus:border-[#10B981]"
            />
          </div>
        </div>

        <button
          id="btn-calculate-target"
          type="button"
          onClick={handleCalculate}
          className="w-full py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/10 flex items-center justify-center gap-2 transition-colors active:scale-98"
        >
          <Calculator className="w-4 h-4 text-[#10B981]" />
          <span>HITUNG TARGET SAYA</span>
        </button>
      </div>

      {/* Result Card */}
      {hasCalculated && (
        <div
          id="target-result-card"
          className="p-5 rounded-2xl bg-[#1A1A1A] border border-[#10B981]/30 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex justify-between items-center font-mono">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              TARGET {initialSettings.monthName.toUpperCase()}
            </span>
            <span className="text-xs font-bold text-white">
              {formatRupiah(achievedAmount)} / {formatRupiah(targetAmount)}
            </span>
          </div>

          {/* Progress bar */}
          <div>
            <ProgressBar progressPercentage={progressPercent} height="md" />
            <div className="flex justify-between text-xs text-gray-400 mt-1.5 font-mono">
              <span>Progres: {progressPercent}%</span>
              <span>{gap === 0 ? 'Target Tercapai!' : `Kurang ${formatRupiah(gap)}`}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-gray-400">Masih kurang</p>
            <p className="text-2xl font-mono font-bold text-white tracking-tight mt-0.5">
              {formatRupiah(gap)}
            </p>

            <p className="text-xs text-gray-300 mt-3 leading-relaxed">
              Dengan rata-rata <span className="font-mono font-bold text-white">{formatRupiah(avgCommission)}</span> per penjualan, kamu membutuhkan sekitar
            </p>

            <div className="mt-2 p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-center">
              <p className="text-xl font-mono font-bold text-[#10B981] tracking-tight">
                {salesNeeded} PENJUALAN LAGI
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            id="btn-target-continue"
            type="button"
            onClick={handleContinue}
            className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-[#10B981] hover:bg-emerald-400 text-black shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 active:scale-98 mt-2"
          >
            <span>LANJUT</span>
            <ArrowRight className="w-4 h-4 stroke-[3px]" />
          </button>
        </div>
      )}
    </div>
  );
};
