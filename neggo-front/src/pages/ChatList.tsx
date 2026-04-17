import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageSquare, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { cn } from '../lib/utils';

export const ChatList: React.FC = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await api.getChats();
        setChats(data);
      } catch (err) {
        console.error('Failed to fetch chats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();
  }, []);

  return (
    <div className="pb-24 min-h-screen bg-white">
      <header className="px-4 py-6 border-b border-gray-50 sticky top-0 bg-white z-10">
        <h1 className="text-2xl font-black text-gray-900">Conversas</h1>
      </header>

      <div className="px-4 py-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar conversas..." 
            className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <>
              {chats.map((chat, i) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    to={`/chat/room/${chat.id}`}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <div className="relative">
                      <img 
                        src={chat.userPhoto} 
                        alt={chat.userName} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <img 
                        src={chat.adImageUrl} 
                        alt={chat.adTitle} 
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg object-cover border-2 border-white shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h3 className="font-bold text-gray-900 truncate">{chat.userName}</h3>
                        <span className="text-[10px] text-gray-400 font-medium">{chat.time}</span>
                      </div>
                      <p className="text-[11px] text-blue-600 font-bold mb-1 truncate">{chat.adTitle}</p>
                      <p className={cn(
                        "text-xs truncate",
                        chat.unread > 0 ? "text-gray-900 font-bold" : "text-gray-500"
                      )}>
                        {chat.lastMessage}
                      </p>
                    </div>

                    {chat.unread > 0 && (
                      <div className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                    <ChevronRight size={16} className="text-gray-300" />
                  </Link>
                </motion.div>
              ))}

              {chats.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <MessageSquare size={64} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-sm">Nenhuma conversa por aqui ainda.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
