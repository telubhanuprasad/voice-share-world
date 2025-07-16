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

    // Use a single query to get all messages and filter client-side
    // This is simpler and avoids issues with multiple queries
    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      messagesQuery, 
      (snapshot) => {
        console.log('useChats: Received messages snapshot, total size:', snapshot.size);
        console.log('useChats: Current user UID:', currentUser.uid);
        const chatsData: { [key: string]: ChatData } = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log('useChats: Raw document data:', data);
          
          const message = {
            id: doc.id,
            text: data.text || '',
            senderId: data.senderId || '',
            receiverId: data.receiverId || '',
            timestamp: data.timestamp?.toDate() || new Date(),
            status: data.status || 'sent',
          } as FirebaseMessage;

          console.log('useChats: Processed message:', message);

          // Only process messages where current user is involved
          if (message.senderId !== currentUser.uid && message.receiverId !== currentUser.uid) {
            console.log('useChats: Message does not involve current user, skipping');
            return;
          }

          console.log('useChats: Message involves current user, processing...');

          // Determine the other participant
          const otherUserId = message.senderId === currentUser.uid 
            ? message.receiverId 
            : message.senderId;

          console.log('useChats: Other user ID:', otherUserId);

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
          console.log(`useChats: Processing chat for user ${userId}, message count:`, chat.messages.length);
          
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

        console.log('useChats: Final chats data:', chatsData);
        setChats(chatsData);
        setLoading(false);
      },
      (error) => {
        console.error('useChats: Error in messages query:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('useChats: Cleaning up message listener');
      unsubscribe();
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