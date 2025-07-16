import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Login } from '@/components/Login';
import { useChats } from '@/hooks/useChats';
import { useUsers } from '@/hooks/useUsers';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatWindow } from '@/components/ChatWindow';
import { UserProfile } from '@/components/UserProfile';

const Index = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const { chats, loading: chatsLoading, sendMessage } = useChats();
  const { users } = useUsers();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-whatsapp-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return <Login />;

  // Create selectedChat object with proper message formatting
  const selectedChat = selectedContactId && chats[selectedContactId] ? {
    id: selectedContactId,
    contact: {
      id: selectedContactId,
      name: users.find(u => u.uid === selectedContactId)?.displayName || 'Unknown User',
      avatar: users.find(u => u.uid === selectedContactId)?.photoURL || '',
      isOnline: users.find(u => u.uid === selectedContactId)?.isOnline || false,
    },
    messages: chats[selectedContactId].messages.map(msg => ({
      id: msg.id,
      text: msg.text,
      timestamp: msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: msg.senderId === currentUser.uid,
      status: msg.status,
    }))
  } : null;

  const handleSendMessage = async (chatId: string, text: string) => {
    await sendMessage(chatId, text);
  };

  return (
    <div className="h-screen flex bg-whatsapp-bg">
      <div className="w-80 lg:w-96">
        {showProfile ? (
          <UserProfile onBack={() => setShowProfile(false)} />
        ) : (
          <ChatSidebar
            chats={chats}
            users={users}
            selectedContactId={selectedContactId}
            onContactSelect={setSelectedContactId}
            onProfileClick={() => setShowProfile(true)}
            loading={chatsLoading}
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
