import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, MoreVertical, Image as ImageIcon, MapPin, CheckCircle2, XCircle, Handshake, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { api } from '../services/api';
import { db, auth } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

export const ChatRoom: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    // Fetch chat info from API
    const fetchChatInfo = async () => {
      try {
        // Assuming your API can return chat details
        const chats = await api.getChats();
        const currentChat = chats.find(c => c.id === id);
        if (currentChat) setChatInfo(currentChat);
      } catch (err) {
        console.error('Failed to fetch chat info', err);
      }
    };
    fetchChatInfo();

    // Listen to messages in Firestore
    const q = query(
      collection(db, 'chats', id, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().timestamp?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '...'
      }));
      
      setMessages(msgs);
      setIsLoading(false);
    }, (error) => {
      console.error('Firestore Error:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !id || !auth.currentUser) return;
    const text = message;
    setMessage('');
    
    try {
      await addDoc(collection(db, 'chats', id, 'messages'), {
        text,
        senderId: auth.currentUser.uid,
        sender: 'me', // Note: in real use you'd compare senderId with currentUser.uid in the UI
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to send message to Firestore', err);
    }
  };

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-3rem)] bg-[#F0F2F5]">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm z-10">
        <button onClick={() => navigate(-1)} className="p-1 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {chatInfo ? (
            <>
              <img 
                src={chatInfo.userPhoto} 
                alt={chatInfo.userName} 
                className="w-10 h-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <h2 className="font-bold text-gray-900 truncate leading-tight">{chatInfo.userName}</h2>
                <p className="text-[11px] text-blue-600 font-bold truncate">{chatInfo.adTitle}</p>
              </div>
            </>
          ) : (
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-32 bg-gray-50 rounded animate-pulse"></div>
            </div>
          )}
        </div>
        <button className="p-2 text-gray-400">
          <MoreVertical size={20} />
        </button>
      </header>

      {/* Action Bar */}
      <div className="bg-white/80 backdrop-blur-md px-4 py-2 border-b border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
        <button className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 active:scale-95 transition-transform">
          <Handshake size={14} /> Fazer Proposta
        </button>
        <button className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 active:scale-95 transition-transform">
          <CheckCircle2 size={14} /> Fechar Negócio
        </button>
        <button className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-100 active:scale-95 transition-transform">
          <XCircle size={14} /> Desistir
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex flex-col max-w-[80%]",
                  msg.senderId === auth.currentUser?.uid ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                  msg.senderId === auth.currentUser?.uid 
                    ? "bg-blue-600 text-white rounded-tr-none" 
                    : "bg-white text-gray-800 rounded-tl-none"
                )}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="bg-white p-4 pb-safe border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 active:text-blue-600 transition-colors">
            <ImageIcon size={24} />
          </button>
          <button className="p-2 text-gray-400 active:text-blue-600 transition-colors">
            <MapPin size={24} />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite uma mensagem..." 
              className="w-full bg-gray-100 border-none rounded-full py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className={cn(
              "p-3 rounded-full transition-all",
              message.trim() ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-100 text-gray-400"
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
