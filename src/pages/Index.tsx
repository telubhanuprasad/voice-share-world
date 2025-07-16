import { useState } from 'react';
import { ChatList } from '@/components/ChatList';
import { ChatWindow } from '@/components/ChatWindow';
import { UserProfile } from '@/components/UserProfile';
import { Chat } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { Login } from '@/components/Login';
import { useChats } from '@/hooks/useChats';
import { useUsers } from '@/hooks/useUsers';

const Index = () => {
  const { currentUser, loading } = useAuth();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const { chats, loading: chatsLoading, sendMessage } = useChats();
  const { users } = useUsers();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Login />;

  const selectedChat = selectedContactId ? {
    id: selectedContactId,
    contact: {
      id: selectedContactId,
      name: users.find(u => u.uid === selectedContactId)?.displayName || 'Unknown User',
      avatar: users.find(u => u.uid === selectedContactId)?.photoURL || '',
      lastMessage: chats[selectedContactId]?.lastMessage || '',
      lastMessageTime: chats[selectedContactId]?.lastMessageTime ? 
        new Date(chats[selectedContactId].lastMessageTime).toLocaleString([], { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : '',
      unreadCount: chats[selectedContactId]?.unreadCount || 0,
      isOnline: users.find(u => u.uid === selectedContactId)?.isOnline || false,
    },
    messages: chats[selectedContactId]?.messages?.map(msg => {
      const messageDate = msg.timestamp; // Already a Date
      const now = new Date();
      const isToday = messageDate.toDateString() === now.toDateString();
      
      return {
        id: msg.id,
        text: msg.text,
        timestamp: isToday ? 
          messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
          messageDate.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        isSent: msg.senderId === currentUser?.uid,
        status: msg.status,
      };
    }) || [],
  } : null;

  // Debug logging
  console.log('🔍 Debug - Selected contact ID:', selectedContactId);
  console.log('🔍 Debug - Chat data for selected contact:', chats[selectedContactId || '']);
  console.log('🔍 Debug - Raw messages:', chats[selectedContactId || '']?.messages);
  console.log('🔍 Debug - Processed selectedChat:', selectedChat);
  console.log('🔍 Debug - Final messages array:', selectedChat?.messages);

  const handleSendMessage = async (chatId: string, text: string) => {
    await sendMessage(chatId, text);
  };

  return (
    <div className="h-screen flex bg-whatsapp-bg">
      <div className="w-80 lg:w-96">
        {showProfile ? (
          <UserProfile onBack={() => setShowProfile(false)} />
        ) : (
          <ChatList
            selectedContactId={selectedContactId}
            onContactSelect={setSelectedContactId}
            onProfileClick={() => setShowProfile(true)}
            chats={chats}
          />
        )}
      </div>
      <ChatWindow
        chat={selectedChat}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Index;
