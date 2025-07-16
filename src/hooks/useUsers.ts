import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setUsers([]);
      setLoading(false);
      return;
    }

    // Query all users except the current user
    const usersQuery = query(
      collection(db, 'users'),
      where('uid', '!=', currentUser.uid),
      orderBy('uid'),
      orderBy('displayName')
    );

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersData: UserProfile[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          uid: data.uid,
          displayName: data.displayName,
          email: data.email,
          photoURL: data.photoURL,
          isOnline: data.isOnline,
          lastSeen: data.lastSeen?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return { users, loading };
};