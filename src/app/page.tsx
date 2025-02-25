'use client';

import { useEffect } from 'react';

import { redirect } from 'next/navigation';

import { App } from '@/components/App/App';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    !user && redirect(`/auth`);
  }, [user]);

  return (
    <App />
  );
}
