'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen';
import { useSessionBootstrap } from '@/hooks/useSessionBootstrap';
import { auth } from '@/lib/firebase/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [bootstrapReady, setBootstrapReady] = useState(false);

  const handleBootstrapReady = useCallback(() => {
    setBootstrapReady(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setBootstrapReady(false);
      setUser(nextUser);
      setAuthResolved(true);
    });

    return () => unsubscribe();
  }, []);

  useSessionBootstrap(user, authResolved, handleBootstrapReady);

  const loading = !authResolved || !bootstrapReady;

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
