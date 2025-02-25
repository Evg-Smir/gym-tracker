'use client';

import { useEffect, useState } from 'react';

import { redirect } from 'next/navigation';

import { getUserData, logoutUser } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  useEffect(() => {
    !user && redirect(`/auth`);
  }, [user]);

  return (
    <>
      {user &&
        <>
          <span>Привет, {user.displayName}!</span>
          <br/>
          <button onClick={logoutUser}>Выйти</button>
        </>
      }
    </>
  );
}
