import styles from './ExerciseSetItem.module.scss';

interface ExerciseSetItemType {
  index: number,
  weight: number,
  reps: number,
}

export const ExerciseSetItem = ({ index, weight, reps }: ExerciseSetItemType) => {

  return (
    <div className={styles.exercisesSet}>
      <p className={styles.exercisesSetLabel}>{index}</p>
      <div className={styles.exercisesSetFields}>
        <div>{weight || ''}</div>
        <div>{reps || ''}</div>
      </div>
    </div>
  )
}
