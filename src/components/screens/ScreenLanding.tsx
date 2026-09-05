import React from 'react';
import { ArrowRight, Target, Radio, Flame, Sparkles } from 'lucide-react';

interface ScreenLandingProps {
  onStart: () => void;
  onQuickDemo: () => void;
}

export const ScreenLanding: React.FC<ScreenLandingProps> = ({ onStart, onQuickDemo }) => {
  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-65px)] p-6 max-w-md mx-auto animate-in fade-in duration-300">
      {/* Brand Header */}
      <div className="pt-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-bold tracking-wider mb-6 font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DINAMIS MONEY</span>
        </div>

        {/* Headline */}
        <h1
          id="landing-headline"
          className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-[1.25] uppercase"
        >
          TARGET JUALAN ADA.<br />
          <span className="text-[#10B981]">TAPI HARI INI</span><br />
          HARUS NGAPAIN?
        </h1>

        {/* Supporting copy */}
        <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed font-normal max-w-xs mx-auto">
          DINAMIS membantu menentukan peluang dan aktivitas penjualan yang perlu kamu kerjakan berikutnya.
        </p>

        {/* Tagline */}
        <div className="mt-4 inline-block px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-xs text-gray-400 italic font-mono">
          “Jangan cuma catat penjualan. Cari penjualan berikutnya.”
        </div>
      </div>

      {/* 3 Concise Benefits */}
      <div className="my-8 space-y-3">
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#1A1A1A] border border-white/10 hover:border-[#10B981]/40 transition-colors shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center flex-shrink-0 text-[#10B981]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Target jadi aktivitas
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Ubah angka target besar menjadi langkah aksi harian yang jelas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#1A1A1A] border border-white/10 hover:border-[#F59E0B]/40 transition-colors shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center flex-shrink-0 text-[#F59E0B]">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Tahu peluang yang perlu dikejar
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Otomatis kelompokkan prospek paling hot yang mendekati deal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#1A1A1A] border border-white/10 hover:border-[#10B981]/40 transition-colors shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 text-white">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Tahu apa yang harus dilakukan hari ini
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Dapatkan arahan kontak, template follow-up, dan cegah peluang lepas.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3 pb-4">
        <button
          id="btn-landing-cta"
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide bg-[#10B981] hover:bg-emerald-400 text-black shadow-[0_4px_24px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <span>CARI PENJUALAN BERIKUTNYA</span>
          <ArrowRight className="w-4 h-4 stroke-[3px]" />
        </button>

        <p className="text-center text-xs text-gray-400 font-mono">
          Coba dulu tanpa kartu kredit.
        </p>

        <div className="pt-2 text-center">
          <button
            id="btn-landing-quick-demo"
            onClick={onQuickDemo}
            className="text-xs font-bold text-[#10B981] hover:underline underline-offset-4 font-mono"
          >
            Atau langsung coba Dashboard Demo (Pre-loaded data)
          </button>
        </div>
      </div>
    </div>
  );
};
