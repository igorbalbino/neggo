import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Zap } from 'lucide-react';
import { Ad } from '../types';
import { Badge } from './Badge';
import { cn } from '../lib/utils';

interface AdCardProps {
  ad: Ad;
  className?: string;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, className }) => {
  const formattedPrice = typeof ad.price === 'number' 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ad.price)
    : 'A combinar';

  return (
    <Link 
      to={`/ad/${ad.id}`} 
      className={cn(
        "block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-transform",
        ad.isBoosted && "border-yellow-200 ring-1 ring-yellow-100",
        className
      )}
    >
      <div className="relative aspect-square bg-gray-100">
        <img 
          src={ad.images[0] || 'https://picsum.photos/seed/placeholder/400/400'} 
          alt={ad.title}
          className="w-full h-full object-cover"
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
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight mb-1 h-10">
          {ad.title}
        </h3>
        <p className="text-lg font-bold text-gray-900 mb-2">
          {formattedPrice}
        </p>
        <div className="flex items-center text-gray-400 text-[11px]">
          <MapPin size={12} className="mr-1" />
          <span className="truncate">
            {ad.isNational ? (
              'Atende todo o país'
            ) : ad.locations.length > 0 ? (
              `${ad.locations[0].city}${ad.locations.length > 1 ? ` +${ad.locations.length - 1} locais` : ''}`
            ) : (
              'Localização não informada'
            )}
          </span>
        </div>
      </div>
    </Link>
  );
};
