import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { authenticateWithFirebase } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('neggo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (api.isAuthenticated()) {
        try {
          const profile = await api.getProfile();
          setUser(profile);
          localStorage.setItem('neggo_user', JSON.stringify(profile));

          // Re-auth with Firebase if token exists
          const chatToken = localStorage.getItem('neggo_chat_token');
          if (chatToken) {
            try {
              await authenticateWithFirebase(chatToken);
            } catch (fbErr) {
              console.error('Failed to re-auth with Firebase on init', fbErr);
            }
          }
        } catch (err) {
          console.error('Failed to fetch profile', err);
          api.logout();
          setUser(null);
          localStorage.removeItem('neggo_user');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await api.login(email, password);
    setUser(result.user);
	localStorage.setItem('neggo_chat_token', result.chatToken);
    localStorage.setItem('neggo_user', JSON.stringify(result.user));
  };

  const logout = () => {
    api.logout();
    setUser(null);
    localStorage.removeItem('neggo_user');
	localStorage.removeItem('neggo_chat_token');
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('neggo_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
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
