import styles from './ExercisesItem.module.scss';
import { ExerciseType } from "@/types/exerciseTypes";
import { ExerciseSetItem } from "@/components/Exercises/ExerciseSetItem/ExerciseSetItem";
import { useState } from "react";

interface ExercisePropType {
  exercise: ExerciseType
}

export const ExercisesItem = ({ exercise: { category_icon, exercise_name, sets } }: ExercisePropType) => {
  const [contentIsVisible, setContentIsVisible] = useState(false)

  const toggleVisible = () => {
    setContentIsVisible(!contentIsVisible)
  }

  return (
    <div className={styles.exercisesItem}>
      <div
        className={styles.exercisesItemTop}
        onClick={toggleVisible}
      >
        {/*<img src={category_icon} alt="Icon"/>*/}
        <p className={styles.exercisesItemName}>{exercise_name}</p>
        <img
          className={`${styles.arrowIcon} ${contentIsVisible ? styles.arrowIconActive : ''}`}
          src="/ui/arrow.svg"
          alt="Arrow"
        />
      </div>
      <div className={styles.exercisesItemBottom}>
        {
          contentIsVisible &&
          <div className={styles.exercisesItemBottomContent}>
            {sets.map((set, index) => (
              <ExerciseSetItem
                key={index}
                index={index}
                {...set}
              />
            ))}
          </div>
        }
      </div>
    </div>
  )
}
