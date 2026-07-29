import styles from './Profile.module.scss';
import { useAuth } from '@/context/AuthContext';
import { logoutUser, updateUserEmail, updateUserPassword } from '@/lib/firebase';
import { useUserStore } from '@/stores/userStore';
import { useEffect, useState } from 'react';
import { getUserData, updateUserData } from '@/db/client';
import { Input } from '@/components/Inputs/Input/Input';
import { Button } from '@/components/Buttons/Button/Button';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import { UserDataType } from '@/@types/userStoreTypes';
import { InputError } from '@/components/Inputs/InputError/InputError';

export const Profile = ({ closePopup }: { closePopup: () => void }) => {
  const setUser = useUserStore((state) => state.setUserData);
  const userData = useUserStore((state) => state.userData);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [changes, setChanges] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
  };

  const setUserData = async (uid: string, local?: boolean) => {
    if (local) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);

      return;
    }

    try {
      const data = await getUserData(uid);
      setUser({ ...data, uid } as UserDataType);

      if (data) {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
      }
    } catch (err) {
      console.error('Ошибка получения данных пользователя:', err);
    }
  };

  const saveUserData = async () => {
    if (!user) return;

    setError('');

    const emailChanged = email !== userData.email;
    const passwordChanged = !!password || !!secondPassword;
    const needsReauth = emailChanged || passwordChanged;

    if (needsReauth && !currentPassword) {
      setError('auth/requires-recent-login');
      return;
    }

    if (passwordChanged) {
      if (password !== secondPassword) {
        setError('password-not-match');
        return;
      }
    }

    try {
      if (emailChanged) {
        await updateUserEmail(email, currentPassword);
      }

      if (passwordChanged) {
        await updateUserPassword(password, currentPassword);
      }

      const updatedUser = {
        ...userData,
        firstName,
        lastName,
        email,
      };

      await updateUserData(user.uid, updatedUser);
      setUser(updatedUser);
      setFirstName(updatedUser.firstName);
      setLastName(updatedUser.lastName);
      setEmail(updatedUser.email);
      setPassword('');
      setSecondPassword('');
      setCurrentPassword('');
      setChanges(false);
    } catch (err: any) {
      setError(err.code || 'unknown_error');
    }
  };

  useEffect(() => {
    !user && redirect(`/`);

    if (user && !userData) {
      setUserData(user.uid);
    } else if (user && userData) {
      setUserData(user.uid, true);
    }

  }, [user]);

  useEffect(() => {
    if (!userData) {
      setChanges(false);
      return;
    }

    const profileChanged =
      firstName !== userData.firstName ||
      lastName !== userData.lastName ||
      email !== userData.email ||
      !!password ||
      !!secondPassword;

    setChanges(profileChanged);
  }, [firstName, lastName, email, password, secondPassword, userData]);

  return (
    <div className={styles.profile}>
      <div className={styles.profile__inner}>
        <div className={styles.profileForm}>
          <BackButton clickButton={closePopup} />
          <h1 className={styles.profileTitle}>Личный кабинет</h1>
          <Input type={'text'} placeholder={'Имя'} value={firstName} onChange={setFirstName} />
          <Input type={'text'} placeholder={'Фамилия'} value={lastName} onChange={setLastName} />
          <Input type={'email'} placeholder={'Почта'} value={email} onChange={setEmail} />
          <Input type={'password'} placeholder={'Новый пароль'} value={password} onChange={setPassword} />
          <Input type={'password'} placeholder={'Повторите пароль'} value={secondPassword} onChange={setSecondPassword} />
          {(email !== userData?.email || password || secondPassword) && (
            <Input
              type={'password'}
              placeholder={'Текущий пароль'}
              value={currentPassword}
              onChange={setCurrentPassword}
            />
          )}
          <InputError error={error} />
          <div className={styles.profileButtons}>
            {changes && <Button label={'Сохранить изменения'} type={'button'} onClick={saveUserData} />}
            <Button label={'Выйти из аккаунта'} type={'button'} onClick={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
};
