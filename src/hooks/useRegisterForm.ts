import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { signUpWithEmail } from '@/application/auth';
import { AppError, toAppError } from '@/domain/errors/AppError';
import { useUserStore } from '@/stores/userStore';

interface RegisterFormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordSecond: string;
}

export const useRegisterForm = () => {
  const setUser = useUserStore((state) => state.setUserData);
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordSecond: '',
  });
  const [error, setError] = useState('');

  const setField = <K extends keyof RegisterFormState>(key: K, value: RegisterFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.passwordSecond !== form.password) {
      setError('password-not-match');
      return;
    }

    try {
      const userData = await signUpWithEmail(
        form.email,
        form.password,
        form.firstName,
        form.lastName,
      );
      if (!userData) {
        throw new AppError('unknown_error');
      }
      setUser(userData);
      router.push('/');
    } catch (err) {
      setError(toAppError(err).code);
    }
  };

  return {
    form,
    error,
    setField,
    handleSubmit,
  };
};
