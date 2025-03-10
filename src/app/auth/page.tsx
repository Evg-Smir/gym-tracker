'use client';

import { Authentication } from '@/components/Authentication/Authentication';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function AuthenticationPage() {
  const { user } = useAuth();

  useEffect(() => {
    user && redirect(`/`);
  }, [user]);

  return (
    <Authentication />
  );
}
