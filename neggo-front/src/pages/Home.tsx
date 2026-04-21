import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { AdCard } from '../components/AdCard';
import { Ad } from '../types';
import { Package, Briefcase, ChevronRight, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { SEO } from '../components/SEO';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filterCity, setFilterCity] = useState('');
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeType, setActiveType] = useState<'product' | 'service' | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
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
    let result = true;
    if (filterCity) {
      const cityMatch = ad.locations?.some(loc => 
        loc.city.toLowerCase().includes(filterCity.toLowerCase())
      );
      result = ad.isNational || !!cityMatch;
    }
    if (activeType && result) {
      result = ad.type === activeType;
    }
    return result;
  });

  const boostedAds = filteredAds.filter(ad => ad.isBoosted);
  const recentAds = filteredAds.slice(0, 10); // Show only recent 10 on home

  return (
    <div className="pb-24">
      <SEO 
        title={t('products')}
      />
      <Header />
      
      <main className="px-4 py-4 md:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-gray-400 font-medium">{t('loading_ads')}</p>
          </div>
        ) : (
          <>
            {/* City Filter */}
            <div className="mb-6 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder={t('city_filter_placeholder')}
                className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
                value={filterCity}
                onChange={e => setFilterCity(e.target.value)}
              />
            </div>

            {/* Quick Filters */}
            <section className="flex gap-3 mb-8">
              <button 
                onClick={() => setActiveType(activeType === 'product' ? null : 'product')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 rounded-3xl font-bold active:scale-95 transition-all border shadow-sm",
                  activeType === 'product' 
                    ? "bg-blue-600 border-blue-600 text-white shadow-blue-100" 
                    : "bg-white border-gray-50 text-gray-700"
                )}
              >
                <Package size={20} />
                {t('products')}
              </button>
              <button 
                onClick={() => setActiveType(activeType === 'service' ? null : 'service')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 rounded-3xl font-bold active:scale-95 transition-all border shadow-sm",
                  activeType === 'service' 
                    ? "bg-purple-600 border-purple-600 text-white shadow-purple-100" 
                    : "bg-white border-gray-50 text-gray-700"
                )}
              >
                <Briefcase size={20} />
                {t('services')}
              </button>
            </section>

            {/* Highlights */}
            {boostedAds.length > 0 && (
              <section className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">{t('highlights')}</h2>
                    <p className="text-xs text-gray-500 font-bold">{t('highlights_subtitle')}</p>
                  </div>
                  <button 
                    onClick={() => navigate('/explore')}
                    className="text-blue-600 text-sm font-bold flex items-center"
                  >
                    {t('see_all')} <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                  {boostedAds.map((ad) => (
                    <motion.div 
                      key={ad.id} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="min-w-[180px] w-[180px]"
                    >
                      <AdCard ad={ad} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Ads */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-xl font-black text-gray-900">{t('recent')}</h2>
                  <p className="text-xs text-gray-500 font-bold">{t('recent_subtitle')}</p>
                </div>
                <button 
                  onClick={() => navigate('/explore')}
                  className="text-blue-600 text-sm font-bold flex items-center"
                >
                  {t('see_all')} <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {recentAds.map((ad, i) => (
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

              {recentAds.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Package size={64} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-sm font-bold">Nenhum anúncio encontrado nesta região.</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};
