import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialogModal: React.FC<ConfirmDialogModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md rounded-2xl bg-[#18181b] border border-white/20 p-6 shadow-2xl text-white z-10"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  isDestructive
                    ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                    : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                }`}
              >
                {isDestructive ? (
                  <Trash2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <h3 className="text-base font-bold text-white font-display">
                  {title}
                </h3>
                <p className="text-xs text-neutral-300 font-sans mt-1.5 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-lg flex items-center gap-1.5 ${
                  isDestructive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-white hover:bg-neutral-200 text-black'
                }`}
              >
                {isDestructive && <Trash2 className="w-3.5 h-3.5" />}
                <span>{confirmLabel}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
