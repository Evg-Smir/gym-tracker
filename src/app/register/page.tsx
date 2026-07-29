'use client';

import { Registration } from '@/components/Registration/Registration';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function RegistrationPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) {
    redirect('/');
  }

  return <Registration />;
}
