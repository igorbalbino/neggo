import { Ad, User, Location, Plan } from '../types';
import { authenticateWithFirebase } from './firebase';

const API_BASE_URL = 'https://neggo-api.creatioinc.com';

interface ApiResponse<T> {
  success: boolean;
  error: string | false;
  data: T;
}

class ApiService {
  private token: string | null = localStorage.getItem('neggo_token');

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('neggo_token', token);
  }

  getToken() {
    return this.token;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('neggo_token');
  }

  isAuthenticated() {
    return !!this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    const result: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      error: 'Invalid response from server',
      data: null as any
    }));

    if (!result.success || result.error) {
      throw new Error(result.error || 'API request failed');
    }

    return result.data;
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; id: string; user: User; chatToken?: string }> {
    const result = await this.request<{ token: string; id: string; user: User; chatToken?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(result.token);
    
    // Auth with Firebase if chatToken is provided
    if (result.chatToken) {
      try {
        await authenticateWithFirebase(result.chatToken);
      } catch (err) {
        console.error('Failed to auth with Firebase after login', err);
      }
    }
    
    return result;
  }

  async register(data: any): Promise<void> {
    await this.request<void>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Ads
  async getAds(): Promise<Ad[]> {
    return this.request<Ad[]>('/ads');
  }

  async getAd(id: string): Promise<Ad> {
    return this.request<Ad>(`/ads/${id}`);
  }

  async createAd(adData: Partial<Ad>): Promise<Ad> {
    return this.request<Ad>('/ads', {
      method: 'POST',
      body: JSON.stringify(adData),
    });
  }

  // Profile
  async getProfile(): Promise<User> {
    return this.request<User>('/profile');
  }

  // Chats
  async getChats(): Promise<any[]> {
    return this.request<any[]>('/chats');
  }

  async getMessages(chatId: string): Promise<any[]> {
    return this.request<any[]>(`/chats/${chatId}/messages`);
  }

  async sendMessage(chatId: string, text: string): Promise<any> {
    return this.request<any>(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Plans
  async getPlans(): Promise<Plan[]> {
    return this.request<Plan[]>('/plans');
  }

  async buyPlan(planId: string): Promise<void> {
    await this.request<void>(`/plans/${planId}/buy`, {
      method: 'POST',
    });
  }

  // Boosts
  async boostAd(adId: string): Promise<void> {
    await this.request<void>(`/ads/${adId}/boost`, {
      method: 'POST',
    });
  }
}

export const api = new ApiService();
