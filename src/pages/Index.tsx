import { useState } from 'react';
import { ChatList } from '@/components/ChatList';
import { ChatWindow } from '@/components/ChatWindow';
import { UserProfile } from '@/components/UserProfile';
import { Chat } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { Login } from '@/components/Login';

const Index = () => {
  const { currentUser, loading } = useAuth();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [chats, setChats] = useState<{ [key: string]: Chat }>({});
  const [showProfile, setShowProfile] = useState(false);

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

  const selectedChat = selectedContactId ? chats[selectedContactId] : null;

  const handleSendMessage = (chatId: string, text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      status: 'sent' as const,
    };

    setChats(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        messages: [...prev[chatId].messages, newMessage],
      },
    }));

    // Simulate message status updates
    setTimeout(() => {
      setChats(prev => ({
        ...prev,
        [chatId]: {
          ...prev[chatId],
          messages: prev[chatId].messages.map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          ),
        },
      }));
    }, 1000);

    setTimeout(() => {
      setChats(prev => ({
        ...prev,
        [chatId]: {
          ...prev[chatId],
          messages: prev[chatId].messages.map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          ),
        },
      }));
    }, 2000);
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
