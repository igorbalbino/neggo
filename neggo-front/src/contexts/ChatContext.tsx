import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, auth } from '../services/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  onSnapshot, 
  serverTimestamp, 
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

interface ChatRoom {
  id: string;
  ad_id: string;
  users: string[];
  contractor_id: string;
  contractor_name: string;
  artist_name: string;
  last_message: string;
  last_message_at: number;
  contractor_unread_count: number;
  artist_unread_count: number;
  updatedAt: Timestamp;
  // Field for compatibility with existing UI
  userName?: string;
  userPhoto?: string;
  adTitle?: string;
}

interface ChatContextType {
  chats: ChatRoom[];
  isLoading: boolean;
  startChat: (sellerId: string, adId: string, sellerName: string, adTitle: string, sellerPhoto?: string) => Promise<string>;
  markAsRead: (chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setChats([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, 'chats'),
      where('users', 'array-contains', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatRooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatRoom[];
      
      setChats(chatRooms);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching chats:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const startChat = async (
    sellerId: string, 
    adId: string, 
    sellerName: string, 
    adTitle: string,
    sellerPhoto?: string
  ): Promise<string> => {
    if (!auth.currentUser || !user) return '';

    try {
      // 1. Check if chat already exists
      const q = query(
        collection(db, 'chats'),
        where('ad_id', '==', adId),
        where('users', 'array-contains', auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);
      let chatId = '';

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.users.includes(sellerId)) {
          chatId = doc.id;
        }
      });

      if (chatId) return chatId;

      // 2. Create new chat if not found
      const docRef = await addDoc(collection(db, 'chats'), {
        ad_id: adId,
        adTitle, // Store ad title for convenience
        users: [auth.currentUser.uid, sellerId],
        contractor_id: auth.currentUser.uid,
        contractor_name: user.name,
        contractor_photo: user.photoUrl || '',
        artist_name: sellerName,
        artist_photo: sellerPhoto || '',
        last_message: 'Iniciou a conversa',
        last_message_at: Date.now(),
        contractor_unread_count: 0,
        artist_unread_count: 0,
        updatedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (e) {
      console.error('Error starting chat:', e);
      return '';
    }
  };

  const markAsRead = async (chatId: string) => {
    if (!auth.currentUser) return;
    
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (chatSnap.exists()) {
        const data = chatSnap.data();
        const isContractor = data.contractor_id === auth.currentUser.uid;
        const fieldToReset = isContractor ? 'contractor_unread_count' : 'artist_unread_count';
        
        if (data[fieldToReset] > 0) {
          await updateDoc(chatRef, {
            [fieldToReset]: 0
          });
        }
      }
    } catch (e) {
      console.error('Error marking as read:', e);
    }
  };

  return (
    <ChatContext.Provider value={{ chats, isLoading, startChat, markAsRead }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
