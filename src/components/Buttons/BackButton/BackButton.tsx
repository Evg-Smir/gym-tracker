import styles from './BackButton.module.scss';

interface BackButtonType {
  clickButton: () => void,
}

export const BackButton = ({ clickButton }: BackButtonType) => {
  return (
    <button className={styles.backButton} onClick={clickButton}>
      <img src="/ui/arrow-light.svg" alt="arrow"/>
      <span>назад</span>
    </button>
  )
}
