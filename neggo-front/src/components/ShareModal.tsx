import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-[32px] shadow-2xl z-[70] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Share2 size={20} className="text-blue-600" />
                <h3 className="font-black text-gray-900">Compartilhar</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-sm font-bold text-gray-900 mb-2">{title}</p>
                <p className="text-xs text-gray-400">Envie este link para um amigo ou compartilhe em suas redes.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 break-all text-[11px] font-mono text-gray-500">
                {shareUrl}
              </div>

              <button 
                onClick={handleCopy}
                className={cn(
                  "w-full py-4 rounded-2xl font-black text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2",
                  copied 
                    ? "bg-green-500 text-white shadow-green-100" 
                    : "bg-blue-600 text-white shadow-blue-100"
                )}
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copiar Link
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Simple cn helper if not using standard one
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
