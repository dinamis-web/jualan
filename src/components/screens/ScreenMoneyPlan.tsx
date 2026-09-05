import React from 'react';
import { TargetSettings } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { ArrowRight, Sparkles, Users, UserPlus, MessageCircle, MapPin } from 'lucide-react';

interface ScreenMoneyPlanProps {
  targetSettings: TargetSettings;
  onStartActions: () => void;
}

export const ScreenMoneyPlan: React.FC<ScreenMoneyPlanProps> = ({
  targetSettings,
  onStartActions,
}) => {
  const gap = Math.max(targetSettings.targetAmount - targetSettings.achievedAmount, 0);

  const strategies = [
    {
      rank: '1',
      title: 'CUSTOMER LAMA',
      label: 'Prioritas utama',
      labelColor: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40',
      description: 'Mulai dari orang yang sudah mengenal layananmu.',
      icon: Users,
      iconColor: 'text-[#10B981] bg-[#10B981]/15',
    },
    {
      rank: '2',
      title: 'REFERRAL',
      label: 'Peluang tinggi',
      labelColor: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40',
      description: 'Minta rekomendasi dari customer yang puas.',
      icon: UserPlus,
      iconColor: 'text-[#F59E0B] bg-[#F59E0B]/15',
    },
    {
      rank: '3',
      title: 'WHATSAPP',
      label: 'Tambah peluang',
      labelColor: 'bg-white/10 text-gray-300 border-white/20',
      description: 'Jangkau calon customer yang relevan.',
      icon: MessageCircle,
      iconColor: 'text-white bg-white/10',
    },
    {
      rank: '4',
      title: 'KONTEN LOKAL',
      label: 'Bangun permintaan',
      labelColor: 'bg-white/10 text-gray-300 border-white/20',
      description: 'Buat orang sekitar sadar layananmu tersedia.',
      icon: MapPin,
      iconColor: 'text-white bg-white/10',
    },
  ];

  return (
    <div className="p-5 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] font-mono">
          Langkah 3 dari 3 — MONEY PLAN
        </span>
        <h2 id="screen-money-plan-title" className="text-2xl font-bold text-white tracking-tight uppercase mt-1 leading-tight">
          CARA TERCEPAT MENGEJAR TARGETMU
        </h2>
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#1A1A1A] border border-white/10 text-xs font-semibold text-gray-300 shadow-md">
          <span>Target tersisa:</span>
          <span className="font-mono font-bold text-white text-sm">{formatRupiah(gap)}</span>
        </div>
      </div>

      {/* 4 Ranked Strategy Cards */}
      <div className="space-y-3">
        {strategies.map((strat) => {
          const Icon = strat.icon;
          return (
            <div
              key={strat.rank}
              className="p-4 rounded-2xl bg-[#1A1A1A] border border-white/10 hover:border-[#10B981]/40 transition-all flex items-start gap-3.5 shadow-lg"
            >
              <div className={`w-10 h-10 rounded-xl ${strat.iconColor} flex items-center justify-center flex-shrink-0 font-bold text-base`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-500">#{strat.rank}</span>
                    <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                      {strat.title}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${strat.labelColor}`}>
                    {strat.label}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {strat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Insight Card */}
      <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#10B981]/30 flex items-center gap-3 shadow-lg">
        <Sparkles className="w-5 h-5 text-[#10B981] flex-shrink-0" />
        <p className="text-xs font-medium text-gray-300">
          “Kita mulai dari peluang yang paling dekat dulu.”
        </p>
      </div>

      {/* Primary CTA */}
      <button
        id="btn-money-plan-start"
        type="button"
        onClick={onStartActions}
        className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-[#10B981] hover:bg-emerald-400 text-black shadow-[0_4px_24px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 active:scale-98"
      >
        <span>MULAI KEJAR TARGET</span>
        <ArrowRight className="w-4 h-4 stroke-[3px]" />
      </button>
    </div>
  );
};
