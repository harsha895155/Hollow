import React from 'react';
import { X, Download } from 'lucide-react';

export default function ReceiptViewerModal({ isOpen, onClose, receiptUrl, title }) {
  if (!isOpen || !receiptUrl) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative max-w-2xl w-full bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Receipt Verification</h3>
            <p className="text-xs text-slate-400">{title || 'Transaction Receipt'}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={receiptUrl}
              download="receipt.png"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Download Receipt"
            >
              <Download size={18} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center max-h-[70vh] overflow-auto rounded-2xl bg-black/40 p-2">
          <img
            src={receiptUrl}
            alt="Receipt full preview"
            className="max-h-[65vh] w-auto object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
