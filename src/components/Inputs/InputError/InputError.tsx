import styles from './InputError.module.scss';
import { errorCode } from '@/services/codeError';

export const InputError = ({ error }: { error: string }) => {
  return (
    <div className={`${styles.error} ${error ? styles.active : ''}`}>
      <div className={styles.errorContent}>
        <p>{errorCode(error)}</p>
      </div>
    </div>
  );
};
