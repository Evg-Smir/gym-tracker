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

  const setUserData = async (uid: string) => {
    const data = await getUserData(uid);
    setUser({ ...data, uid });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (passwordSecond !== error) {
      setError('password-not-match');
      return;
    }

    try {
      const userData = await registerUser(email, password, firstName, lastName);
      // @ts-ignore
      await setUserData(userData.user.uid).then(() => {
        router.push('/');
      }).catch((err: any) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
      setError('Ошибка при регистрации. Попробуйте снова.');
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
            <Input type={'text'} placeholder={'Имя'} value={firstName} onChange={setFirstName} />
            <Input type={'text'} placeholder={'Фамилия'} value={lastName} onChange={setLastName} />
            <Input type={'email'} placeholder={'Почта'} value={email} onChange={setEmail} />
            <Input type={'password'} placeholder={'Пароль'} value={password} onChange={setPassword} />
            <Input type={'password'} placeholder={'Повторите пароль'} value={passwordSecond}
                   onChange={setPasswordSecond} />
            <InputError error={error} />
            <Button label={'Зарегестрироваться'} type={'submit'} />
          </form>
          <div className={styles.registrationLink}>
            <Link className={styles.registrationLink} href={'/auth'}>Или войдите</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
