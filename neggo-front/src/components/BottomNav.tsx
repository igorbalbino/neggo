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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 pb-safe flex justify-between items-center z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors",
            item.primary ? "text-blue-600 -mt-8 bg-white p-2 rounded-full shadow-lg border border-gray-50" : (isActive ? "text-blue-600" : "text-gray-400")
          )}
        >
          <item.icon size={item.primary ? 32 : 24} strokeWidth={item.primary ? 2.5 : 2} />
          {!item.primary && <span className="text-[10px] font-medium">{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};
