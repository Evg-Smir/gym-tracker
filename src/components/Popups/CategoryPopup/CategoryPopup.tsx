import styles from './CategoryPopup.module.scss';
import { CategoryType } from "@/types/categoryTypes";
import { useExercisesStore } from "@/stores/exercises";

interface CategoryPopupType {
  category: CategoryType | null,
  unsetCategory: () => void
}

export const CategoryPopup = ({ category, unsetCategory }: CategoryPopupType) => {
  const exercisesOfCurrentDay = useExercisesStore(state => state.exercisesOfCurrentDay)

  const selectExercise = (exerciseId: number, categoryId: number): void => {
    const currentDay = exercisesOfCurrentDay.time

  }

  return (
    <div className={styles.categoryPopup}>
      <h2 className={styles.categoryName}>{category?.name}</h2>
      <div className={styles.categoryExercises}>
        {
          category?.exercises.map(exercise => (
            <div className={styles.exercise} key={exercise.id}
                 onClick={() => selectExercise(exercise.id, category?.id)}>{exercise.name}</div>
          ))
        }
      </div>
      <button className={styles.categoryPopupBack} onClick={unsetCategory}>
        <img src="/ui/arrow-left.svg" alt="arrow"/>
      </button>
    </div>
  )
}
