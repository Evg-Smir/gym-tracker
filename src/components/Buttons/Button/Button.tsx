import styles from './Button.module.scss';
import { FormEvent } from 'react';

export const Button = ({ label, onClick, type }: {
  label: string,
  onClick?: (e: FormEvent) => void | Promise<void>,
  type: 'submit' | 'button'
}) => {
  return (
    <button className={styles.button} onClick={onClick} type={type}>
      <span>{label}</span>
    </button>
  );
};
