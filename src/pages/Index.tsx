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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-whatsapp-bg">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  // Convert Firebase chat data to Chat format for the selected user
  const selectedChat = selectedContactId && chats[selectedContactId] ? {
    id: selectedContactId,
    contact: {
      id: selectedContactId,
      name: users.find(u => u.uid === selectedContactId)?.displayName || 'Unknown User',
      avatar: users.find(u => u.uid === selectedContactId)?.photoURL || '',
      lastMessage: chats[selectedContactId].lastMessage,
      lastMessageTime: chats[selectedContactId].lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: chats[selectedContactId].unreadCount,
      isOnline: users.find(u => u.uid === selectedContactId)?.isOnline || false,
    },
    messages: chats[selectedContactId].messages.map(msg => ({
      id: msg.id,
      text: msg.text,
      timestamp: msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: msg.senderId === currentUser?.uid,
      status: msg.status,
    })),
  } : null;

  const handleSendMessage = async (chatId: string, text: string) => {
    try {
      await sendMessage(chatId, text);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="h-screen flex bg-whatsapp-bg">
      {/* Sidebar - Chat List */}
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

      {/* Main Chat Window */}
      <ChatWindow
        chat={selectedChat}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Index;
