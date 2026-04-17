import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, ShieldCheck, Star, ChevronRight, Package, Heart, CreditCard, LogOut, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { EditProfileModal } from '../components/EditProfileModal';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout, updateUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      const updatedUser = await api.updateProfile({ photoUrl: url });
      updateUser(updatedUser);
    } catch (err) {
      console.error('Failed to upload image', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async (data: any) => {
    try {
      const updatedUser = await api.updateProfile(data);
      updateUser(updatedUser);
    } catch (err) {
      console.error('Failed to update profile', err);
      throw err;
    }
  };

  if (!user) return null;

  const menuItems = [
    { icon: Package, label: t('my_ads'), path: '/my-ads' },
    { icon: Heart, label: t('favorites'), path: '/favorites' },
    { icon: CreditCard, label: t('plans'), path: '/plans', highlight: true },
    { icon: SettingsIcon, label: t('settings_title'), path: '/settings' },
  ];

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm">
        <div className="flex flex-col items-center">
          <div className="relative mb-4 cursor-pointer group" onClick={handleImageClick}>
            <div className="relative">
              <img 
                src={user.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                alt={user.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg transition-opacity group-hover:opacity-80"
                referrerPolicy="no-referrer"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*"
              onChange={handleImageChange}
            />
            {user.isPro && (
              <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white">
                <ShieldCheck size={14} />
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
            <span className="text-blue-600">{user.plan || 'Membro'}</span>
          </div>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full text-sm font-bold active:scale-95 transition-transform"
          >
            {t('edit_profile')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm flex justify-between text-center border border-gray-50">
          <div>
            <p className="text-2xl font-black text-gray-900">{user.stats?.active || 0}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('active')}</p>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div>
            <p className="text-2xl font-black text-gray-900">{user.stats?.sold || 0}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('sold')}</p>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div>
            <p className="text-2xl font-black text-gray-900">{user.stats?.reviews || 0}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('reviews')}</p>
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
            onClick={() => navigate(item.path)}
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
          {t('logout_btn')}
        </button>
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal 
            user={user} 
            onClose={() => setIsEditModalOpen(false)} 
            onSave={handleSaveProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
