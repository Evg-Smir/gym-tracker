import styles from './AddExerciseButton.module.scss';

interface AddExerciseButtonType {
  clickButton: () => void
}

export const AddExerciseButton = ({ clickButton }: AddExerciseButtonType) => {
  return (
    <button className={styles.popupButton} onClick={clickButton}>
      <span>Создать упражнение</span>
      <img src="/ui/plus.svg" alt="icon"/>
    </button>
  )
}
