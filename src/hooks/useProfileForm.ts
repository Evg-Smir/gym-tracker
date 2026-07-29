import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  loadProfileUserData,
  logoutUser,
  ProfileFormValues,
  saveProfileChanges,
} from '@/application/updateProfile';
import { toAppError } from '@/domain/errors/AppError';
import { useAuth } from '@/context/AuthContext';
import { useUserStore } from '@/stores/userStore';

const emptyForm: ProfileFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  secondPassword: '',
  currentPassword: '',
};

export const useProfileForm = () => {
  const { user } = useAuth();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUserData);
  const userData = useUserStore((state) => state.userData);
  const [form, setForm] = useState<ProfileFormValues>(emptyForm);
  const [error, setError] = useState('');
  const [changes, setChanges] = useState(false);

  const setField = <K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!user) {
      router.replace('/');
      return;
    }

    const hydrate = async () => {
      if (userData?.uid === user.uid && userData.firstName) {
        setForm((prev) => ({
          ...prev,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        }));
        return;
      }

      const data = await loadProfileUserData(user.uid);
      if (!data) return;
      setUser(data);
      setForm((prev) => ({
        ...prev,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      }));
    };

    void hydrate();
  }, [user, userData, setUser, router]);

  useEffect(() => {
    if (!userData?.uid) {
      setChanges(false);
      return;
    }

    setChanges(
      form.firstName !== userData.firstName ||
        form.lastName !== userData.lastName ||
        form.email !== userData.email ||
        !!form.password ||
        !!form.secondPassword,
    );
  }, [form, userData]);

  const saveUserData = async () => {
    if (!user || !userData) return;

    setError('');

    try {
      const updatedUser = await saveProfileChanges(user, userData, form);
      setUser(updatedUser);
      setForm({
        ...emptyForm,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      });
      setChanges(false);
    } catch (err) {
      setError(toAppError(err).code);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  return {
    form,
    error,
    changes,
    userData,
    setField,
    saveUserData,
    handleLogout,
  };
};
