import styles from './ExerciseSetItem.module.scss';

interface ExerciseSetItemType {
  index: number;
  weight?: number | string;
  reps?: number | string;
}

export const ExerciseSetItem = ({ index, weight, reps }: ExerciseSetItemType) => {
  return (
    <div className={styles.exercisesSet}>
      <span className={styles.exercisesSetLabel}>{index + 1}</span>
      {weight || reps ? (
        <div className={styles.exercisesSetFields}>
          <div>{weight || '-'}</div>
          <div>{reps || '-'}</div>
        </div>
      ) : (
        <div className={styles.emptyField}>0</div>
      )}
    </div>
  );
};
