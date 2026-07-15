import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { authenticateWithFirebase, signOutFirebase } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => api.getToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (api.isAuthenticated()) {
        try {
          const profile = await api.getProfile();
          setUser(profile);
          setToken(api.getToken());
          localStorage.setItem('neggo_user', JSON.stringify(profile));

          const chatToken = localStorage.getItem('neggo_chat_token');
          if (chatToken && chatToken !== 'undefined') {
            try {
              await authenticateWithFirebase(chatToken);
            } catch (fbErr) {
              console.error('Failed to re-auth with Firebase on init', fbErr);
            }
          }
        } catch (err) {
          console.error('Failed to fetch profile', err);
          await api.logout();
          setUser(null);
          setToken(null);
          localStorage.removeItem('neggo_user');
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('neggo_user');
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await api.login(email, password);
    setUser(result.user);
    setToken(api.getToken());
    if (result.chatToken) {
      localStorage.setItem('neggo_chat_token', result.chatToken);
    }
    localStorage.setItem('neggo_user', JSON.stringify(result.user));
  };

  const logout = async () => {
    try {
      await signOutFirebase();
    } catch {
      // ignore firebase sign-out errors
    }
    await api.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('neggo_user');
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('neggo_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
