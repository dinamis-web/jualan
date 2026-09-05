import React, { useState } from 'react';
import { Modal } from './Modal';
import { Copy, Check, MessageSquare, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { useMarketingAI } from '../../features/ai/useMarketingAI';

interface MarketingKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  recipientName: string;
  defaultMessage: string;
  phoneNumber?: string;
  contextType?: string;
}

export const MarketingKitModal: React.FC<MarketingKitModalProps> = ({
  isOpen,
  onClose,
  title,
  recipientName,
  defaultMessage,
  phoneNumber,
  contextType = 'Follow-up Prospek',
}) => {
  const [message, setMessage] = useState(defaultMessage);
  const [copied, setCopied] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'sopan' | 'santai' | 'promo'>('sopan');
  const { generateMessage, isGenerating, generationSource } = useMarketingAI();

  // If the defaultMessage changes, sync state
  React.useEffect(() => {
    setMessage(defaultMessage);
  }, [defaultMessage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    let url = `https://wa.me/?text=${encoded}`;
    if (phoneNumber) {
      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
      const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
      url = `https://wa.me/${waNumber}?text=${encoded}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleToneChange = async (tone: 'sopan' | 'santai' | 'promo') => {
    setSelectedTone(tone);
    const generated = await generateMessage({
      recipientName,
      tone,
      contextType,
    });
    if (generated) {
      setMessage(generated);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        {/* Context Tag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-bold bg-[#10B981]/15 px-2.5 py-1 rounded-full border border-[#10B981]/30 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Draft Pesan Kontekstual — {contextType}</span>
          </div>
          <span className="text-xs text-gray-400">Untuk: <b className="text-white">{recipientName}</b></span>
        </div>

        {/* Tone Selector & AI Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Pilihan nada:</span>
            <div className="flex gap-1.5">
              {(['sopan', 'santai', 'promo'] as const).map((t) => (
                <button
                  key={t}
                  disabled={isGenerating}
                  onClick={() => handleToneChange(t)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg capitalize transition-colors font-mono disabled:opacity-50 ${
                    selectedTone === t
                      ? 'bg-[#10B981] text-black shadow-md'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {isGenerating ? (
            <div className="flex items-center gap-1 text-[11px] text-[#10B981] font-mono animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>AI Mengetik...</span>
            </div>
          ) : generationSource === 'gemini' ? (
            <span className="text-[10px] text-[#10B981] font-mono bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">
              Gemini AI
            </span>
          ) : null}
        </div>

        {/* Message Box */}
        <div className="relative">
          <textarea
            id="marketing-kit-message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            disabled={isGenerating}
            className="w-full bg-[#262626] border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] resize-none font-normal leading-relaxed disabled:opacity-60"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            id="btn-copy-pesan"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors active:scale-98"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#10B981] font-mono">TERSALIN!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-400" />
                <span>COPY PESAN</span>
              </>
            )}
          </button>

          <button
            id="btn-open-whatsapp"
            onClick={handleOpenWhatsApp}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#10B981] hover:bg-emerald-400 text-black shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all active:scale-98"
          >
            <MessageSquare className="w-4 h-4 text-black fill-black" />
            <span>BUKA WHATSAPP</span>
            <ExternalLink className="w-3.5 h-3.5 text-black" />
          </button>
        </div>

        <p className="text-center text-[11px] text-gray-500">
          Kamu bisa mengedit teks langsung di atas sebelum disalin atau dikirim.
        </p>
      </div>
    </Modal>
  );
};
