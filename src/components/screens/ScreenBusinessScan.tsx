import React, { useState } from 'react';
import { BusinessProfile } from '../../types';
import { formatRupiah, parseRupiahInput } from '../../utils/formatters';
import { ArrowRight, Check } from 'lucide-react';

interface ScreenBusinessScanProps {
  initialProfile: BusinessProfile;
  onSaveAndNext: (profile: BusinessProfile) => void;
  onBack: () => void;
}

const BUYER_OPTIONS = [
  'Rumah tangga',
  'Perusahaan',
  'Individu / profesional',
  'Toko / usaha',
  'Lainnya',
];

const CHANNEL_OPTIONS = [
  'WhatsApp',
  'Customer lama',
  'Referral',
  'TikTok',
  'Instagram',
  'Marketplace',
  'Direct offering',
];

export const ScreenBusinessScan: React.FC<ScreenBusinessScanProps> = ({
  initialProfile,
  onSaveAndNext,
}) => {
  const [product, setProduct] = useState(initialProfile.productOrService);
  const [priceStr, setPriceStr] = useState(initialProfile.avgSalePrice.toString());
  const [selectedBuyers, setSelectedBuyers] = useState<string[]>(initialProfile.buyerPersona);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(initialProfile.salesChannels);

  const priceVal = parseRupiahInput(priceStr);

  const toggleBuyer = (b: string) => {
    if (selectedBuyers.includes(b)) {
      if (selectedBuyers.length > 1) {
        setSelectedBuyers(selectedBuyers.filter((item) => item !== b));
      }
    } else {
      setSelectedBuyers([...selectedBuyers, b]);
    }
  };

  const toggleChannel = (c: string) => {
    if (selectedChannels.includes(c)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((item) => item !== c));
      }
    } else {
      setSelectedChannels([...selectedChannels, c]);
    }
  };

  const handleNext = () => {
    onSaveAndNext({
      productOrService: product.trim() || 'Jasa cuci AC',
      avgSalePrice: priceVal || 100000,
      buyerPersona: selectedBuyers,
      salesChannels: selectedChannels,
    });
  };

  return (
    <div className="p-5 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Langkah 2 dari 3 — BUSINESS SCAN
        </span>
        <span className="text-xs text-slate-400">Profil Singkat</span>
      </div>

      <div>
        <h2 id="screen-business-scan-title" className="text-2xl font-black text-white tracking-tight leading-tight">
          Biar DINAMIS tahu cara kamu jualan.
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Hanya butuh 30 detik untuk menyesuaikan prioritas peluangmu.
        </p>
      </div>

      <div className="space-y-4 bg-[#1A1A1A] p-5 rounded-2xl border border-white/10 shadow-xl">
        {/* Apa yang kamu jual? */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Apa yang kamu jual?
          </label>
          <input
            id="input-business-product"
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Contoh: Jasa cuci AC / Properti / Reseller kosmetik"
            className="w-full bg-[#262626] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Harga rata-rata */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Harga rata-rata penjualan
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-sm font-bold text-gray-400 font-mono">Rp</span>
            <input
              id="input-business-avg-price"
              type="text"
              value={formatRupiah(priceVal).replace('Rp', '')}
              onChange={(e) => setPriceStr(e.target.value)}
              className="w-full bg-[#262626] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#10B981]"
            />
          </div>
        </div>

        {/* Siapa yang biasanya membeli? */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">
            Siapa yang biasanya membeli?
          </label>
          <div className="flex flex-wrap gap-2">
            {BUYER_OPTIONS.map((buyer) => {
              const isSelected = selectedBuyers.includes(buyer);
              return (
                <button
                  key={buyer}
                  type="button"
                  onClick={() => toggleBuyer(buyer)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 font-mono ${
                    isSelected
                      ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40 font-bold'
                      : 'bg-white/5 text-gray-400 border border-white/5 hover:border-white/20'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
                  <span>{buyer}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Biasanya kamu mencari customer dari mana? */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">
            Biasanya kamu mencari customer dari mana?
          </label>
          <div className="flex flex-wrap gap-2">
            {CHANNEL_OPTIONS.map((channel) => {
              const isSelected = selectedChannels.includes(channel);
              return (
                <button
                  key={channel}
                  type="button"
                  onClick={() => toggleChannel(channel)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 font-mono ${
                    isSelected
                      ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40 font-bold'
                      : 'bg-white/5 text-gray-400 border border-white/5 hover:border-white/20'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#F59E0B]" />}
                  <span>{channel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <button
        id="btn-business-scan-submit"
        type="button"
        onClick={handleNext}
        className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-[#10B981] hover:bg-emerald-400 text-black shadow-[0_4px_24px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 active:scale-98"
      >
        <span>BUAT RENCANA SAYA</span>
        <ArrowRight className="w-4 h-4 stroke-[3px]" />
      </button>
    </div>
  );
};
