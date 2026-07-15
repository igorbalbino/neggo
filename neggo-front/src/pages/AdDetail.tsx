import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Heart, MapPin, MessageCircle, User, Star, ShieldCheck, Loader2, Zap, Phone, ArrowLeft } from 'lucide-react';
import { Badge } from '../components/Badge';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { Ad } from '../types';
import { ShareModal } from '../components/ShareModal';
import { cn } from '../lib/utils';
import { useChat } from '../contexts/ChatContext';
import { SEO } from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { redirectToStripeCheckout } from '../lib/stripeCheckout';

export const AdDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { startChat } = useChat();
  const { user } = useAuth();
  const [ad, setAd] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      if (!id) return;
      try {
        const data = await api.getAd(id);
        setAd(data);
      } catch (err) {
        console.error('Failed to fetch ad', err);
        navigate('/app');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAd();
  }, [id, navigate]);

  const [isBoosting, setIsBoosting] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  const handleBoost = async () => {
    if (!ad || isBoosting) return;
    if (!user || user.id !== ad.sellerId) return;
    setIsBoosting(true);
    try {
      const result = await api.boostAd(ad.id);
      
      if (redirectToStripeCheckout(result.checkoutUrl)) {
        return;
      }

      // Refresh ad to show boosted status
      const data = await api.getAd(ad.id);
      setAd(data);
      alert(t('boost_success'));
    } catch (err: any) {
      alert(err.message || t('boost_error'));
    } finally {
      setIsBoosting(false);
    }
  };

  const handleStartChat = async () => {
    if (!ad || isStartingChat) return;
    setIsStartingChat(true);
    try {
      const chatId = await startChat(
        ad.sellerId, 
        ad.id, 
        ad.seller?.name || 'Vendedor', 
        ad.title,
        ad.seller?.photoUrl
      );
      if (chatId) {
        navigate(`/chat/room/${chatId}`);
      } else {
        throw new Error('Failed to start chat');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao iniciar conversa');
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!ad || isFavoriteLoading) return;
    setIsFavoriteLoading(true);
    try {
      await api.toggleFavorite(ad.id);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!ad) return null;

  return (
    <div className="pb-24 bg-white min-h-screen">
      <SEO 
        title={ad.title}
        description={ad.description}
        image={ad.images[0]}
        type="product"
        keywords={`${ad.title}, ${ad.category}, marketplace, usados, ${ad.locations?.[0]?.city || ''}, neggo`}
      />
      {/* Header Actions (Mobile Only) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between p-4 pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm pointer-events-auto active:scale-90 transition-transform"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm pointer-events-auto active:scale-90 transition-transform"
          >
            <Share2 size={20} />
          </button>
          <button 
            onClick={handleToggleFavorite}
            disabled={isFavoriteLoading}
            className={cn(
              "p-2 backdrop-blur-md rounded-full shadow-sm pointer-events-auto active:scale-90 transition-all",
              isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-gray-900"
            )}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Desktop Back Button */}
      <div className="hidden md:block max-w-7xl mx-auto px-8 lg:px-12 pt-8 -mb-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-colors group"
        >
          <div className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm group-hover:bg-gray-50 transition-colors">
            <ArrowLeft size={18} />
          </div>
          {t('back')}
        </button>
      </div>

      <div className="md:flex md:gap-8 md:p-8 lg:p-12">
        {/* Image Gallery */}
        <div className="md:flex-1">
          <div className="relative h-[40vh] md:h-[60vh] md:rounded-3xl overflow-hidden bg-gray-200">
            <img 
              src={ad.images[0]} 
              alt={ad.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {ad.images.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'}`}></div>
              ))}
            </div>
          </div>
          
          <div className="hidden md:grid grid-cols-3 gap-4 mt-4">
            {ad.images.map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:flex-1 px-4 py-6 md:p-0 bg-white rounded-t-3xl -mt-6 md:mt-0 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-2">
              <Badge variant={ad.type === 'service' ? 'accent' : 'primary'}>
                {ad.type === 'service' ? t('services') : t('products')}
              </Badge>
              {ad.condition && (
                <Badge variant="secondary">
                  {ad.condition === 'new' ? t('new') : t('used')}
                </Badge>
              )}
            </div>
            <div className="hidden md:flex gap-2">
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-2xl transition-colors"
              >
                <Share2 size={20} />
              </button>
              <button 
                onClick={handleToggleFavorite}
                disabled={isFavoriteLoading}
                className={cn(
                  "p-3 rounded-2xl transition-all",
                  isFavorite ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 hover:text-red-500"
                )}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">{ad.title}</h1>
          <p className="text-3xl md:text-4xl font-black text-blue-600 mb-6">
            {typeof ad.price === 'number' 
              ? new Intl.NumberFormat(language === 'pt-BR' ? 'pt-BR' : 'en-US', { 
                  style: 'currency', 
                  currency: language === 'pt-BR' ? 'BRL' : 'USD' 
                }).format(ad.price)
              : t('negotiable')
            }
          </p>

          <div className="flex items-center text-gray-500 text-sm mb-8 pb-6 border-b border-gray-100">
            <MapPin size={16} className="mr-1" />
            {ad.isNational ? (
              t('serves_national')
            ) : ad.locations.length > 0 ? (
              `${ad.locations[0].city}${ad.locations.length > 1 ? ` +${ad.locations.length - 1} ${t('more_locations')}` : ''}`
            ) : (
              t('no_location')
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3">{t('description')}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
              {ad.description}
            </p>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 p-6 rounded-3xl flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={ad.seller?.preferences?.showPhoto !== false 
                    ? (ad.seller?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(ad.seller?.name || '')}&background=random`)
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(ad.seller?.name || '')}&background=random`
                  } 
                  alt={ad.seller?.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  referrerPolicy="no-referrer"
                />
                {ad.seller?.isPro && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full border-2 border-white">
                    <ShieldCheck size={14} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{ad.seller?.name}</h3>
                <div className="flex items-center text-yellow-500 text-xs font-bold">
                  <Star size={14} fill="currentColor" className="mr-1" />
                  {ad.seller?.rating}
                </div>
              </div>
            </div>
            <button className="text-blue-600 font-bold text-sm px-6 py-3 rounded-2xl border border-blue-200 hover:bg-blue-50 transition-colors">
              {t('view_profile')}
            </button>
          </div>

          <div className="hidden md:block space-y-3">
            <div className="flex gap-3">
              <button 
                onClick={handleStartChat}
                disabled={isStartingChat}
                className="flex-1 bg-blue-600 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-95 transition-transform disabled:opacity-50"
              >
                {isStartingChat ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    <MessageCircle size={24} />
                    {t('start_chat')}
                  </>
                )}
              </button>

              {ad.seller?.preferences?.contactMode === 'both' && ad.seller?.phone && (
                <a
                  href={`tel:${ad.seller.phone}`}
                  className="px-8 bg-green-500 text-white rounded-3xl font-black flex items-center justify-center shadow-xl shadow-green-100 active:scale-95 transition-transform"
                >
                  <Phone size={24} />
                </a>
              )}
            </div>
            
            {!ad.isBoosted && user?.id === ad.sellerId && (
              <button 
                onClick={handleBoost}
                disabled={isBoosting}
                className="w-full bg-yellow-400 text-yellow-900 py-4 rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl shadow-yellow-100 active:scale-95 transition-transform disabled:opacity-50"
              >
                {isBoosting ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    <Zap size={24} fill="currentColor" />
                    {t('boost_ad')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action (Mobile Only) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex gap-2">
        <button 
          onClick={handleStartChat}
          disabled={isStartingChat}
          className="flex-1 bg-blue-600 text-white py-4 rounded-3xl font-black flex items-center justify-center gap-2 shadow-2xl shadow-blue-200 active:scale-95 transition-transform disabled:opacity-50"
        >
          {isStartingChat ? <Loader2 className="animate-spin" size={20} /> : (
            <>
              <MessageCircle size={20} />
              {t('start_chat')}
            </>
          )}
        </button>

        {ad.seller?.preferences?.contactMode === 'both' && ad.seller?.phone && (
          <a
            href={`tel:${ad.seller.phone}`}
            className="p-4 bg-green-500 text-white rounded-3xl font-black shadow-2xl shadow-green-100 active:scale-95 transition-transform flex items-center justify-center"
          >
            <Phone size={20} />
          </a>
        )}
        
        {!ad.isBoosted && user?.id === ad.sellerId && (
          <button 
            onClick={handleBoost}
            disabled={isBoosting}
            className="p-4 bg-yellow-400 text-yellow-900 rounded-3xl font-black shadow-2xl shadow-yellow-100 active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center"
          >
            {isBoosting ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
          </button>
        )}
      </div>
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        title={ad.title} 
      />
    </div>
  );
};
