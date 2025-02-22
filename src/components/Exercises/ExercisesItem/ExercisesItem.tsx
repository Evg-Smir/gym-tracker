import styles from './ExercisesItem.module.scss';
import { ExerciseType } from '@/types/exerciseTypes';
import { ExerciseSetItem } from '@/components/Exercises/ExerciseSetItem/ExerciseSetItem';
import { useCallback, useState } from 'react';
import { useExercisesStore } from '@/stores/exercisesStore';
import { SwipeAction } from '@/components/Ui/Swipeable/Swipeable';

interface ExercisesItemProps {
  exercise: ExerciseType;
  setActionSetId: (id: number) => void;
}

export const ExercisesItem = ({ exercise, setActionSetId }: ExercisesItemProps) => {
  const removeExercise = useExercisesStore((state) => state.removeExercise);
  const { category_icon, exercise_name, sets, id } = exercise;
  const [contentIsVisible, setContentIsVisible] = useState(false);

  const toggleContentVisibility = useCallback(() => {
    setContentIsVisible(prevState => !prevState);
  }, []);

  const handleActionSetClick = useCallback(() => {
    setActionSetId(id);
  }, [id, setActionSetId]);

  const renderSets = () => {
    if (!contentIsVisible) return null;

    if (sets.length > 0) {
      return sets.map((set, index) => (
        <ExerciseSetItem
          key={index}
          index={index}
          {...set}
        />
      ));
    } else {
      return <ExerciseSetItem index={0} />;
    }
  };

  return (
    <div className={styles.exercisesItem}>
      <SwipeAction
        actions={[{ label: 'Удалить', onClick: () => removeExercise(exercise) }]}
      >
        <div className={styles.exercisesItemTop} style={{ pointerEvents: 'none' }}>
          <div className={styles.exercisesItemTopContent} onClick={toggleContentVisibility}>
            <img className={styles.icon} src={category_icon} alt="Иконка" />
            <div className={styles.nameWrapper}>
              <p className={styles.exercisesItemName}>{exercise_name}</p>
              <img
                className={`${styles.arrowIcon} ${contentIsVisible ? styles.arrowIconActive : ''}`}
                src="/ui/arrow.svg"
                alt="Стрелка"
              />
            </div>
          </div>
        </div>
      </SwipeAction>
      <div className={styles.exercisesItemBottom} onClick={handleActionSetClick}>
        {renderSets()}
      </div>
    </div>
  );
};
