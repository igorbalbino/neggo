import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.register(formData);
      // After registration, send to login as requested
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Falha ao cadastrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <button onClick={() => navigate(-1)} className="mb-6 p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft size={24} />
        </button>

        <div className="mb-8">
          <img src="/neggo.png" alt="Neggo" className="h-10 w-auto mb-4 object-contain" referrerPolicy="no-referrer" />
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{t('register')}</h1>
          <p className="text-gray-500 font-medium text-sm">{t('register_subtitle')}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-black uppercase tracking-tight border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t('full_name')}</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder={t('full_name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-100/50 border border-transparent rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="email" 
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-100/50 border border-transparent rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t('phone')}</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="tel" 
                placeholder="Ex: +55 11 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-100/50 border border-transparent rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-100/50 border border-transparent rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {t('finish_registration')}
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 font-medium">
            {t('already_have_account')} <button onClick={() => navigate('/login')} className="font-black text-blue-600 hover:underline">{t('login')}</button>
          </p>
        </div>
      </div>
    </div>
  );
};
