import { useState } from 'react';
import { Send, Phone, Video, MoreVertical, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  status: 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface Chat {
  id: string;
  contact: Contact;
  messages: Message[];
}

interface ChatWindowProps {
  chat: Chat | null;
  onSendMessage: (chatId: string, text: string) => void;
}

export function ChatWindow({ chat, onSendMessage }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() && chat) {
      onSendMessage(chat.id, newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-whatsapp-chat-bg">
        <div className="text-center max-w-md">
          <div className="w-80 h-80 mx-auto mb-8 opacity-10">
            <svg viewBox="0 0 303 172" className="w-full h-full text-muted-foreground fill-current">
              <path d="M229.6 165.6c10.4 0 18.8-8.4 18.8-18.8V25.2c0-10.4-8.4-18.8-18.8-18.8H73.4c-10.4 0-18.8 8.4-18.8 18.8v121.6c0 10.4 8.4 18.8 18.8 18.8h156.2z" />
              <path d="M65.1 25.2c0-4.6 3.7-8.3 8.3-8.3h156.2c4.6 0 8.3 3.7 8.3 8.3v121.6c0 4.6-3.7 8.3-8.3 8.3H73.4c-4.6 0-8.3-3.7-8.3-8.3V25.2z" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <h2 className="text-3xl font-light text-muted-foreground mb-4">WhatsApp Web</h2>
          <p className="text-muted-foreground leading-relaxed">
            Send and receive messages without keeping your phone online.<br />
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-whatsapp-chat-bg">
      {/* Chat Header */}
      <div className="bg-whatsapp-header p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={chat.contact.avatar} alt={chat.contact.name} />
              <AvatarFallback className="bg-whatsapp-green text-white">
                {chat.contact.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium text-foreground">{chat.contact.name}</h2>
              <p className="text-sm text-muted-foreground">
                {chat.contact.isOnline ? 'online' : 'last seen recently'}
              </p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:bg-whatsapp-header/50 hover:text-foreground">
              <Video className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:bg-whatsapp-header/50 hover:text-foreground">
              <Phone className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:bg-whatsapp-header/50 hover:text-foreground">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p>No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          chat.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-whatsapp-header border-t border-border">
        <div className="flex items-center space-x-3">
          <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Smile className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="bg-secondary border-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-whatsapp-green hover:bg-whatsapp-green-light text-white"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={`flex ${message.isSent ? 'justify-end' : 'justify-start'} mb-1`}>
      <div
        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg shadow-sm ${
          message.isSent
            ? 'bg-message-sent text-white'
            : 'bg-message-received text-foreground'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div className={`flex items-center justify-end mt-1 space-x-1 ${
          message.isSent ? 'text-white/70' : 'text-muted-foreground'
        }`}>
          <span className="text-xs">{message.timestamp}</span>
          {message.isSent && (
            <div className="flex">
              {message.status === 'sent' && (
                <svg width="12" height="8" viewBox="0 0 16 12" className="fill-current">
                  <path d="M11.1 2.7L5.5 8.3l-2.6-2.6L1.5 7.1l4.0 4.0 7.0-7.0z" />
                </svg>
              )}
              {message.status === 'delivered' && (
                <svg width="12" height="8" viewBox="0 0 16 12" className="fill-current">
                  <path d="M11.1 2.7L5.5 8.3l-2.6-2.6L1.5 7.1l4.0 4.0 7.0-7.0z" />
                  <path d="M15.1 2.7L9.5 8.3l-1.6-1.6 1.4-1.4 2.2 2.2 4.2-4.2z" />
                </svg>
              )}
              {message.status === 'read' && (
                <svg width="12" height="8" viewBox="0 0 16 12" className="fill-whatsapp-green">
                  <path d="M11.1 2.7L5.5 8.3l-2.6-2.6L1.5 7.1l4.0 4.0 7.0-7.0z" />
                  <path d="M15.1 2.7L9.5 8.3l-1.6-1.6 1.4-1.4 2.2 2.2 4.2-4.2z" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}