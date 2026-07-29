import styles from './Authentication.module.scss';
import { Input } from '@/components/Inputs/Input/Input';
import { Button } from '@/components/Buttons/Button/Button';
import { InputError } from '@/components/Inputs/InputError/InputError';
import { useLoginForm } from '@/hooks/useLoginForm';
import { useT } from '@/hooks/useT';
import Link from 'next/link';

export const Authentication = () => {
  const { email, password, error, setEmail, setPassword, handleLogin } = useLoginForm();
  const t = useT();

  return (
    <div className={styles.authentication}>
      <div className={styles.authentication__inner}>
        <div className={styles.authenticationTop}>
          <h1 className={styles.authenticationTitle}>{t('auth.title')}</h1>
        </div>

        <div className={styles.authenticationBottom}>
          <form onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder={t('common.email')}
              value={email}
              onChange={setEmail}
            />
            <Input
              type="password"
              placeholder={t('common.password')}
              value={password}
              onChange={setPassword}
            />
            <InputError error={error} />
            <Button label={t('auth.login')} type="submit" />
          </form>
          <div className={styles.authenticationLink}>
            <Link href="/register">{t('auth.orRegister')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
