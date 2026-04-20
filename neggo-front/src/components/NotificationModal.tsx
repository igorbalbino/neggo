import React, { useState, useEffect } from 'react';
import { X, Bell, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { useTranslation } from '../i18n/LanguageContext';
import { cn } from '../lib/utils';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReadAction: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onReadAction }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        try {
          const data = await api.getNotifications();
          setNotifications(data || []);
        } catch (err) {
          console.error('Failed to fetch notifications', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await api.markNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      onReadAction();
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-[32px] shadow-2xl z-[70] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-blue-600" />
                <h3 className="font-black text-gray-900">Notificações</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
              {isLoading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={cn(
                      "p-4 rounded-2xl border transition-all",
                      notif.read ? "bg-white border-gray-50" : "bg-blue-50/30 border-blue-100"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className={cn("text-xs uppercase font-black tracking-wider", notif.read ? "text-gray-400" : "text-blue-600")}>
                        {notif.type}
                      </p>
                      {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">{notif.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">{notif.time}</p>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <Bell size={48} strokeWidth={1} className="mx-auto mb-4 text-gray-200" />
                  <p className="text-sm font-bold text-gray-400">Tudo limpo por aqui!</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50/50 border-t border-gray-100">
              <button 
                onClick={handleMarkAllRead}
                disabled={notifications.every(n => n.read)}
                className="w-full bg-white text-gray-900 border border-gray-200 py-3 rounded-2xl font-black text-sm shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check size={18} />
                Marcar tudo como lido
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
