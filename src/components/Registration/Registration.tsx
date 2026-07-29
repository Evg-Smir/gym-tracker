import styles from './Registration.module.scss';
import { Input } from '@/components/Inputs/Input/Input';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/Buttons/Button/Button';
import { registerUser } from '@/lib/firebase';
import { getUserData } from '@/db/client';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InputError } from '@/components/Inputs/InputError/InputError';

export const Registration = () => {
  const setUser = useUserStore((state) => state.setUserData);
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordSecond, setPasswordSecond] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (passwordSecond !== password) {
      setError('password-not-match');
      return;
    }

    try {
      const user = await registerUser(email, password, firstName, lastName);
      const data = await getUserData(user.uid);
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
    <div className={styles.registration}>
      <div className={styles.registration__inner}>
        <div className={styles.registrationTop}>
          <h1 className={styles.registrationTitle}>Регистрация</h1>
        </div>

        <div className={styles.registrationBottom}>
          <form onSubmit={handleSubmit}>
            <Input type="text" placeholder="Имя" value={firstName} onChange={setFirstName} minLength={1} />
            <Input type="text" placeholder="Фамилия" value={lastName} onChange={setLastName} minLength={1} />
            <Input type="email" placeholder="Почта" value={email} onChange={setEmail} />
            <Input type="password" placeholder="Пароль" value={password} onChange={setPassword} minLength={6} />
            <Input
              type="password"
              placeholder="Повторите пароль"
              value={passwordSecond}
              onChange={setPasswordSecond}
              minLength={6}
            />
            <InputError error={error} />
            <Button label="Зарегистрироваться" type="submit" />
          </form>
          <div className={styles.registrationLink}>
            <Link className={styles.registrationLink} href="/auth">Или войдите</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
