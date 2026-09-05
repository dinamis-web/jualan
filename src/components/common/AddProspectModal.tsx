import React, { useState } from 'react';
import { Modal } from './Modal';
import { Prospect, ProspectStatus, PriorityTier } from '../../types';
import { Flame, Sparkles } from 'lucide-react';
import { parseRupiahInput } from '../../utils/formatters';

interface AddProspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProspect: (prospect: Prospect) => void;
}

export const AddProspectModal: React.FC<AddProspectModalProps> = ({
  isOpen,
  onClose,
  onAddProspect,
}) => {
  const [name, setName] = useState('');
  const [potentialStr, setPotentialStr] = useState('500.000');
  const [status, setStatus] = useState<ProspectStatus>('Minta penawaran');
  const [phone, setPhone] = useState('');
  const [lastInteraction, setLastInteraction] = useState('Kemarin');
  const [notes, setNotes] = useState('');

  // Determine priority preview dynamically
  const determinePriority = (st: ProspectStatus): PriorityTier => {
    switch (st) {
      case 'Proposal terkirim':
      case 'Minta penawaran':
      case 'Minta dihubungi lagi':
        return 'HOT';
      case 'Tanya harga':
      case 'Tertarik':
        return 'WARM';
      case 'Baru dikenal':
      case 'Sudah dihubungi':
      default:
        return 'COLD';
    }
  };

  const currentPriority = determinePriority(status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const potentialVal = parseRupiahInput(potentialStr) || 100000;
    const priority = currentPriority;

    let recommendation = 'Follow-up hari ini';
    if (priority === 'HOT') {
      recommendation = status === 'Proposal terkirim' ? 'Follow-up proposal hari ini' : 'Kirim penawaran terbaik';
    } else if (priority === 'WARM') {
      recommendation = 'Kirim info promo & portofolio';
    } else {
      recommendation = 'Kirim perkenalan singkat';
    }

    const newProspect: Prospect = {
      id: `p-${Date.now()}`,
      name: name.trim(),
      potential: potentialVal,
      status,
      priority,
      lastActivity: `${status} (${lastInteraction})`,
      daysInactive: lastInteraction.includes('Hari ini') ? 0 : 2,
      nextRecommendation: recommendation,
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
      timeline: [
        {
          id: `t-${Date.now()}`,
          timeAgo: lastInteraction,
          event: `${status} dicatat di DINAMIS`,
        },
      ],
    };

    onAddProspect(newProspect);
    onClose();
    setName('');
    setPotentialStr('500.000');
    setPhone('');
    setNotes('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="TAMBAH KE RADAR">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Nama Customer / Perusahaan <span className="text-[#10B981]">*</span>
          </label>
          <input
            id="input-prospect-name"
            type="text"
            required
            placeholder="Contoh: Pak Herman / PT Sejahtera"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#262626] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Potensi Nilai */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Potensi Nilai Penjualan (Rp) <span className="text-[#10B981]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-sm font-bold text-gray-400 font-mono">Rp</span>
            <input
              id="input-prospect-potential"
              type="text"
              required
              value={potentialStr}
              onChange={(e) => setPotentialStr(e.target.value)}
              className="w-full bg-[#262626] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981]"
            />
          </div>
        </div>

        {/* Status Saat Ini */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-300">
              Status Saat Ini
            </label>
            {/* Auto classification indicator */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full font-mono ${
                currentPriority === 'HOT'
                  ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40'
                  : currentPriority === 'WARM'
                  ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40'
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Otomatis: {currentPriority}
            </span>
          </div>

          <select
            id="select-prospect-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProspectStatus)}
            className="w-full bg-[#262626] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
          >
            <option value="Proposal terkirim">Proposal terkirim (Prioritas Hot)</option>
            <option value="Minta penawaran">Minta penawaran (Prioritas Hot)</option>
            <option value="Minta dihubungi lagi">Minta dihubungi lagi (Prioritas Hot)</option>
            <option value="Tanya harga">Tanya harga (Prioritas Warm)</option>
            <option value="Tertarik">Tertarik (Prioritas Warm)</option>
            <option value="Sudah dihubungi">Sudah dihubungi (Prioritas Cold)</option>
            <option value="Baru dikenal">Baru dikenal (Prioritas Cold)</option>
          </select>
        </div>

        {/* Nomor Kontak WhatsApp & Terakhir Kontak */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              WhatsApp (Opsional)
            </label>
            <input
              id="input-prospect-phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#262626] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Terakhir Interaksi
            </label>
            <input
              id="input-prospect-last-contact"
              type="text"
              placeholder="Contoh: Hari ini / 2 hari lalu"
              value={lastInteraction}
              onChange={(e) => setLastInteraction(e.target.value)}
              className="w-full bg-[#262626] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981]"
            />
          </div>
        </div>

        {/* Catatan Singkat */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Catatan Tambahan
          </label>
          <input
            id="input-prospect-notes"
            type="text"
            placeholder="Contoh: Butuh servis 3 unit AC ruang meeting"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#262626] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Submit */}
        <button
          id="btn-submit-prospect"
          type="submit"
          className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#10B981] hover:bg-emerald-400 text-black shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <Flame className="w-4 h-4 fill-black" />
          <span>TAMBAH KE RADAR</span>
        </button>
      </form>
    </Modal>
  );
};
