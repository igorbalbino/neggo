export type AdType = 'product' | 'service';
export type AdCondition = 'new' | 'used';
export type ServiceType = 'in_person' | 'remote';
export type AdStatus = 'active' | 'sold' | 'cancelled';
export type ChatStatus = 'open' | 'negotiating' | 'closed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  photoUrl?: string;
  rating: number;
  isPro: boolean;
  phone?: string;
}

export interface Location {
  city: string;
  state: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number | 'negotiable';
  isNational: boolean;
  locations: Location[];
  boostLocations?: Location[];
  type: AdType;
  category: string;
  images: string[];
  sellerId: string;
  seller?: User;
  condition?: AdCondition;
  serviceType?: ServiceType;
  isBoosted: boolean;
  status: AdStatus;
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  adId: string;
  adTitle: string;
  adImageUrl: string;
  buyerId: string;
  sellerId: string;
  lastMessage?: string;
  status: ChatStatus;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  adLimit: number;
  benefits: string[];
  isCurrent?: boolean;
  popular?: boolean;
}
