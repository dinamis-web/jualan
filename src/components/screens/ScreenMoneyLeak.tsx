import React, { useState } from 'react';
import { MoneyLeakItem } from '../../data/initialData';
import { formatRupiah } from '../../utils/formatters';
import { AlertTriangle, CheckCircle2, ArrowLeft, Phone, Check } from 'lucide-react';
import { MarketingKitModal } from '../common/MarketingKitModal';

interface ScreenMoneyLeakProps {
  moneyLeaks: MoneyLeakItem[];
  onResolveLeak: (id: string) => void;
  onBack: () => void;
  onResetLeaks: () => void;
}

export const ScreenMoneyLeak: React.FC<ScreenMoneyLeakProps> = ({
  moneyLeaks,
  onResolveLeak,
  onBack,
  onResetLeaks,
}) => {
  const [selectedLeakForMessage, setSelectedLeakForMessage] = useState<MoneyLeakItem | null>(null);

  const activeLeaks = moneyLeaks.filter((l) => !l.resolved);
  const totalPotentialAtRisk = activeLeaks.reduce((acc, l) => acc + l.potential, 0);

  const handleAction = (leak: MoneyLeakItem) => {
    // Open marketing kit or resolve
    setSelectedLeakForMessage(leak);
  };

  return (
    <div className="p-4 sm:p-5 max-w-md mx-auto space-y-4 animate-in fade-in duration-300 pb-20">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Home</span>
      </button>

      {/* Header */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
          DETEKSI KEBOCORAN PELUANG
        </span>
        <h2 id="screen-money-leak-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">
          MONEY LEAK
        </h2>
      </div>

      {/* Top Card */}
      <div
        id="card-money-leak-summary"
        className="p-5 rounded-2xl bg-[#1A1A1A] border border-[#F59E0B]/30 shadow-xl space-y-2"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
          <span className="text-2xl font-mono font-bold text-white tracking-tight">
            {formatRupiah(totalPotentialAtRisk)}
          </span>
        </div>

        <p className="text-sm font-bold text-[#F59E0B]">
          peluang berpotensi terlewat
        </p>

        <p className="text-xs text-gray-400 leading-relaxed pt-1">
          Beberapa prospek belum mendapatkan tindakan lanjutan. Hubungi mereka hari ini agar minat tidak dingin.
        </p>
      </div>

      {/* List of neglected prospects */}
      {activeLeaks.length > 0 ? (
        <div className="space-y-3 pt-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
            Daftar Perlu Penanganan Segera ({activeLeaks.length})
          </span>

          {activeLeaks.map((leak) => (
            <div
              key={leak.id}
              id={`leak-item-${leak.id}`}
              className="p-4 rounded-2xl bg-[#1A1A1A] border border-white/10 hover:border-[#F59E0B]/50 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight uppercase">
                    {leak.name}
                  </h3>
                  <p className="text-sm font-mono font-bold text-[#10B981] mt-0.5">
                    {formatRupiah(leak.potential)}
                  </p>
                </div>

                <button
                  id={`btn-resolve-leak-${leak.id}`}
                  onClick={() => onResolveLeak(leak.id)}
                  title="Tandai Sudah Ditangani"
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#10B981]/20 text-gray-400 hover:text-[#10B981] border border-white/5 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Sudah</span> Beres
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300">
                <span className="text-[#F59E0B] font-semibold">Kondisi: </span>
                <span>{leak.reason}</span>
              </div>

              <div className="pt-1">
                <button
                  id={`btn-action-leak-${leak.id}`}
                  onClick={() => handleAction(leak)}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#F59E0B] hover:bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-1.5 active:scale-98 uppercase"
                >
                  <Phone className="w-3.5 h-3.5 fill-black" />
                  <span>{leak.ctaText} SEKARANG</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 rounded-2xl bg-[#1A1A1A] border border-[#10B981]/30 text-center space-y-3 pt-10">
          <div className="w-12 h-12 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center mx-auto text-[#10B981]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            Tidak ada peluang yang terabaikan. Bagus.
          </h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Semua prospek terfollow-up dengan disiplin. Pertahankan ritme ini untuk menjaga pipa penjualan tetap mengalir.
          </p>
          <div className="pt-2">
            <button
              onClick={onResetLeaks}
              className="text-xs text-gray-500 hover:text-gray-300 underline font-mono"
            >
              Reset Data Demo Leak
            </button>
          </div>
        </div>
      )}

      {/* Marketing Kit Modal for contacting the leak */}
      {selectedLeakForMessage && (
        <MarketingKitModal
          isOpen={!!selectedLeakForMessage}
          onClose={() => {
            onResolveLeak(selectedLeakForMessage.id);
            setSelectedLeakForMessage(null);
          }}
          title={`HUBUNGI KEMBALI — ${selectedLeakForMessage.name}`}
          recipientName={selectedLeakForMessage.name}
          defaultMessage={`Halo Pak/Bu ${selectedLeakForMessage.name}, selamat siang. Izin menanyakan kembali kelanjutan rencana servis AC kemarin. Kami masih menyediakan slot terbaik minggu ini.`}
          contextType="Penyelamatan Peluang Leak"
        />
      )}
    </div>
  );
};
