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

export const Authentication = () => {
  const setUser = useUserStore((state) => state.setUserData);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await loginUser(email, password);
      if (!userCredential?.user) return;

      const data = await getUserData(userCredential.user.uid);
      if (data) {
        setUser(data);
      }

      router.push('/');
    } catch (err: unknown) {
      const code = typeof err === 'object' && err && 'code' in err
        ? String((err as { code: string }).code)
        : 'unknown_error';
      setError(code);
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
              minLength={6}
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
