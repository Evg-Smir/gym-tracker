'use client';

import { useEffect } from 'react';

import { redirect } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/components/Profile/Profile';

export default function ProfilePage() {
  const { user } = useAuth();

  useEffect(() => {
    !user && redirect(`/auth`);
  }, [user]);

  return (
    user && <Profile />
  );
}
