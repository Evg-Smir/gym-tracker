import styles from './Registration.module.scss';
import { Input } from '@/components/Inputs/Input/Input';
import { Button } from '@/components/Buttons/Button/Button';
import { InputError } from '@/components/Inputs/InputError/InputError';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import Link from 'next/link';

export const Registration = () => {
  const { form, error, setField, handleSubmit } = useRegisterForm();

  return (
    <div className={styles.registration}>
      <div className={styles.registration__inner}>
        <div className={styles.registrationTop}>
          <h1 className={styles.registrationTitle}>Регистрация</h1>
        </div>

        <div className={styles.registrationBottom}>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Имя"
              value={form.firstName}
              onChange={(value) => setField('firstName', value)}
            />
            <Input
              type="text"
              placeholder="Фамилия"
              value={form.lastName}
              onChange={(value) => setField('lastName', value)}
            />
            <Input
              type="email"
              placeholder="Почта"
              value={form.email}
              onChange={(value) => setField('email', value)}
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={form.password}
              onChange={(value) => setField('password', value)}
            />
            <Input
              type="password"
              placeholder="Повторите пароль"
              value={form.passwordSecond}
              onChange={(value) => setField('passwordSecond', value)}
            />
            <InputError error={error} />
            <Button label="Зарегистрироваться" type="submit" />
          </form>
          <div className={styles.registrationLink}>
            <Link className={styles.registrationLink} href="/auth">
              Или войдите
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
