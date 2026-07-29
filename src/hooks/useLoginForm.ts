import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { signInWithEmail } from '@/application/auth';
import { toAppError } from '@/domain/errors/AppError';
import { useUserStore } from '@/stores/userStore';

export const useLoginForm = () => {
  const setUser = useUserStore((state) => state.setUserData);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userData = await signInWithEmail(email, password);
      if (!userData) return;
      setUser(userData);
      router.push('/');
    } catch (err) {
      setError(toAppError(err).code);
    }
  };

  return {
    email,
    password,
    error,
    setEmail,
    setPassword,
    handleLogin,
  };
};
