import styles from './Profile.module.scss';
import { Input } from '@/components/Inputs/Input/Input';
import { Button } from '@/components/Buttons/Button/Button';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import { InputError } from '@/components/Inputs/InputError/InputError';
import { useProfileForm } from '@/hooks/useProfileForm';
import { useT } from '@/hooks/useT';
import type { Locale } from '@/i18n/types';
import { useLocaleStore } from '@/stores/localeStore';

export const Profile = ({ closePopup }: { closePopup: () => void }) => {
  const { form, error, changes, userData, setField, saveUserData, handleLogout } = useProfileForm();
  const t = useT();
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  const languages: { code: Locale; label: string }[] = [
    { code: 'ru', label: t('profile.languageRu') },
    { code: 'en', label: t('profile.languageEn') },
  ];

  return (
    <div className={styles.profile}>
      <div className={styles.profile__inner}>
        <div className={styles.profileForm}>
          <BackButton clickButton={closePopup} />
          <h1 className={styles.profileTitle}>{t('profile.title')}</h1>
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
            placeholder={t('profile.newPassword')}
            value={form.password}
            onChange={(value) => setField('password', value)}
          />
          <Input
            type="password"
            placeholder={t('common.confirmPassword')}
            value={form.secondPassword}
            onChange={(value) => setField('secondPassword', value)}
          />
          {(form.email !== userData?.email || form.password || form.secondPassword) && (
            <Input
              type="password"
              placeholder={t('profile.currentPassword')}
              value={form.currentPassword}
              onChange={(value) => setField('currentPassword', value)}
            />
          )}
          <InputError error={error} />

          <div className={styles.languageSection}>
            <span className={styles.languageLabel}>{t('profile.language')}</span>
            <div className={styles.languageSwitch} role="group" aria-label={t('profile.language')}>
              {languages.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  className={`${styles.languageButton} ${locale === code ? styles.languageButtonActive : ''}`}
                  onClick={() => setLocale(code)}
                  aria-pressed={locale === code}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.profileButtons}>
            {changes && <Button label={t('profile.save')} type="button" onClick={saveUserData} />}
            <Button label={t('profile.logout')} type="button" onClick={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
};
