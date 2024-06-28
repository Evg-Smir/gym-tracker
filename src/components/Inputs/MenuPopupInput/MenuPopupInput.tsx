import styles from './MenuPopupInput.module.scss';
import { useCallback, useEffect, useState } from "react";

interface MenuPopupInputType {
  updateValue: (value: string) => void;
}

export const MenuPopupInput = ({ updateValue }: MenuPopupInputType) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    updateValue(inputValue);
  }, [inputValue, updateValue]);

  const renderClearButton = useCallback(() => {
    return (
      <button onClick={() => setInputValue('')}>
        <img src="/ui/close.svg" alt="clear"/>
      </button>
    );
  }, []);

  return (
    <div className={styles.menuPopupInputWrapper}>
      <img className={styles.iconSearch} src="/ui/search.svg" alt="search"/>
      <input
        type="text"
        value={inputValue}
        placeholder="Искать"
        onChange={(e) => setInputValue(e.target.value)}
      />
      {inputValue && renderClearButton()}
    </div>
  );
};
