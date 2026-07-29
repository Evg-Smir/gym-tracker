import styles from './AddExerciseButton.module.scss';

import { withBasePath } from '@/lib/basePath';
import { useT } from '@/hooks/useT';

interface AddExerciseButtonType {
  clickButton: () => void
}

export const AddExerciseButton = ({ clickButton }: AddExerciseButtonType) => {
  const t = useT();

  return (
    <button className={styles.popupButton} onClick={clickButton}>
      <span>{t('exercises.create')}</span>
      <img src={withBasePath('/ui/plus.svg')} alt={t('exercises.createAlt')}/>
    </button>
  )
}
