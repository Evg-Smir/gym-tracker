import styles from './MenuPopupInput.module.scss';
import React, { useCallback, useEffect, useState } from "react";
import { withBasePath } from '@/lib/basePath';
import { useT } from '@/hooks/useT';

interface MenuPopupInputProps {
  updateValue: (value: string) => void;
}

export const SearchInput = ({ updateValue }: MenuPopupInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const t = useT();

  useEffect(() => {
    updateValue(inputValue);
  }, [inputValue, updateValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClearInput = useCallback(() => {
    setInputValue('');
  }, []);

  const renderClearButton = useCallback(() => {
    return (
      <button className={styles.clearButton} onClick={handleClearInput}>
        <img src={withBasePath('/ui/close.svg')} alt={t('search.clearAlt')}/>
      </button>
    );
  }, [handleClearInput, t]);

  return (
    <div className={styles.searchInputInputWrapper}>
      <img className={styles.iconSearch} src={withBasePath('/ui/search.svg')} alt={t('search.iconAlt')}/>
      <input
        className={styles.searchInputInputWrapper__input}
        type="text"
        value={inputValue}
        placeholder={t('search.placeholder')}
        onChange={handleInputChange}
      />
      {inputValue && renderClearButton()}
    </div>
  );
};
