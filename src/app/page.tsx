'use client';

import { App } from '@/components/App/App';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) {
    redirect('/auth');
  }

  return <App />;
}
