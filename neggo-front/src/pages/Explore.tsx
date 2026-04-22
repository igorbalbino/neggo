import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Search, SlidersHorizontal, MapPin, Package, Briefcase, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { Ad } from '../types';
import { AdCard } from '../components/AdCard';
import { cn } from '../lib/utils';
import { SEO } from '../components/SEO';

export const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<string | null>(searchParams.get('type'));
  const [activeCategory, setActiveCategory] = useState<string | null>(searchParams.get('cat'));
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'electronics', label: t('cat_electronics') },
    { id: 'home', label: t('cat_home') },
    { id: 'fashion', label: t('cat_fashion') },
    { id: 'sports', label: t('cat_sports') },
    { id: 'services', label: t('cat_services') },
    { id: 'health', label: t('cat_health') },
    { id: 'education', label: t('cat_education') },
    { id: 'tech', label: t('cat_tech') },
  ];

  const currentCategoryLabel = categories.find(c => c.id === activeCategory)?.label;
  const seoTitle = searchQuery 
    ? `${searchQuery}` 
    : currentCategoryLabel 
      ? `${currentCategoryLabel}` 
      : t('see_all');

  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      try {
        const data = await api.getAds();
        setAds(data);
      } catch (err) {
        console.error('Failed to fetch ads', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAds();
  }, []);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !activeType || ad.type === activeType;
    const matchesCategory = !activeCategory || ad.category === activeCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchQuery) prev.set('q', searchQuery);
      else prev.delete('q');
      return prev;
    });
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50 flex flex-col">
      <SEO 
        title={seoTitle}
        keywords={`${seoTitle}, ${t('meta_keywords')}`}
      />
      {/* Search Header */}
      <header className="bg-white/80 backdrop-blur-md px-4 py-2 md:py-4 md:px-8 border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft size={24} />
          </button>
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder={t('search_placeholder')} 
              className="w-full bg-gray-100/80 border-none rounded-xl py-2 md:py-2.5 pl-9 md:pl-10 pr-4 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-2 rounded-xl border transition-all active:scale-95 flex-shrink-0",
              showFilters ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-100 text-gray-500"
            )}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <button 
            onClick={() => { setActiveCategory(null); setSearchParams(p => { p.delete('cat'); return p; }); }}
            className={cn(
              "whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-tighter border transition-all",
              activeCategory === null ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-100 text-gray-400"
            )}
          >
            {t('see_all')}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearchParams(p => { p.set('cat', cat.id); return p; }); }}
              className={cn(
                "whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-tighter border transition-all",
                activeCategory === cat.id ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-100 text-gray-400"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Filter Sidebar (Mobile Overaly Style) */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] bg-white z-50 p-6 shadow-2xl md:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-gray-900">{t('filters')}</h3>
                <button onClick={() => setShowFilters(false)}><X size={24} /></button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">{t('type')}</label>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => { setActiveType(null); setSearchParams(p => { p.delete('type'); return p; }); }}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left font-bold text-sm",
                        activeType === null ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-50 bg-gray-50 text-gray-500"
                      )}
                    >
                      {t('see_all')}
                    </button>
                    <button 
                      onClick={() => { setActiveType('product'); setSearchParams(p => { p.set('type', 'product'); return p; }); }}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left font-bold text-sm flex items-center gap-3",
                        activeType === 'product' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-50 bg-gray-50 text-gray-500"
                      )}
                    >
                      <Package size={18} /> {t('products')}
                    </button>
                    <button 
                      onClick={() => { setActiveType('service'); setSearchParams(p => { p.set('type', 'service'); return p; }); }}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left font-bold text-sm flex items-center gap-3",
                        activeType === 'service' ? "border-purple-600 bg-purple-50 text-purple-600" : "border-gray-50 bg-gray-50 text-gray-500"
                      )}
                    >
                      <Briefcase size={18} /> {t('services')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Grid Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-gray-400 font-medium">{t('loading_ads')}</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500 font-bold">
                  {filteredAds.length} {filteredAds.length === 1 ? 'anúncio encontrado' : 'anúncios encontrados'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredAds.map((ad, i) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <AdCard ad={ad} />
                  </motion.div>
                ))}
              </div>

              {filteredAds.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Package size={80} strokeWidth={1} className="mb-6 opacity-20" />
                  <p className="text-lg font-bold mb-1">Nenhum resultado</p>
                  <p className="text-sm">Tente mudar os filtros ou o termo de busca.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
