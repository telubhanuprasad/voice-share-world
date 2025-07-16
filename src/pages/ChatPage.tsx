import { useState } from 'react';
import { useChats } from '@/hooks/useChats';
import { useAuth } from '@/contexts/AuthContext';

interface ChatData {
  id: string;
  participants: string[];
  messages: {
    id: string;
    text: string;
    senderId: string;
    receiverId: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
  }[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

const ChatPage = () => {
  const { chats, loading } = useChats();
  const { currentUser } = useAuth();
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);

  // Debug logging
  console.log('=== ChatPage Debug ===');
  console.log('Loading:', loading);
  console.log('Current user:', currentUser?.uid);
  console.log('Chats object:', chats);
  console.log('Chats count:', Object.keys(chats).length);
  console.log('Chats values:', Object.values(chats));
  console.log('Selected chat:', selectedChat);
  console.log('Selected chat messages:', selectedChat?.messages);
  console.log('Selected chat messages length:', selectedChat?.messages?.length || 0);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading chats...</p>
    </div>
  );

  const chatList = Object.values(chats);
  console.log('Chat list for rendering:', chatList);

  return (
    <div className="flex h-screen bg-background">
      {/* Chat List */}
      <div className="w-1/3 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">Chats ({chatList.length})</h1>
        </div>
        
        <div className="overflow-y-auto">
          {chatList.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No chats found. Send a message to start a conversation.
            </div>
          ) : (
            chatList.map(chat => (
              <div
                key={chat.id}
                className={`cursor-pointer p-4 border-b border-border hover:bg-accent transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-accent' : ''
                }`}
                onClick={() => {
                  console.log('Selecting chat:', chat);
                  setSelectedChat(chat);
                }}
              >
                <p className="font-medium text-foreground">Chat with {chat.id}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {chat.lastMessage || 'No messages yet'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Messages: {chat.messages?.length || 0}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="w-2/3 flex flex-col bg-background">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-border bg-card">
              <h2 className="text-xl font-semibold text-foreground">
                Chat with {selectedChat.id}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedChat.messages?.length || 0} messages
              </p>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {!selectedChat.messages || selectedChat.messages.length === 0 ? (
                <div className="text-center text-muted-foreground mt-8">
                  <p>No messages in this chat yet.</p>
                  <p className="text-xs mt-2">Start a conversation!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedChat.messages.map(msg => {
                    const isCurrentUser = msg.senderId === currentUser?.uid;
                    console.log('Rendering message:', msg, 'isCurrentUser:', isCurrentUser);
                    
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isCurrentUser
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">
                            {isCurrentUser ? 'You' : `User ${msg.senderId.slice(-4)}`}
                          </p>
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {msg.timestamp instanceof Date 
                              ? msg.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })
                              : 'Invalid time'
                            }
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">Select a chat to view messages</p>
              <p className="text-sm">Choose a conversation from the left panel</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;