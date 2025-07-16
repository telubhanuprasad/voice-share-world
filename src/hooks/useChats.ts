import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  serverTimestamp,
  or,
  and
} from 'firebase/firestore';
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

    // Listen to messages where current user is sender or receiver
    const messagesQuery = query(
      collection(db, 'messages'),
      or(
        where('senderId', '==', currentUser.uid),
        where('receiverId', '==', currentUser.uid)
      ),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const chatsData: { [key: string]: ChatData } = {};

      snapshot.forEach((doc) => {
        const message = {
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        } as FirebaseMessage;

        // Determine the other participant
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
        
        // Update last message info
        if (message.timestamp > chatsData[otherUserId].lastMessageTime) {
          chatsData[otherUserId].lastMessage = message.text;
          chatsData[otherUserId].lastMessageTime = message.timestamp;
        }

        // Count unread messages (messages sent by other user)
        if (message.senderId !== currentUser.uid && message.status !== 'read') {
          chatsData[otherUserId].unreadCount++;
        }
      });

      setChats(chatsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const sendMessage = async (receiverId: string, text: string) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text,
        senderId: currentUser.uid,
        receiverId,
        timestamp: serverTimestamp(),
        status: 'sent',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return { chats, loading, sendMessage };
};