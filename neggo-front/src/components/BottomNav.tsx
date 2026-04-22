import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n/LanguageContext';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const navItems = [
    { icon: Home, label: 'Home', path: '/app' },
    { icon: Search, label: t('see_all'), path: '/explore' },
    { icon: PlusCircle, label: t('publish'), path: '/create', primary: true },
    { icon: MessageCircle, label: 'Chats', path: '/chats' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-1 left-2 right-2 bg-white/80 backdrop-blur-xl border border-white/20 px-4 py-2 pb-safe flex justify-between items-center z-50 rounded-[32px] shadow-2xl">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-0.5 transition-all active:scale-90",
            item.primary ? "text-white bg-blue-600 p-3 rounded-full shadow-lg shadow-blue-200" : (isActive ? "text-blue-600" : "text-gray-400")
          )}
        >
          <item.icon size={item.primary ? 28 : 22} strokeWidth={item.primary ? 3 : 2} />
          {!item.primary && <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};
