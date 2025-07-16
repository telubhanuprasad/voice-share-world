import { User as FirebaseUser } from 'firebase/auth';

export interface AuthUser extends FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}