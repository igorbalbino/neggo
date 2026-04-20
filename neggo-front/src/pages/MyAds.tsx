import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, Loader2, Trash2 } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { Ad } from '../types';
import { AdCard } from '../components/AdCard';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const MyAds: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyAds = async () => {
      try {
        const data = await api.getMyAds();
        setAds(data);
      } catch (err) {
        console.error('Failed to fetch my ads', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyAds();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este anúncio?')) return;
    
    setIsDeleting(id);
    try {
      await api.deleteAd(id);
      setAds(prev => prev.filter(ad => ad.id !== id));
    } catch (err) {
      console.error('Failed to delete ad', err);
      alert('Erro ao excluir anúncio');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      <header className="px-4 py-4 flex items-center gap-3 bg-white border-b border-gray-50 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-gray-900">{t('my_ads')}</h1>
      </header>

      <main className="p-4 md:p-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : (
          <>
            {ads.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {ads.map((ad, i) => (
                  <motion.div 
                    key={ad.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative group"
                  >
                    <AdCard ad={ad} />
                    <button 
                      onClick={() => handleDelete(ad.id)}
                      disabled={isDeleting === ad.id}
                      className={cn(
                        "absolute top-2 right-2 bg-red-600 text-white p-2.5 rounded-xl shadow-lg transition-all disabled:opacity-50 z-10 active:scale-95",
                        "md:opacity-0 md:group-hover:opacity-100" // Visible on hover for desktop, always for mobile
                      )}
                    >
                      {isDeleting === ad.id ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Package size={64} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-sm font-bold">{t('no_ads_yet')}</p>
                <button 
                  onClick={() => navigate('/create')}
                  className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform"
                >
                  {t('create_ad')}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
