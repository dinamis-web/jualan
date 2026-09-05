import React, { useState } from 'react';
import { TargetSettings, ClosingRecord, Prospect } from '../../types';
import { formatRupiah, parseRupiahInput } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';
import { Trophy, CheckCircle2, ArrowRight, Sparkles, History } from 'lucide-react';

interface ScreenResultClosingProps {
  targetSettings: TargetSettings;
  closingHistory: ClosingRecord[];
  onRecordClosing: (record: Omit<ClosingRecord, 'id' | 'date'>) => void;
  onGoToActions: () => void;
  prefillProspect?: Prospect | null;
}

const SOURCES = [
  'Customer lama',
  'Referral',
  'WhatsApp',
  'TikTok',
  'Instagram',
  'Direct outreach',
  'Lainnya',
];

export const ScreenResultClosing: React.FC<ScreenResultClosingProps> = ({
  targetSettings,
  closingHistory,
  onRecordClosing,
  onGoToActions,
  prefillProspect,
}) => {
  const [customerName, setCustomerName] = useState(prefillProspect ? prefillProspect.name : 'Budi');
  const [saleAmountStr, setSaleAmountStr] = useState(
    prefillProspect ? prefillProspect.potential.toString() : '300.000'
  );
  const [profitStr, setProfitStr] = useState('100.000');
  const [source, setSource] = useState('Customer lama');
  const [celebrationData, setCelebrationData] = useState<{
    previousAmount: number;
    newAmount: number;
    targetAmount: number;
    addedAmount: number;
  } | null>(null);

  const saleVal = parseRupiahInput(saleAmountStr) || 300000;
  const profitVal = parseRupiahInput(profitStr) || 100000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const prev = targetSettings.achievedAmount;
    const added = profitVal > 0 ? profitVal : saleVal;
    const nextAmount = prev + added;

    onRecordClosing({
      customerName: customerName.trim(),
      saleAmount: saleVal,
      profitCommission: profitVal,
      source,
      prospectId: prefillProspect ? prefillProspect.id : undefined,
    });

    setCelebrationData({
      previousAmount: prev,
      newAmount: nextAmount,
      targetAmount: targetSettings.targetAmount,
      addedAmount: added,
    });
  };

  const handleContinue = () => {
    setCelebrationData(null);
    onGoToActions();
  };

  // CELEBRATION STATE AFTER CLOSING
  if (celebrationData) {
    const remaining = Math.max(celebrationData.targetAmount - celebrationData.newAmount, 0);
    const progress = Math.min(
      Math.round((celebrationData.newAmount / celebrationData.targetAmount) * 100),
      100
    );

    return (
      <div className="p-5 max-w-md mx-auto space-y-6 text-center animate-in zoom-in-95 duration-300 pb-20 pt-6">
        {/* Badge Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-[#10B981]/15 border-2 border-[#10B981] flex items-center justify-center mx-auto text-[#10B981] shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <Sparkles className="w-6 h-6 text-[#F59E0B] absolute -top-1 -right-1" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
            CLOSING BERHASIL DICATAT
          </span>
          <h2 id="celebration-title" className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase mt-1">
            TARGET MAKIN DEKAT
          </h2>
          <p className="text-xs text-gray-300 mt-2">
            Hebat! Penambahan <span className="font-bold font-mono text-[#10B981]">+{formatRupiah(celebrationData.addedAmount)}</span> menggeser posisimu lebih dekat ke target bulan ini.
          </p>
        </div>

        {/* Numbers Comparison Card */}
        <div className="p-5 rounded-2xl bg-[#1A1A1A] border border-white/10 space-y-4 text-left shadow-xl">
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-gray-400 font-sans font-medium">Sebelumnya:</span>
              <p className="text-sm font-bold text-gray-400 line-through">
                {formatRupiah(celebrationData.previousAmount)}
              </p>
            </div>
            <div>
              <span className="text-gray-400 font-sans font-medium">Sekarang:</span>
              <p className="text-lg font-bold text-[#10B981]">
                {formatRupiah(celebrationData.newAmount)}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-mono">
              <span>Progres Target</span>
              <span className="font-bold text-white">{progress}%</span>
            </div>
            <ProgressBar progressPercentage={progress} height="md" color="emerald" />
          </div>

          <div className="pt-2 border-t border-white/10 text-center font-mono">
            <span className="text-xs text-gray-400 font-sans">Sisa kekurangan:</span>
            <p className="text-xl font-bold text-white mt-0.5">
              {remaining === 0 ? 'TARGET 100% TERCAPAI!' : `Masih ${formatRupiah(remaining)} lagi.`}
            </p>
          </div>
        </div>

        {/* CTA to Actions */}
        <button
          id="btn-celebration-continue"
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-[#10B981] hover:bg-emerald-400 text-black shadow-[0_4px_24px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <span>LIHAT ACTION BERIKUTNYA</span>
          <ArrowRight className="w-4 h-4 stroke-[3px]" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 max-w-md mx-auto space-y-5 animate-in fade-in duration-300 pb-24">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981]">
          PENCATATAN HASIL NYATA
        </span>
        <h2 id="screen-closing-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">
          CATAT HASIL
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Catat closing penjualan agar angka targetmu langsung terbarui otomatis.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-[#1A1A1A] p-5 rounded-2xl border border-white/10 shadow-xl">
        {/* Nama Customer */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Nama Customer <span className="text-[#10B981]">*</span>
          </label>
          <input
            id="input-closing-customer-name"
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Contoh: Budi"
            className="w-full bg-[#262626] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Nilai Penjualan */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Nilai Penjualan (Omzet) <span className="text-[#10B981]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-sm font-bold text-gray-400 font-mono">Rp</span>
            <input
              id="input-closing-sale-amount"
              type="text"
              required
              value={formatRupiah(saleVal).replace('Rp', '')}
              onChange={(e) => setSaleAmountStr(e.target.value)}
              className="w-full bg-[#262626] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#10B981]"
            />
          </div>
        </div>

        {/* Profit / Komisi */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Profit / Komisi (Dihitung ke Target)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-sm font-bold text-[#10B981] font-mono">Rp</span>
            <input
              id="input-closing-profit-amount"
              type="text"
              required
              value={formatRupiah(profitVal).replace('Rp', '')}
              onChange={(e) => setProfitStr(e.target.value)}
              className="w-full bg-[#262626] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold text-[#10B981] focus:outline-none focus:border-[#10B981]"
            />
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block font-mono">
            Nominal inilah yang akan mengurangi kekurangan targetmu.
          </span>
        </div>

        {/* Sumber */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">
            Sumber Penjualan
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SOURCES.map((s) => {
              const isSelected = source === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSource(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all font-mono ${
                    isSelected
                      ? 'bg-[#10B981] text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Button */}
        <button
          id="btn-submit-closing"
          type="submit"
          className="w-full mt-3 py-3.5 px-5 rounded-xl font-bold text-sm bg-[#10B981] hover:bg-emerald-400 text-black shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <Trophy className="w-4 h-4 fill-black" />
          <span>CATAT CLOSING</span>
        </button>
      </form>

      {/* RECENT CLOSINGS HISTORY */}
      {closingHistory.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <History className="w-4 h-4 text-gray-400" />
            <span>Riwayat Closing Terbaru</span>
          </div>

          <div className="space-y-2.5">
            {closingHistory.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-gradient-to-r from-[#10B981]/15 to-[#1A1A1A] border-l-4 border-[#10B981] border border-white/5 flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] font-bold text-[#10B981] uppercase mb-0.5">Closing Berhasil</div>
                  <h4 className="text-sm font-bold text-white">{rec.customerName}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5 font-mono">
                    <span>{rec.source}</span>
                    <span>•</span>
                    <span>{rec.date}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <p className="text-sm font-bold text-[#10B981]">
                    +{formatRupiah(rec.profitCommission)}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Nilai: {formatRupiah(rec.saleAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
