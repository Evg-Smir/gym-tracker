'use client';

import { Authentication } from '@/components/Authentication/Authentication';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function AuthenticationPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) {
    redirect('/');
  }

  return <Authentication />;
}
