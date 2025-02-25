'use client';

import { useEffect } from 'react';

import { redirect } from 'next/navigation';

import { logoutUser } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  useEffect(() => {
    !user && redirect(`/auth`);
  }, [user]);


  const handleLogout = async () => {
    await logoutUser();
    alert('Вы вышли из аккаунта!');
  };

  return (
    <>
      {user &&
        <>
          <span>Привет, {user.displayName}!</span>
          <br/>
          <button onClick={handleLogout}>Выйти</button>
        </>
      }
    </>
  );
}
