'use client';

import { Registration } from '@/components/Registration/Registration';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function RegistrationPage() {
  const { user } = useAuth();

  useEffect(() => {
    user && redirect(`/`);
  }, [user]);

  return (
    <Registration />
  );
}
