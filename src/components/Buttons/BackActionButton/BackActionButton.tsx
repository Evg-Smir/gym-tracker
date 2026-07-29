import styles from './BackActionButton.module.scss';

interface BackActionButtonType {
  clickButton: () => void;
  dark?: boolean;
}

export const BackActionButton = ({ clickButton, dark }: BackActionButtonType) => {
  return (
    <button
      className={`${styles.backActionButton} ${dark ? styles.dark : ''}`}
      onClick={clickButton}
      aria-label="Назад"
      type="button"
    >
      <img src="/ui/arrow-left.svg" alt="" />
    </button>
  );
};
