import styles from './Registration.module.scss';
import { Input } from '@/components/Inputs/Input/Input';
import { Button } from '@/components/Buttons/Button/Button';
import { InputError } from '@/components/Inputs/InputError/InputError';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { useT } from '@/hooks/useT';
import Link from 'next/link';

export const Registration = () => {
  const { form, error, setField, handleSubmit } = useRegisterForm();
  const t = useT();

  return (
    <div className={styles.registration}>
      <div className={styles.registration__inner}>
        <div className={styles.registrationTop}>
          <h1 className={styles.registrationTitle}>{t('register.title')}</h1>
        </div>

        <div className={styles.registrationBottom}>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder={t('common.firstName')}
              value={form.firstName}
              onChange={(value) => setField('firstName', value)}
            />
            <Input
              type="text"
              placeholder={t('common.lastName')}
              value={form.lastName}
              onChange={(value) => setField('lastName', value)}
            />
            <Input
              type="email"
              placeholder={t('common.email')}
              value={form.email}
              onChange={(value) => setField('email', value)}
            />
            <Input
              type="password"
              placeholder={t('common.password')}
              value={form.password}
              onChange={(value) => setField('password', value)}
            />
            <Input
              type="password"
              placeholder={t('common.confirmPassword')}
              value={form.passwordSecond}
              onChange={(value) => setField('passwordSecond', value)}
            />
            <InputError error={error} />
            <Button label={t('register.submit')} type="submit" />
          </form>
          <div className={styles.registrationLink}>
            <Link className={styles.registrationLink} href="/auth">
              {t('register.orLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
