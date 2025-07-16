import { Contact, Chat, Message } from '@/types/chat';
import sarahAvatar from '@/assets/avatar-sarah.jpg';
import johnAvatar from '@/assets/avatar-john.jpg';
import emilyAvatar from '@/assets/avatar-emily.jpg';
import alexAvatar from '@/assets/avatar-alex.jpg';

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: sarahAvatar,
    lastMessage: 'Hey! How are you doing?',
    lastMessageTime: '2:30 PM',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: 'John Smith',
    avatar: johnAvatar,
    lastMessage: 'The meeting is at 3 PM',
    lastMessageTime: '1:45 PM',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Emily Davis',
    avatar: emilyAvatar,
    lastMessage: 'Thanks for your help!',
    lastMessageTime: '12:15 PM',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Alex Wilson',
    avatar: alexAvatar,
    lastMessage: 'Sure, let me check that',
    lastMessageTime: '11:30 AM',
    unreadCount: 0,
    isOnline: false,
  },
];

export const mockChats: { [key: string]: Chat } = {
  '1': {
    id: '1',
    contact: contacts[0],
    messages: [
      {
        id: '1',
        text: 'Hi there! How was your weekend?',
        timestamp: '2:25 PM',
        isSent: false,
        status: 'read',
      },
      {
        id: '2',
        text: 'It was great! Went hiking with friends. How about you?',
        timestamp: '2:27 PM',
        isSent: true,
        status: 'read',
      },
      {
        id: '3',
        text: 'Hey! How are you doing?',
        timestamp: '2:30 PM',
        isSent: false,
        status: 'delivered',
      },
    ],
  },
  '2': {
    id: '2',
    contact: contacts[1],
    messages: [
      {
        id: '1',
        text: 'Don\'t forget about the team meeting today',
        timestamp: '1:40 PM',
        isSent: false,
        status: 'read',
      },
      {
        id: '2',
        text: 'Thanks for the reminder! What time again?',
        timestamp: '1:42 PM',
        isSent: true,
        status: 'read',
      },
      {
        id: '3',
        text: 'The meeting is at 3 PM',
        timestamp: '1:45 PM',
        isSent: false,
        status: 'read',
      },
    ],
  },
  '3': {
    id: '3',
    contact: contacts[2],
    messages: [
      {
        id: '1',
        text: 'Could you help me with the project proposal?',
        timestamp: '12:10 PM',
        isSent: false,
        status: 'read',
      },
      {
        id: '2',
        text: 'Of course! I\'ll send you the template',
        timestamp: '12:12 PM',
        isSent: true,
        status: 'read',
      },
      {
        id: '3',
        text: 'Thanks for your help!',
        timestamp: '12:15 PM',
        isSent: false,
        status: 'delivered',
      },
    ],
  },
  '4': {
    id: '4',
    contact: contacts[3],
    messages: [
      {
        id: '1',
        text: 'Can you review the document I sent?',
        timestamp: '11:25 AM',
        isSent: false,
        status: 'read',
      },
      {
        id: '2',
        text: 'Sure, let me check that',
        timestamp: '11:30 AM',
        isSent: false,
        status: 'read',
      },
    ],
  },
};