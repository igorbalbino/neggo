import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageCircle, User, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navItems = [
    { icon: Home, label: 'Home', path: '/app' },
    { icon: Search, label: t('see_all'), path: '/explore' },
    { icon: MessageCircle, label: 'Chats', path: '/chats' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-gray-100 p-6 z-50">
      <div className="mb-10 px-2">
        <img src="/neggo.png" alt="Neggo" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all",
              isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <NavLink
          to="/create"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform"
        >
          <PlusCircle size={20} />
          {t('create_ad')}
        </NavLink>

        {user?.plan && user.plan !== 'Membro' && user.plan !== 'Free' && (
          <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
            <div className="flex items-center gap-2 text-yellow-700 font-bold text-xs mb-1">
              <Zap size={14} fill="currentColor" />
              Plano {user.plan} Ativo
            </div>
            <p className="text-[10px] text-yellow-800 opacity-70 leading-tight">
              Aproveite todos os benefícios do seu plano.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 p-2">
          <img 
            src={user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=random`} 
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            alt="User"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{user?.plan || 'Membro'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
