import styles from './Profile.module.scss';
import { Input } from '@/components/Inputs/Input/Input';
import { Button } from '@/components/Buttons/Button/Button';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import { InputError } from '@/components/Inputs/InputError/InputError';
import { useProfileForm } from '@/hooks/useProfileForm';

export const Profile = ({ closePopup }: { closePopup: () => void }) => {
  const { form, error, changes, userData, setField, saveUserData, handleLogout } = useProfileForm();

  return (
    <div className={styles.profile}>
      <div className={styles.profile__inner}>
        <div className={styles.profileForm}>
          <BackButton clickButton={closePopup} />
          <h1 className={styles.profileTitle}>Личный кабинет</h1>
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
            placeholder="Новый пароль"
            value={form.password}
            onChange={(value) => setField('password', value)}
          />
          <Input
            type="password"
            placeholder="Повторите пароль"
            value={form.secondPassword}
            onChange={(value) => setField('secondPassword', value)}
          />
          {(form.email !== userData?.email || form.password || form.secondPassword) && (
            <Input
              type="password"
              placeholder="Текущий пароль"
              value={form.currentPassword}
              onChange={(value) => setField('currentPassword', value)}
            />
          )}
          <InputError error={error} />
          <div className={styles.profileButtons}>
            {changes && <Button label="Сохранить изменения" type="button" onClick={saveUserData} />}
            <Button label="Выйти из аккаунта" type="button" onClick={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
};
