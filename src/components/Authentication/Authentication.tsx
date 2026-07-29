import styles from './Authentication.module.scss';
import { Input } from '@/components/Inputs/Input/Input';
import { Button } from '@/components/Buttons/Button/Button';
import { InputError } from '@/components/Inputs/InputError/InputError';
import { useLoginForm } from '@/hooks/useLoginForm';
import Link from 'next/link';

export const Authentication = () => {
  const { email, password, error, setEmail, setPassword, handleLogin } = useLoginForm();

  return (
    <div className={styles.authentication}>
      <div className={styles.authentication__inner}>
        <div className={styles.authenticationTop}>
          <h1 className={styles.authenticationTitle}>Вход</h1>
        </div>

        <div className={styles.authenticationBottom}>
          <form onSubmit={handleLogin}>
            <Input type="email" placeholder="Почта" value={email} onChange={setEmail} />
            <Input type="password" placeholder="Пароль" value={password} onChange={setPassword} />
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
