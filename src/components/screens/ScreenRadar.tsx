import React, { useState } from 'react';
import { Prospect, PriorityTier } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { Radio, Plus, ArrowRight, Flame, Search } from 'lucide-react';

interface ScreenRadarProps {
  prospects: Prospect[];
  onSelectProspect: (prospect: Prospect) => void;
  onOpenAddModal: () => void;
  onFollowUpNow: (prospect: Prospect) => void;
}

export const ScreenRadar: React.FC<ScreenRadarProps> = ({
  prospects,
  onSelectProspect,
  onOpenAddModal,
  onFollowUpNow,
}) => {
  const [activeFilter, setActiveFilter] = useState<'Semua' | 'Hot' | 'Warm' | 'Cold'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const activeProspects = prospects.filter((p) => !p.closed);

  const hotCount = activeProspects.filter((p) => p.priority === 'HOT').length;
  const warmCount = activeProspects.filter((p) => p.priority === 'WARM').length;
  const coldCount = activeProspects.filter((p) => p.priority === 'COLD').length;

  // Filtered list
  const filteredProspects = activeProspects.filter((p) => {
    if (activeFilter === 'Hot' && p.priority !== 'HOT') return false;
    if (activeFilter === 'Warm' && p.priority !== 'WARM') return false;
    if (activeFilter === 'Cold' && p.priority !== 'COLD') return false;
    if (searchQuery.trim()) {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Top opportunity (CV Maju or highest potential HOT prospect)
  const topOpportunity = activeProspects.find((p) => p.priority === 'HOT') || activeProspects[0];

  if (activeProspects.length === 0) {
    return (
      <div className="p-6 max-w-md mx-auto text-center space-y-4 pt-16 pb-20 animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
          <Radio className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-extrabold text-white">Belum ada peluang di Radar.</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Tambahkan calon customer supaya DINAMIS bisa membantu menentukan mana yang perlu dikejar lebih dulu.
        </p>
        <button
          onClick={onOpenAddModal}
          className="py-3 px-6 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-2 mx-auto"
        >
          <Plus className="w-4 h-4" />
          <span>TAMBAH PROSPEK</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 max-w-md mx-auto space-y-4 sm:space-y-5 animate-in fade-in duration-300 pb-20">
      {/* Top Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-[#10B981]">
            SALES PIPELINE RADAR
          </span>
          <h2 id="screen-radar-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">
            MONEY RADAR
          </h2>
        </div>

        <button
          id="btn-add-prospect-radar"
          onClick={onOpenAddModal}
          className="py-2 px-3 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] flex items-center gap-1.5 active:scale-98"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3px]" />
          <span>TAMBAH PROSPEK</span>
        </button>
      </div>

      {/* Segment Summary Card */}
      <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            Total Terpantau
          </span>
          <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white/5 border border-white/10">
            {activeProspects.length} PELUANG
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* HOT */}
          <button
            onClick={() => setActiveFilter('Hot')}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              activeFilter === 'Hot'
                ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981] font-bold'
                : 'bg-white/5 border-white/5 hover:border-[#10B981]/30'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#10B981]">
              <Flame className="w-3 h-3 fill-[#10B981]" />
              <span>HOT</span>
            </div>
            <p className="text-xl font-bold font-mono text-white mt-1">{hotCount}</p>
          </button>

          {/* WARM */}
          <button
            onClick={() => setActiveFilter('Warm')}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              activeFilter === 'Warm'
                ? 'bg-[#F59E0B]/15 border-[#F59E0B] text-[#F59E0B] font-bold'
                : 'bg-white/5 border-white/5 hover:border-[#F59E0B]/30'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#F59E0B]">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span>WARM</span>
            </div>
            <p className="text-xl font-bold font-mono text-white mt-1">{warmCount}</p>
          </button>

          {/* COLD */}
          <button
            onClick={() => setActiveFilter('Cold')}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              activeFilter === 'Cold'
                ? 'bg-white/15 border-white/40 text-white font-bold'
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-400">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              <span>COLD</span>
            </div>
            <p className="text-xl font-bold font-mono text-white mt-1">{coldCount}</p>
          </button>
        </div>
      </div>

      {/* TOP OPPORTUNITY CARD: "🔥 KEJAR DULU" */}
      {topOpportunity && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#10B981]">
            <Flame className="w-3.5 h-3.5 fill-[#10B981]" />
            <span>Peluang Terdekat (Kejar Dulu)</span>
          </div>

          <div
            id="top-opportunity-card"
            className="bg-white/5 border border-[#10B981]/30 p-5 rounded-2xl shadow-xl space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">
                  Prioritas Tertinggi
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {topOpportunity.name}
                </h3>
              </div>
              <StatusBadge priority={topOpportunity.priority} />
            </div>

            <div className="text-2xl font-mono font-bold text-white">
              {formatRupiah(topOpportunity.potential)}
            </div>

            <div className="text-xs text-gray-400">
              {topOpportunity.lastActivity} • <span className="text-[#F59E0B] italic">{topOpportunity.nextRecommendation}</span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onSelectProspect(topOpportunity)}
                className="flex-1 bg-white/10 hover:bg-white/15 text-white text-xs font-bold py-2.5 rounded-lg border border-white/10 transition-colors"
              >
                Detail
              </button>
              <button
                id="btn-radar-followup-top"
                onClick={() => onFollowUpNow(topOpportunity)}
                className="flex-1 bg-[#10B981] hover:bg-emerald-400 text-black text-xs font-bold py-2.5 rounded-lg shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-colors flex items-center justify-center gap-1.5 active:scale-98"
              >
                <span>WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER BUTTONS & SEARCH */}
      <div className="space-y-2.5 pt-1">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama prospek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981]/50 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['Semua', 'Hot', 'Warm', 'Cold'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors font-mono ${
                activeFilter === filter
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* PROSPECT LIST */}
      <div className="space-y-2.5">
        {filteredProspects.map((prospect) => (
          <div
            key={prospect.id}
            id={`prospect-item-${prospect.id}`}
            onClick={() => onSelectProspect(prospect)}
            className="p-3.5 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-[#10B981] transition-colors">
                    {prospect.name}
                  </h4>
                  <StatusBadge priority={prospect.priority} size="sm" />
                </div>
                <p className="text-xs font-bold font-mono text-white mt-1">
                  {formatRupiah(prospect.potential)}
                </p>
              </div>

              <span className="text-[11px] font-semibold text-[#10B981] group-hover:underline">
                Detail →
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-gray-400 flex flex-col gap-0.5">
              <div>
                Status: <span className="text-gray-300">{prospect.lastActivity}</span>
              </div>
              <div className="text-[#10B981] font-medium">
                Saran: {prospect.nextRecommendation}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
