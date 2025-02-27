import styles from './input.module.scss';

import { ChangeEvent, HTMLInputTypeAttribute, useState } from 'react';

export const Input = ({ type, placeholder, value, onChange }: {
  type: HTMLInputTypeAttribute,
  placeholder: string,
  value?: string,
  onChange: (value: string) => void,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className={styles.input}>
      <input
        className={styles.input__native}
        type={type}
        placeholder={placeholder}
        value={inputValue || value}
        onChange={inputOnChange}
        required={true}
        minLength={5}
      />
    </div>
  );
};
