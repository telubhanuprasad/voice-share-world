export interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface FirebaseContact {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  contact: Contact;
  messages: Message[];
}