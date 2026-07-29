import styles from './InputError.module.scss';
import { errorCode } from '@/domain/errorMessages';
import { useLocale } from '@/hooks/useT';

export const InputError = ({ error }: { error: string }) => {
  const locale = useLocale();

  return (
    <div className={`${styles.error} ${error ? styles.active : ''}`}>
      <div className={styles.errorContent}>
        <p>{errorCode(error, locale)}</p>
      </div>
    </div>
  );
};
