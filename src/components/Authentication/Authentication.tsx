import styles from './Authentication.module.scss';
import { Input } from '@/components/Inputs/Input/Input';
import { useState } from 'react';
import { Button } from '@/components/Buttons/Button/Button';
import { loginUser } from '@/lib/firebase';
import { getUserData } from '@/db/client';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InputError } from '@/components/Inputs/InputError/InputError';
import { UserDataType } from '@/@types/userStoreTypes';

export const Authentication = () => {
  const setUser = useUserStore((state) => state.setUserData);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const setUserData = async (uid: string) => {
    try {
      const data = await getUserData(uid);
      setUser({ ...data, uid } as UserDataType);
    } catch (err) {
      console.error('Ошибка получения данных пользователя:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userData = await loginUser(email, password);
      if (!userData) return;
      await setUserData(userData.user.uid);
      router.push('/');
    } catch (err: any) {
      setError(err.code || 'Неизвестная ошибка');
    }
  };

  return (
    <div className={styles.authentication}>
      <div className={styles.authentication__inner}>
        <div className={styles.authenticationTop}>
          <h1 className={styles.authenticationTitle}>Вход</h1>
        </div>

        <div className={styles.authenticationBottom}>
          <form onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Почта"
              value={email}
              onChange={setEmail}
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={setPassword}
            />
            <InputError error={error} />
            <Button label="Войти" type="submit" />
          </form>
          <div className={styles.authenticationLink}>
            <Link href="/register">Или зарегистрируйтесь</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

