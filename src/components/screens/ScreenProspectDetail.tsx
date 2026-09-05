import React, { useState } from 'react';
import { Prospect } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { MarketingKitModal } from '../common/MarketingKitModal';
import { ArrowLeft, Clock, MessageSquare, Check, Phone, ArrowUpRight } from 'lucide-react';

interface ScreenProspectDetailProps {
  prospect: Prospect;
  onBack: () => void;
  onUpdateStatus: (prospectId: string, action: 'follow-up' | 'closing' | 'unsuccessful' | 'later') => void;
  onTriggerClosing: (prospect: Prospect) => void;
}

export const ScreenProspectDetail: React.FC<ScreenProspectDetailProps> = ({
  prospect,
  onBack,
  onUpdateStatus,
  onTriggerClosing,
}) => {
  const [isMarketingKitOpen, setIsMarketingKitOpen] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const handleAction = (action: 'follow-up' | 'closing' | 'unsuccessful' | 'later') => {
    if (action === 'closing') {
      onTriggerClosing(prospect);
      return;
    }

    onUpdateStatus(prospect.id, action);
    if (action === 'follow-up') {
      setStatusFeedback('Berhasil dicatat: Sudah Follow-up hari ini!');
    } else if (action === 'later') {
      setStatusFeedback('Status diubah: Dijadwalkan hubungi lagi nanti.');
    } else if (action === 'unsuccessful') {
      setStatusFeedback('Status diubah: Belum berhasil.');
    }
    setTimeout(() => setStatusFeedback(null), 2500);
  };

  const handleOpenWhatsAppDirect = () => {
    const defaultText = encodeURIComponent(
      `Halo ${prospect.name}, selamat siang. Izin menanyakan tindak lanjut kebutuhan layanan servis AC kemarin. Kami siap bantu jika ada hal yang ingin didiskusikan kembali.`
    );
    let url = `https://wa.me/?text=${defaultText}`;
    if (prospect.phone) {
      const clean = prospect.phone.replace(/[^0-9]/g, '');
      const waNumber = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
      url = `https://wa.me/${waNumber}?text=${defaultText}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-4 sm:p-5 max-w-md mx-auto space-y-4 animate-in fade-in duration-300 pb-24">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Radar</span>
      </button>

      {/* Feedback Banner */}
      {statusFeedback && (
        <div className="p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-bold flex items-center gap-2 animate-in fade-in font-mono">
          <Check className="w-4 h-4 text-[#10B981]" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* Main Prospect Header Card */}
      <div className="p-5 rounded-2xl bg-[#1A1A1A] border border-white/10 space-y-3 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              PROSPEK
            </span>
            <h2 id="prospect-detail-name" className="text-xl font-bold text-white tracking-tight uppercase">
              {prospect.name}
            </h2>
          </div>
          <StatusBadge priority={prospect.priority} />
        </div>

        <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-gray-400">Potensi Penjualan:</span>
            <p className="text-2xl font-mono font-bold text-white tracking-tight">
              {formatRupiah(prospect.potential)}
            </p>
          </div>
          {prospect.phone && (
            <span className="text-xs text-gray-400 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              {prospect.phone}
            </span>
          )}
        </div>

        {prospect.notes && (
          <p className="text-xs text-gray-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
            Catatan: {prospect.notes}
          </p>
        )}
      </div>

      {/* NEXT BEST ACTION CARD */}
      <div className="p-5 rounded-2xl bg-white/5 border border-[#10B981]/30 shadow-xl space-y-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981]">
            NEXT BEST ACTION
          </span>
          <p className="text-base font-bold text-white tracking-tight mt-0.5">
            {prospect.nextRecommendation}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1">
          <button
            id="btn-prospect-followup-sekarang"
            onClick={handleOpenWhatsAppDirect}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wide bg-[#10B981] hover:bg-emerald-400 text-black shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Phone className="w-4 h-4 fill-black" />
            <span>FOLLOW-UP SEKARANG (WHATSAPP)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            id="btn-prospect-buat-pesan"
            onClick={() => setIsMarketingKitOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#10B981]" />
            <span>BUAT PESAN FOLLOW-UP (MARKETING KIT)</span>
          </button>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="p-5 rounded-2xl bg-[#1A1A1A] border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wide">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>Timeline Aktivitas</span>
        </div>

        <div className="space-y-3 pt-1">
          {prospect.timeline.map((item, idx) => (
            <div key={item.id || idx} className="flex items-start gap-3 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] mt-1.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-gray-400 font-mono">{item.timeAgo}</span>
                <p className="text-white mt-0.5">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPDATE STATUS BUTTONS */}
      <div className="space-y-2 pt-2">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
          Perbarui Status Prospek:
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            id="btn-mark-already-followup"
            onClick={() => handleAction('follow-up')}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Sudah Follow-up</span>
          </button>

          <button
            id="btn-mark-closing"
            onClick={() => handleAction('closing')}
            className="p-3 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 text-xs font-bold text-[#10B981] border border-[#10B981]/30 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>🎯 Catat Closing</span>
          </button>

          <button
            id="btn-mark-hubungi-lagi"
            onClick={() => handleAction('later')}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Hubungi lagi nanti</span>
          </button>

          <button
            id="btn-mark-unsuccessful"
            onClick={() => handleAction('unsuccessful')}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-500 border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Belum berhasil</span>
          </button>
        </div>
      </div>

      {/* Marketing Kit Modal */}
      <MarketingKitModal
        isOpen={isMarketingKitOpen}
        onClose={() => setIsMarketingKitOpen(false)}
        title={`PESAN FOLLOW-UP — ${prospect.name}`}
        recipientName={prospect.name}
        phoneNumber={prospect.phone}
        defaultMessage={`Halo ${prospect.name}, selamat siang. Izin menanyakan apakah penawaran layanan yang kemarin kami kirimkan sudah sempat dicek? Kami siap bantu jadwalkan pengerjaan atau konsultasi jika diperlukan.`}
        contextType="Follow-up Prospek"
      />
    </div>
  );
};
