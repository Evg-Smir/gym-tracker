import styles from './input.module.scss';

import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

export const Input = ({
  type,
  placeholder,
  value = '',
  onChange,
  required = true,
  minLength,
}: {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  minLength?: number;
}) => {
  const inputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.input}>
      <input
        className={styles.input__native}
        type={type}
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={inputOnChange}
        required={required}
        minLength={minLength}
      />
    </div>
  );
};
