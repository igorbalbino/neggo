import { Ad, User, Location, Plan } from '../types';
import { authenticateWithFirebase } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-neggo.creatioinc.com/api';

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

  async logout() {
    try {
      if (this.token) {
        await this.request<void>('/auth/logout', { method: 'POST' });
      }
    } catch {
      // Ignore network/auth errors on logout — always clear local session.
    } finally {
      this.token = null;
      localStorage.removeItem('neggo_token');
      localStorage.removeItem('neggo_chat_token');
    }
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
      localStorage.setItem('neggo_chat_token', result.chatToken);
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

  async deleteAd(adId: string): Promise<void> {
    await this.request<void>(`/ads/${adId}`, {
      method: 'DELETE',
    });
  }

  // Profile
  async getProfile(): Promise<User> {
    return this.request<User>('/profile');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Files/Images
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
      },
      body: formData,
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Upload failed');
    return result.data;
  }

  // Plans
  async getPlans(): Promise<Plan[]> {
    return this.request<Plan[]>('/plans');
  }

  async buyPlan(planId: string): Promise<{ checkoutUrl?: string }> {
    return this.request<{ checkoutUrl?: string }>(`/plans/${planId}/buy`, {
      method: 'POST',
    });
  }

  // Boosts
  async boostAd(adId: string): Promise<{ checkoutUrl?: string }> {
    return this.request<{ checkoutUrl?: string }>(`/ads/${adId}/boost`, {
      method: 'POST',
    });
  }

  async getMyAds(): Promise<Ad[]> {
    return this.request<Ad[]>('/my-ads');
  }

  async getFavorites(): Promise<Ad[]> {
    return this.request<Ad[]>('/favorites');
  }

  async toggleFavorite(adId: string): Promise<void> {
    await this.request<void>(`/ads/${adId}/favorite`, {
      method: 'POST',
    });
  }

  // Notifications
  async getNotifications(): Promise<any[]> {
    return this.request<any[]>('/notifications');
  }

  async markNotificationsRead(): Promise<void> {
    await this.request<void>('/notifications/read', {
      method: 'POST',
    });
  }
}

export const api = new ApiService();
