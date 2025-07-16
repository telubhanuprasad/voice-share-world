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
    console.log('useChats: Current user changed:', currentUser?.uid);
    if (!currentUser) {
      setChats({});
      setLoading(false);
      return;
    }

    let allMessages: FirebaseMessage[] = [];
    
    const updateChatsFromMessages = () => {
      const chatsData: { [key: string]: ChatData } = {};

      allMessages.forEach((message) => {
        // Only process messages where current user is involved
        if (message.senderId !== currentUser.uid && message.receiverId !== currentUser.uid) {
          return;
        }

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
      });

      // Sort messages by timestamp for each chat and update chat metadata
      Object.keys(chatsData).forEach(userId => {
        const chat = chatsData[userId];
        // Sort messages chronologically
        chat.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        // Update last message info from the most recent message
        if (chat.messages.length > 0) {
          const lastMessage = chat.messages[chat.messages.length - 1];
          chat.lastMessage = lastMessage.text;
          chat.lastMessageTime = lastMessage.timestamp;
        }

        // Count unread messages (messages sent by other user that are not read)
        chat.unreadCount = chat.messages.filter(
          msg => msg.senderId !== currentUser.uid && msg.status !== 'read'
        ).length;
      });

      setChats(chatsData);
      setLoading(false);
    };

    const processSentMessages = (snapshot: any) => {
      console.log('useChats: Received sent messages snapshot, size:', snapshot.size);
      snapshot.forEach((doc: any) => {
        const message = {
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        } as FirebaseMessage;
        
        console.log('useChats: Processing sent message:', message);
        
        const existingIndex = allMessages.findIndex(m => m.id === message.id);
        if (existingIndex >= 0) {
          allMessages[existingIndex] = message;
        } else {
          allMessages.push(message);
        }
      });
      console.log('useChats: All messages after processing sent:', allMessages.length);
      updateChatsFromMessages();
    };

    const processReceivedMessages = (snapshot: any) => {
      console.log('useChats: Received received messages snapshot, size:', snapshot.size);
      snapshot.forEach((doc: any) => {
        const message = {
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        } as FirebaseMessage;
        
        console.log('useChats: Processing received message:', message);
        
        const existingIndex = allMessages.findIndex(m => m.id === message.id);
        if (existingIndex >= 0) {
          allMessages[existingIndex] = message;
        } else {
          allMessages.push(message);
        }
      });
      console.log('useChats: All messages after processing received:', allMessages.length);
      updateChatsFromMessages();
    };

    // Use two separate queries to avoid composite index requirements
    const sentMessagesQuery = query(
      collection(db, 'messages'),
      where('senderId', '==', currentUser.uid),
      orderBy('timestamp', 'asc')
    );
    
    const receivedMessagesQuery = query(
      collection(db, 'messages'),
      where('receiverId', '==', currentUser.uid),
      orderBy('timestamp', 'asc')
    );

    // Listen to sent messages
    const unsubscribeSent = onSnapshot(
      sentMessagesQuery, 
      processSentMessages,
      (error) => {
        console.error('useChats: Error in sent messages query:', error);
        setLoading(false);
      }
    );

    // Listen to received messages  
    const unsubscribeReceived = onSnapshot(
      receivedMessagesQuery, 
      processReceivedMessages,
      (error) => {
        console.error('useChats: Error in received messages query:', error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
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