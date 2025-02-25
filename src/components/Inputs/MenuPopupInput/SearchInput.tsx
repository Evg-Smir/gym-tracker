import styles from './MenuPopupInput.module.scss';
import React, { useCallback, useEffect, useState } from "react";

interface MenuPopupInputProps {
  updateValue: (value: string) => void;
}

export const SearchInput = ({ updateValue }: MenuPopupInputProps) => {
  const [inputValue, setInputValue] = useState('');

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
        <img src="/ui/close.svg" alt="Очистить"/>
      </button>
    );
  }, [handleClearInput]);

  return (
    <div className={styles.searchInputInputWrapper}>
      <img className={styles.iconSearch} src="/ui/search.svg" alt="Поиск"/>
      <input
        className={styles.searchInputInputWrapper__input}
        type="text"
        value={inputValue}
        placeholder="Искать"
        onChange={handleInputChange}
      />
      {inputValue && renderClearButton()}
    </div>
  );
};
