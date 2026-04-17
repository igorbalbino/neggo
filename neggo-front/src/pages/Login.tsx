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
    <div className="min-h-screen bg-white px-6 py-12 flex flex-col">
      <div className="flex-1">
        <div className="mb-12">
          <img src="/neggo.png" alt="Neggo" className="h-12 w-auto mb-4 object-contain" referrerPolicy="no-referrer" />
          <p className="text-gray-500 font-medium">{t('landing_subtitle')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="button"
            className="w-full text-right text-xs font-bold text-blue-600 py-2"
          >
            {t('forgot_password')}
          </button>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
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

        <div className="my-12 flex flex-col items-center gap-4">
          <div className="w-full h-px bg-gray-100"></div>
          <p className="text-xs text-gray-400 text-center px-4 bg-white -mt-7">
            Acesso seguro via Neggo ID
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          {t('dont_have_account')} <button onClick={() => navigate('/register')} className="font-bold text-blue-600">{t('register')}</button>
        </p>
      </div>
    </div>
  );
};
