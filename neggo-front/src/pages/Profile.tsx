import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ShieldCheck, Star, ChevronRight, Package, Heart, CreditCard, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleLogout = () => {
    api.logout();
    navigate('/');
  };
  const user = {
    name: 'Marcos Silva',
    photoUrl: 'https://i.pravatar.cc/150?u=marcos',
    rating: 4.8,
    isPro: true,
    plan: 'Plano Pro',
    memberSince: 'Março 2024',
  };

  const menuItems = [
    { icon: Package, label: 'Meus Anúncios', path: '/my-ads' },
    { icon: Heart, label: 'Favoritos', path: '/favorites' },
    { icon: CreditCard, label: 'Planos e Assinatura', path: '/plans', highlight: true },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <img 
              src={user.photoUrl} 
              alt={user.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              referrerPolicy="no-referrer"
            />
            {user.isPro && (
              <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-4 border-white">
                <ShieldCheck size={18} />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">{user.name}</h1>
          <div className="flex items-center gap-3 text-sm font-bold mb-4">
            <div className="flex items-center text-yellow-500">
              <Star size={14} fill="currentColor" className="mr-1" />
              {user.rating}
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-blue-600">{user.plan}</span>
          </div>
          <button className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full text-sm font-bold active:scale-95 transition-transform">
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm flex justify-between text-center border border-gray-50">
          <div>
            <p className="text-2xl font-black text-gray-900">12</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ativos</p>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div>
            <p className="text-2xl font-black text-gray-900">48</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vendidos</p>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div>
            <p className="text-2xl font-black text-gray-900">156</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avaliações</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-6 space-y-3">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "w-full flex items-center justify-between p-5 rounded-3xl transition-all active:scale-[0.98]",
              item.highlight ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-gray-700 shadow-sm"
            )}
          >
            <div className="flex items-center gap-4">
              <item.icon size={22} />
              <span className="font-bold">{item.label}</span>
            </div>
            <ChevronRight size={18} className={item.highlight ? "text-white/60" : "text-gray-300"} />
          </motion.button>
        ))}

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-5 text-red-500 font-bold mt-4 active:scale-95 transition-transform"
        >
          <LogOut size={22} />
          Sair da conta
        </button>
      </div>
    </div>
  );
};
