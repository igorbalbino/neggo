import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If already authenticated, go to app
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Falha ao entrar. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8 md:mb-12">
          <img src="/neggo.png" alt="Neggo" className="h-10 md:h-12 w-auto mb-4 object-contain" referrerPolicy="no-referrer" />
          <h1 className="text-3xl font-black text-gray-900 mb-2">{t('login')}</h1>
          <p className="text-gray-500 font-medium text-sm">{t('landing_subtitle')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-black uppercase tracking-tight border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="email" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100/50 border border-transparent rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="button"
            className="w-full text-right text-xs font-black text-blue-600 py-1 hover:underline"
          >
            {t('forgot_password')}
          </button>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {t('login')}
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 mb-8 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100"></div>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
            Neggo ID Secure Account
          </p>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 font-medium">
            {t('dont_have_account')} <button onClick={() => navigate('/register')} className="font-black text-blue-600 hover:underline">{t('register')}</button>
          </p>
        </div>
      </div>
    </div>
  );
};
