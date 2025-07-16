// useChats.ts
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface FirebaseMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatData {
  id: string;
  participants: string[];
  messages: FirebaseMessage[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export const useChats = () => {
  const [chats, setChats] = useState<{ [key: string]: ChatData }>({});
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setChats({});
      setLoading(false);
      return;
    }

    const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const chatsData: { [key: string]: ChatData } = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const message = {
          id: doc.id,
          text: data.text || '',
          senderId: data.senderId || '',
          receiverId: data.receiverId || '',
          timestamp: data.timestamp?.toDate?.() || new Date(),
          status: data.status || 'sent',
        } as FirebaseMessage;

        if (message.senderId !== currentUser.uid && message.receiverId !== currentUser.uid) return;

        const otherUserId = message.senderId === currentUser.uid 
          ? message.receiverId 
          : message.senderId;

        if (!chatsData[otherUserId]) {
          chatsData[otherUserId] = {
            id: otherUserId,
            participants: [currentUser.uid, otherUserId],
            messages: [],
            lastMessage: '',
            lastMessageTime: new Date(0),
            unreadCount: 0,
          };
        }

        chatsData[otherUserId].messages.push(message);
      });

      Object.keys(chatsData).forEach(userId => {
        const chat = chatsData[userId];
        chat.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        if (chat.messages.length > 0) {
          const lastMessage = chat.messages[chat.messages.length - 1];
          chat.lastMessage = lastMessage.text;
          chat.lastMessageTime = lastMessage.timestamp;
        }

        chat.unreadCount = chat.messages.filter(
          msg => msg.senderId !== currentUser.uid && msg.status !== 'read'
        ).length;
      });

      setChats(chatsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const sendMessage = async (receiverId: string, text: string) => {
    if (!currentUser) return;
    await addDoc(collection(db, 'messages'), {
      text,
      senderId: currentUser.uid,
      receiverId,
      timestamp: serverTimestamp(),
      status: 'sent',
    });
  };

  return { chats, loading, sendMessage };
};
