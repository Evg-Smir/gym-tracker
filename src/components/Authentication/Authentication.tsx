import styles from './Authentication.module.scss';
import { Input } from '@/components/Inputs/Input/Input';
import { useState } from 'react';
import { Button } from '@/components/Buttons/Button/Button';
import { loginUser } from '@/lib/firebase';
import { getUserData } from '@/db/client';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const Authentication = () => {
  const setUser = useUserStore((state) => state.setUserData);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const setUserData = async (uid: string) => {
    const data = await getUserData(uid);
    setUser({ ...data, uid });
  };

  const handleLogin = async () => {
    try {
      const userData = await loginUser(email, password);
      await setUserData(userData.user.uid);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.authentication}>
      <div className={styles.authentication__inner}>
        <div className={styles.authenticationTop}>
          <h1 className={styles.authenticationTitle}>Вход</h1>
        </div>

        <div className={styles.authenticationBottom}>
          <Input type={'email'} placeholder={'Почта'} value={'firstName'} onChange={setEmail} />
          <Input type={'password'} placeholder={'Пароль'} value={'lastName'} onChange={setPassword} />
          <Button label={'Войти'} onClick={handleLogin} />
          <div className={styles.authenticationLink}>
            <Link href={'/register'}>Или зарегестрируйтесь</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
