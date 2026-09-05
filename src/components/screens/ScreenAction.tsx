import React, { useState } from 'react';
import { ActionItem } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Modal } from '../common/Modal';
import { MarketingKitModal } from '../common/MarketingKitModal';
import { Check, CheckCircle2, ChevronRight, MessageSquare, Sparkles, Plus } from 'lucide-react';

interface ScreenActionProps {
  actions: ActionItem[];
  onUpdateAction: (updated: ActionItem) => void;
  onResetActions: () => void;
}

export const ScreenAction: React.FC<ScreenActionProps> = ({
  actions,
  onUpdateAction,
  onResetActions,
}) => {
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [isMarketingKitOpen, setIsMarketingKitOpen] = useState(false);

  const completedCount = actions.filter((a) => a.isCompleted || a.completedCount >= a.targetCount).length;
  const totalActions = actions.length;

  const handleIncrement = (act: ActionItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newCompletedCount = Math.min(act.completedCount + 1, act.targetCount);
    const isNowCompleted = newCompletedCount >= act.targetCount;
    const updated = {
      ...act,
      completedCount: newCompletedCount,
      isCompleted: isNowCompleted,
    };
    onUpdateAction(updated);
    if (selectedAction && selectedAction.id === act.id) {
      setSelectedAction(updated);
    }
  };

  const handleToggleCompleted = (act: ActionItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowCompleted = !act.isCompleted;
    const newCount = isNowCompleted ? act.targetCount : Math.max(act.completedCount - 1, 0);
    const updated = {
      ...act,
      completedCount: newCount,
      isCompleted: isNowCompleted,
    };
    onUpdateAction(updated);
    if (selectedAction && selectedAction.id === act.id) {
      setSelectedAction(updated);
    }
  };

  if (actions.length === 0) {
    return (
      <div className="p-6 max-w-md mx-auto text-center space-y-4 pt-12 pb-20 animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-extrabold text-white">Belum ada action hari ini.</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Semua target aktivitas telah diselesaikan atau belum dikonfigurasi.
        </p>
        <button
          onClick={onResetActions}
          className="py-3 px-6 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black transition-all"
        >
          BUAT ACTION HARI INI
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 max-w-md mx-auto space-y-4 animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#10B981]">
              EKSEKUSI PENJUALAN
            </span>
            <h2 id="screen-action-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">
              ACTION HARI INI
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">
            {completedCount} / {totalActions} SELESAI
          </span>
        </div>
        <div className="mt-2.5">
          <ProgressBar
            progressPercentage={totalActions > 0 ? (completedCount / totalActions) * 100 : 0}
            height="sm"
          />
        </div>
      </div>

      {/* Action Cards List */}
      <div className="space-y-3">
        {actions.map((act, index) => {
          const isDone = act.isCompleted || act.completedCount >= act.targetCount;
          const isPriority = !isDone && index === actions.findIndex((a) => !a.isCompleted && a.completedCount < a.targetCount);

          return (
            <div
              key={act.id}
              id={`action-card-${act.code}`}
              onClick={() => setSelectedAction(act)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isDone
                  ? 'bg-white/5 border-white/5 opacity-75'
                  : isPriority
                  ? 'bg-[#262626] border-[#10B981]/40 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
                  : 'bg-[#1A1A1A] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 mt-0.5 border ${
                      isDone
                        ? 'bg-[#10B981]/20 border-[#10B981]/30 text-[#10B981]'
                        : isPriority
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    {isDone ? '✓' : act.code}
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold tracking-tight ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {act.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-gray-400 px-2 py-0.5 rounded bg-white/5 border border-white/5 font-mono">
                        {act.label}
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        Progres: <b className={isDone ? 'text-[#10B981]' : 'text-white'}>{act.completedCount}</b> / {act.targetCount}
                      </span>
                      {isPriority && (
                        <span className="text-[9px] font-bold text-[#F59E0B] uppercase">
                          Prioritas
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    id={`btn-mulai-action-${act.code}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAction(act);
                    }}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                      isPriority
                        ? 'bg-[#10B981] hover:bg-emerald-400 text-black shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                    }`}
                  >
                    <span>MULAI</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  <button
                    id={`btn-check-action-${act.code}`}
                    onClick={(e) => handleToggleCompleted(act, e)}
                    title="Tandai Selesai"
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-[#10B981] border-[#10B981] text-black shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                        : 'border-white/20 hover:border-[#10B981] text-transparent hover:text-white/40'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONTEXTUAL ACTION DETAIL MODAL */}
      {selectedAction && (
        <Modal
          isOpen={!!selectedAction}
          onClose={() => setSelectedAction(null)}
          title={selectedAction.detailTitle}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed font-normal">
              {selectedAction.detailDesc}
            </p>

            {/* Current progress counter inside detail */}
            <div className="p-3.5 rounded-xl bg-[#1A1A1A] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-mono">Capaian aktivitas:</span>
                <p className="text-base font-bold text-white font-mono">
                  {selectedAction.completedCount} dari {selectedAction.targetCount} selesai
                </p>
              </div>
              <button
                id="btn-increment-action-detail"
                onClick={() => handleIncrement(selectedAction)}
                disabled={selectedAction.completedCount >= selectedAction.targetCount}
                className="px-3 py-1.5 rounded-lg bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] text-xs font-bold border border-[#10B981]/30 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+1 Selesai</span>
              </button>
            </div>

            {/* AI Assistant Context Highlight */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300 leading-relaxed">
                DINAMIS menyiapkan template pesan yang relevan agar kamu tinggal salin dan kirim tanpa mikir kata-kata.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                id="btn-buatkan-pesan"
                onClick={() => setIsMarketingKitOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#10B981] hover:bg-emerald-400 text-black shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>BUATKAN PESAN</span>
              </button>

              <button
                id="btn-sudah-dihubungi"
                onClick={() => {
                  handleIncrement(selectedAction);
                  setSelectedAction(null);
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors flex items-center justify-center gap-2 active:scale-98"
              >
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>SUDAH DIHUBUNGI ✓</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CONTEXTUAL MARKETING KIT MODAL */}
      {selectedAction && (
        <MarketingKitModal
          isOpen={isMarketingKitOpen}
          onClose={() => setIsMarketingKitOpen(false)}
          title={`MARKETING KIT — ${selectedAction.label}`}
          recipientName={selectedAction.defaultCustomerName || 'Customer'}
          defaultMessage={selectedAction.suggestedTemplate}
          contextType={selectedAction.label}
        />
      )}
    </div>
  );
};
