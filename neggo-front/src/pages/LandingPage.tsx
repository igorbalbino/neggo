import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Globe, Zap, Shield, MessageSquare, ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslation, Language } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { cn } from '../lib/utils';
import { SEO } from '../components/SEO';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, setLanguage, language } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (api.isAuthenticated()) {
      navigate('/app');
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate]);

  const languages: { code: Language; label: string }[] = [
    { code: 'pt-BR', label: 'Português' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'py', label: 'Guaraní' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEO 
        description={t('meta_landing_description')}
      />
      {/* Navbar */}
      <nav className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <img src="/neggo.png" alt="Neggo" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
        <div className="flex items-center gap-4">
          <div className="relative" ref={langRef}>
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={cn(
                "flex items-center gap-1 text-sm font-bold transition-all px-3 py-2 rounded-xl",
                isLangOpen ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Globe size={18} />
              {languages.find(l => l.code === language)?.label}
              <ChevronDown size={14} className={cn("transition-transform", isLangOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                >
                  {languages.filter(l => l.code !== 'py').map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 text-sm font-bold transition-colors hover:bg-gray-50",
                        language === lang.code ? "text-blue-600 bg-blue-50/50" : "text-gray-700"
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {t('login')}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-12 pb-20 max-w-7xl mx-auto md:flex md:items-center md:gap-12">
        <div className="md:flex-1">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight"
          >
            {t('landing_title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed max-w-xl"
          >
            {t('landing_subtitle')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              {t('get_started')}
              <ArrowRight size={22} />
            </button>
          </motion.div>
        </div>
        
        <div className="hidden md:block md:flex-1 relative">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="relative bg-gray-100 rounded-[40px] aspect-square overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://picsum.photos/seed/marketplace/800/800" 
              alt="Marketplace" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-xl font-black text-gray-900">Chat-First</h3>
            <p className="text-gray-500 leading-relaxed">Toda negociação acontece em tempo real. Sem intermediários, direto ao ponto.</p>
          </div>
          <div className="space-y-4">
            <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center">
              <Zap size={28} fill="currentColor" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Boost Instantâneo</h3>
            <p className="text-gray-500 leading-relaxed">Destaque seus anúncios e venda até 10x mais rápido com nosso sistema de visibilidade.</p>
          </div>
          <div className="space-y-4">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
              <Shield size={28} />
            </div>
            <h3 className="text-xl font-black text-gray-900">Confiança Local</h3>
            <p className="text-gray-500 leading-relaxed">Sistema de avaliações e perfis verificados para garantir segurança em cada negócio.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-100 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest flex flex-col items-center gap-2">
        <span>&copy; 2026 Neggo Marketplace. All rights reserved.</span>
        <a href="https://creatioinc.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">
          Criado por creatioinc.com
        </a>
      </footer>
    </div>
  );
};
