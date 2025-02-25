import styles from './Button.module.scss';
import { FormEvent } from 'react';

export const Button = ({ label, onClick }: { label: string, onClick: (e: FormEvent) => void | Promise<void> }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <span>{label}</span>
    </button>
  );
};
