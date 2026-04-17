import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings as SettingsIcon, LogOut, MessageSquare, Phone, User as UserIcon, Check, Loader2, Languages } from 'lucide-react';
import { useTranslation, Language } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { api } from '../services/api';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();
  const { user, logout, updateUser } = useAuth();
  
  const [contactMode, setContactMode] = useState<'chat' | 'both'>(user?.preferences?.contactMode || 'chat');
  const [showPhoto, setShowPhoto] = useState(user?.preferences?.showPhoto ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (updates: any) => {
    setIsSaving(true);
    try {
      const updatedUser = await api.updateProfile({ 
        preferences: { 
          ...user?.preferences, 
          ...updates 
        } 
      });
      updateUser(updatedUser);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      <header className="px-4 py-4 md:px-8 flex items-center gap-3 bg-white border-b border-gray-50 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-gray-900">{t('settings_title')}</h1>
      </header>

      <div className="px-6 py-8 md:px-12 space-y-8">
        {/* Language Switcher */}
        <section>
          <label className="block text-xs font-black text-gray-400 uppercase mb-4 tracking-widest pl-1">
            {t('app_language')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'pt-BR', label: t('lang_pt') },
              { id: 'es', label: t('lang_es') },
              { id: 'en', label: t('lang_en') },
              { id: 'py', label: t('lang_py') },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id as Language)}
                className={cn(
                  "flex items-center justify-center p-4 rounded-2xl border-2 font-bold text-sm transition-all",
                  language === lang.id ? "border-blue-600 bg-blue-50 text-blue-700" : "bg-white border-transparent text-gray-500"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </section>

        {/* Contact Preferences */}
        <section>
          <label className="block text-xs font-black text-gray-400 uppercase mb-4 tracking-widest pl-1">
            {t('contact_me')}
          </label>
          <div className="space-y-3">
            <button 
              onClick={() => { setContactMode('chat'); handleSave({ contactMode: 'chat' }); }}
              className={cn(
                "w-full flex items-center justify-between p-5 rounded-3xl transition-all border-2",
                contactMode === 'chat' ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-transparent text-gray-700"
              )}
            >
              <div className="flex items-center gap-4">
                <MessageSquare size={22} />
                <span className="font-bold">{t('contact_chat')}</span>
              </div>
              {contactMode === 'chat' && <Check size={20} />}
            </button>

            <button 
              onClick={() => { setContactMode('both'); handleSave({ contactMode: 'both' }); }}
              className={cn(
                "w-full flex items-center justify-between p-5 rounded-3xl transition-all border-2",
                contactMode === 'both' ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-transparent text-gray-700"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  <MessageSquare size={18} />
                  <Phone size={18} />
                </div>
                <span className="font-bold">{t('contact_phone')}</span>
              </div>
              {contactMode === 'both' && <Check size={20} />}
            </button>
          </div>
        </section>

        {/* Privacy */}
        <section>
          <label className="block text-xs font-black text-gray-400 uppercase mb-4 tracking-widest pl-1">
            Privacidade
          </label>
          <div className="bg-white rounded-[32px] p-2 shadow-sm">
            <button 
              onClick={() => { setShowPhoto(!showPhoto); handleSave({ showPhoto: !showPhoto }); }}
              className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <UserIcon size={22} className="text-gray-400" />
                <span className="font-bold text-gray-700">{t('show_photo')}</span>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full relative transition-colors",
                showPhoto ? "bg-blue-600" : "bg-gray-200"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  showPhoto ? "right-1" : "left-1"
                )} />
              </div>
            </button>
          </div>
        </section>

        {/* Account */}
        <section>
          <label className="block text-xs font-black text-gray-400 uppercase mb-4 tracking-widest pl-1">
            Conta
          </label>
          <div className="bg-white rounded-[32px] p-2 shadow-sm">
            <button 
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center justify-between p-5 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-4">
                <LogOut size={22} />
                <span>Sair da conta</span>
              </div>
            </button>
          </div>
        </section>

        <div className="text-center pt-8">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Neggo v1.0.4</p>
          <p className="text-[10px] font-bold text-gray-400 mt-1">© Creatio Inc. 2026</p>
        </div>
      </div>

      {isSaving && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl z-50">
          <Loader2 size={14} className="animate-spin" />
          Salvando...
        </div>
      )}
    </div>
  );
};
