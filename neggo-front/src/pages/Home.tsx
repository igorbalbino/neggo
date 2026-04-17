import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { AdCard } from '../components/AdCard';
import { Ad } from '../types';
import { Package, Briefcase, ChevronRight, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const [filterCity, setFilterCity] = useState('');
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (!filterCity) return true;
    const cityMatch = ad.locations?.some(loc => 
      loc.city.toLowerCase().includes(filterCity.toLowerCase())
    );
    return ad.isNational || cityMatch;
  });

  const boostedAds = filteredAds.filter(ad => ad.isBoosted);
  const recentAds = filteredAds;

  return (
    <div className="pb-24">
      <Header />
      
      <main className="px-4 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-gray-400 font-medium">{t('loading_ads')}</p>
          </div>
        ) : (
          <>
            {/* City Filter Demo */}
        <div className="mb-6 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder={t('city_filter_placeholder')}
            className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
          />
        </div>

        {/* Quick Filters */}
        <section className="flex gap-3 mb-8">
          <button className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-4 rounded-2xl font-semibold active:scale-95 transition-transform border border-blue-100">
            <Package size={20} />
            {t('products')}
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-700 py-4 rounded-2xl font-semibold active:scale-95 transition-transform border border-purple-100">
            <Briefcase size={20} />
            {t('services')}
          </button>
        </section>

        {/* Highlights */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('highlights')}</h2>
              <p className="text-xs text-gray-500">{t('highlights_subtitle')}</p>
            </div>
            <button className="text-blue-600 text-sm font-semibold flex items-center">
              {t('see_all')} <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {boostedAds.map((ad) => (
              <motion.div 
                key={ad.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="min-w-[160px] w-[160px]"
              >
                <AdCard ad={ad} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Ads */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('recent')}</h2>
              <p className="text-xs text-gray-500">{t('recent_subtitle')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {recentAds.map((ad) => (
              <motion.div 
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AdCard ad={ad} />
              </motion.div>
            ))}
          </div>
        </section>
          </>
        )}
      </main>
    </div>
  );
};
