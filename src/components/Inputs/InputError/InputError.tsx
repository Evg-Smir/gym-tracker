import styles from './InputError.module.scss';
import { errorCode } from '@/domain/errorMessages';

export const InputError = ({ error }: { error: string }) => {
  return (
    <div className={`${styles.error} ${error ? styles.active : ''}`}>
      <div className={styles.errorContent}>
        <p>{errorCode(error)}</p>
      </div>
    </div>
  );
};
