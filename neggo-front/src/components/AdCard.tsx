import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Zap, Heart } from 'lucide-react';
import { Ad } from '../types';
import { Badge } from './Badge';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';

interface AdCardProps {
  ad: Ad;
  className?: string;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, className }) => {
  const { language, t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false); // Should ideally come from ad data
  
  const formattedPrice = typeof ad.price === 'number' 
    ? new Intl.NumberFormat(language === 'pt-BR' ? 'pt-BR' : 'en-US', { 
        style: 'currency', 
        currency: language === 'pt-BR' ? 'BRL' : 'USD' 
      }).format(ad.price)
    : t('negotiable');

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.toggleFavorite(ad.id);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  return (
    <Link 
      to={`/ad/${ad.id}`} 
      className={cn(
        "block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-transform group relative",
        ad.isBoosted && "border-yellow-200 ring-1 ring-yellow-100",
        className
      )}
    >
      <div className="relative aspect-square bg-gray-100">
        <img 
          src={ad.images[0] || 'https://picsum.photos/seed/placeholder/400/400'} 
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge variant={ad.type === 'service' ? 'accent' : 'primary'}>
            {ad.type === 'service' ? 'Serviço' : 'Produto'}
          </Badge>
          {ad.isBoosted && (
            <Badge variant="boost" className="flex items-center gap-0.5">
              <Zap size={10} fill="currentColor" /> Destaque
            </Badge>
          )}
        </div>

        <button 
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all active:scale-90",
            isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-gray-400 hover:text-red-500"
          )}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="p-2 md:p-3">
        <h3 className="font-bold text-gray-900 line-clamp-2 text-[13px] md:text-sm leading-tight mb-1 h-8 md:h-10">
          {ad.title}
        </h3>
        <p className="text-base md:text-lg font-black text-gray-900 mb-1.5 md:mb-2">
          {formattedPrice}
        </p>
        <div className="flex items-center text-gray-400 text-[10px] md:text-[11px] font-bold">
          <MapPin size={10} className="mr-1 flex-shrink-0" />
          <span className="truncate">
            {ad.isNational ? (
              t('serves_national')
            ) : ad.locations && ad.locations.length > 0 ? (
              `${ad.locations[0].city}${ad.locations.length > 1 ? ` +${ad.locations.length - 1} ${t('more_locations')}` : ''}`
            ) : (
              t('no_location')
            )}
          </span>
        </div>
      </div>
    </Link>
  );
};
