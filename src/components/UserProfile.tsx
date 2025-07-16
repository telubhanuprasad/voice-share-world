import { useState } from 'react';
import { ArrowLeft, Camera, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import sarahAvatar from '@/assets/avatar-sarah.jpg';

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Sarah Johnson',
    about: 'Hey there! I am using WhatsApp.',
    phone: '+1 (555) 123-4567',
    avatar: sarahAvatar
  });
  
  const [editedInfo, setEditedInfo] = useState(userInfo);

  const handleSave = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
  };

  return (
    <div className="h-full bg-whatsapp-panel flex flex-col">
      {/* Header */}
      <div className="bg-whatsapp-header p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Profile</h1>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="ml-auto text-muted-foreground hover:text-foreground"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
          {isEditing && (
            <div className="ml-auto flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-whatsapp-green hover:text-whatsapp-green-light"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Avatar Section */}
        <div className="relative bg-whatsapp-header p-8 flex flex-col items-center border-b border-border">
          <div className="relative group">
            <img
              src={userInfo.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-whatsapp-green text-sm font-medium">Name</Label>
            {isEditing ? (
              <Input
                value={editedInfo.name}
                onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                className="bg-secondary border-none focus:ring-1 focus:ring-primary"
              />
            ) : (
              <div className="p-3 bg-secondary rounded-md">
                <p className="text-foreground">{userInfo.name}</p>
              </div>
            )}
          </div>

          {/* About */}
          <div className="space-y-2">
            <Label className="text-whatsapp-green text-sm font-medium">About</Label>
            {isEditing ? (
              <Textarea
                value={editedInfo.about}
                onChange={(e) => setEditedInfo({ ...editedInfo, about: e.target.value })}
                className="bg-secondary border-none focus:ring-1 focus:ring-primary resize-none"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-secondary rounded-md">
                <p className="text-foreground">{userInfo.about}</p>
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="text-whatsapp-green text-sm font-medium">Phone</Label>
            <div className="p-3 bg-secondary rounded-md">
              <p className="text-foreground">{userInfo.phone}</p>
              <p className="text-xs text-muted-foreground mt-1">
                This is not visible to your contacts.
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="border-t border-border">
          <div className="p-6 space-y-4">
            <h3 className="text-whatsapp-green text-sm font-medium">Settings</h3>
            
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-secondary rounded-md hover:bg-message-hover transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Account</span>
                  <span className="text-muted-foreground text-sm">Security notifications, change number</span>
                </div>
              </button>

              <button className="w-full text-left p-3 bg-secondary rounded-md hover:bg-message-hover transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Privacy</span>
                  <span className="text-muted-foreground text-sm">Block contacts, disappearing messages</span>
                </div>
              </button>

              <button className="w-full text-left p-3 bg-secondary rounded-md hover:bg-message-hover transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Chats</span>
                  <span className="text-muted-foreground text-sm">Theme, wallpapers, chat history</span>
                </div>
              </button>

              <button className="w-full text-left p-3 bg-secondary rounded-md hover:bg-message-hover transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Notifications</span>
                  <span className="text-muted-foreground text-sm">Message, group & call tones</span>
                </div>
              </button>

              <button className="w-full text-left p-3 bg-secondary rounded-md hover:bg-message-hover transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Storage and data</span>
                  <span className="text-muted-foreground text-sm">Network usage, auto-download</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}