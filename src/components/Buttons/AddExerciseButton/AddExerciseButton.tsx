import styles from './AddExerciseButton.module.scss';

import { withBasePath } from '@/lib/basePath';

interface AddExerciseButtonType {
  clickButton: () => void
}

export const AddExerciseButton = ({ clickButton }: AddExerciseButtonType) => {
  return (
    <button className={styles.popupButton} onClick={clickButton}>
      <span>Создать упражнение</span>
      <img src={withBasePath('/ui/plus.svg')} alt="icon"/>
    </button>
  )
}
