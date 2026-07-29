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
  const [info, setInfo] = useState('');
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const loadUserData = async (uid: string) => {
    try {
      const data = await getUserData(uid);
      if (!data) return;
      setUser(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
    } catch (err) {
      console.error('Ошибка получения данных пользователя:', err);
    }
  };

  const saveUserData = async () => {
    if (!user) return;

    setError('');
    setInfo('');

    const emailChanged = email !== userData.email;
    const passwordChanged = !!password || !!secondPassword;
    const needsReauth = emailChanged || passwordChanged;

    if (needsReauth && !currentPassword) {
      setError('auth/requires-recent-login');
      return;
    }

    if (passwordChanged && password !== secondPassword) {
      setError('password-not-match');
      return;
    }

    try {
      if (emailChanged) {
        await updateUserEmail(email, currentPassword);
        setInfo('auth/email-verification-sent');
      }

      if (passwordChanged) {
        await updateUserPassword(password, currentPassword);
      }

      const updatedUser = {
        ...userData,
        firstName,
        lastName,
        email: emailChanged ? userData.email : email,
      };

      await updateUserData(user.uid, updatedUser);
      setUser(updatedUser);
      setFirstName(updatedUser.firstName);
      setLastName(updatedUser.lastName);
      setEmail(emailChanged ? email : updatedUser.email);
      setPassword('');
      setSecondPassword('');
      setCurrentPassword('');
      setChanges(false);
    } catch (err: unknown) {
      const code = typeof err === 'object' && err && 'code' in err
        ? String((err as { code: string }).code)
        : 'unknown_error';
      setError(code);
    }
  };

  useEffect(() => {
    if (!user) {
      redirect('/auth');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (userData.uid === user.uid) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
      return;
    }

    void loadUserData(user.uid);
  }, [user, userData.uid, userData.firstName, userData.lastName, userData.email, setUser]);

  useEffect(() => {
    if (!userData.uid) {
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
          <Input type="text" placeholder="Имя" value={firstName} onChange={setFirstName} minLength={1} />
          <Input type="text" placeholder="Фамилия" value={lastName} onChange={setLastName} minLength={1} />
          <Input type="email" placeholder="Почта" value={email} onChange={setEmail} />
          <Input type="password" placeholder="Новый пароль" value={password} onChange={setPassword} required={false} minLength={6} />
          <Input type="password" placeholder="Повторите пароль" value={secondPassword} onChange={setSecondPassword} required={false} minLength={6} />
          {(email !== userData?.email || password || secondPassword) && (
            <Input
              type="password"
              placeholder="Текущий пароль"
              value={currentPassword}
              onChange={setCurrentPassword}
              minLength={6}
            />
          )}
          <InputError error={error || info} />
          <div className={styles.profileButtons}>
            {changes && <Button label="Сохранить изменения" type="button" onClick={saveUserData} />}
            <Button label="Выйти из аккаунта" type="button" onClick={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
};
