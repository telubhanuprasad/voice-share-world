import { Search, MoreVertical, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Contact, FirebaseContact } from '@/types/chat';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/contexts/AuthContext';

interface ChatListProps {
  selectedContactId: string | null;
  onContactSelect: (contactId: string) => void;
  onProfileClick: () => void;
}

export const ChatList = ({ selectedContactId, onContactSelect, onProfileClick }: ChatListProps) => {
  const { users, loading } = useUsers();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Convert Firebase users to Contact format
  const contacts: Contact[] = users.map(user => ({
    id: user.uid,
    name: user.displayName,
    avatar: user.photoURL,
    lastMessage: "Start a conversation",
    lastMessageTime: "",
    unreadCount: 0,
    isOnline: user.isOnline,
  }));

  return (
    <div className="flex flex-col h-full bg-whatsapp-panel border-r border-border">
      {/* Header */}
      <div className="bg-whatsapp-header p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">WhatsApp</h1>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-whatsapp-header-foreground hover:bg-whatsapp-header/50"
              onClick={onProfileClick}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-whatsapp-header-foreground hover:bg-whatsapp-header/50"
              onClick={handleLogout}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search or start new chat"
            className="pl-10 bg-secondary border-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading users...</div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">No other users found</div>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onContactSelect(contact.id)}
              className={`p-4 cursor-pointer transition-colors hover:bg-message-hover border-b border-border/50 ${
                selectedContactId === contact.id ? 'bg-message-hover' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback className="bg-whatsapp-green text-white">
                      {contact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-whatsapp-green rounded-full border-2 border-whatsapp-panel"></div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground truncate">{contact.name}</h3>
                    <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                    {contact.unreadCount > 0 && (
                      <span className="bg-whatsapp-green text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};