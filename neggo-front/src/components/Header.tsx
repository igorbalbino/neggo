import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { NotificationModal } from './NotificationModal';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/explore?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <>
      <header className="sticky top-0 bg-white z-40 px-4 md:px-8 py-3 md:py-6 border-b border-gray-100 flex items-center gap-3 md:gap-6">
        <div className="md:hidden">
          <img src="/neggo.png" alt="Neggo" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
        </div>
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={t('search_placeholder')} 
            className="w-full bg-gray-100 border-none rounded-2xl py-2.5 md:py-3.5 pl-10 md:pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="p-2 text-gray-500 relative hover:bg-gray-50 rounded-full transition-colors active:scale-90"
          >
            <Bell size={22} />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          <div className="hidden md:flex items-center gap-3 ml-2 pl-4 border-l border-gray-100">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">{user?.name}</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase">{user?.plan || 'Membro'}</p>
            </div>
            <img 
              src={user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=random`} 
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              alt="User"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <NotificationModal 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
        onReadAction={() => setHasUnread(false)}
      />
    </>
  );
};
