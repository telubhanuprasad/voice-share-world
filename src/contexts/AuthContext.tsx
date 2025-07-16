import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { AuthUser, UserProfile } from '@/types/auth';

interface AuthContextType {
  currentUser: AuthUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Create or update user profile in Firestore
      const userProfile: Omit<UserProfile, 'lastSeen' | 'createdAt'> = {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous',
        email: user.email || '',
        photoURL: user.photoURL || '',
        isOnline: true,
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...userProfile,
        lastSeen: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true });
      
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (currentUser) {
        // Update user status to offline before logging out
        await updateDoc(doc(db, 'users', currentUser.uid), {
          isOnline: false,
          lastSeen: serverTimestamp(),
        });
      }
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        setCurrentUser(user as AuthUser);
        
        // Update user online status
        await updateDoc(doc(db, 'users', user.uid), {
          isOnline: true,
          lastSeen: serverTimestamp(),
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Update user status when the page is closed
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentUser) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          isOnline: false,
          lastSeen: serverTimestamp(),
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentUser]);

  const value = {
    currentUser,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};