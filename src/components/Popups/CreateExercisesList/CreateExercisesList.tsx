import styles from './CreateExercisesList.module.scss'

import { ExercisesCategoriesList } from "@/components/Exercises/ExercisesCategoriesList/ExersisesCategoriesList";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";

import { CategoryType } from "@/types/categoryTypes";

interface CreateExercisesListType {
  categoriesList: CategoryType[]
  unsetValue: () => void,
  selectCategory: (categoryId: number) => void
}

export const CreateExercisesList = ({ categoriesList, unsetValue, selectCategory }: CreateExercisesListType) => {
  return (
    <div className={styles.createExercisesList}>
      <BackButton clickButton={unsetValue}/>
      <h3 className={styles.title}>Новое упражнение</h3>
      <h1 className={styles.subtitle}>Выберите категорию</h1>
      <ExercisesCategoriesList categoriesList={categoriesList} selectCategory={selectCategory} mini/>
    </div>
  )
}
