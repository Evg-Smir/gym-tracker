import styles from './CreateExercisesList.module.scss'

import { ExercisesCategoriesList } from "@/components/Exercises/ExercisesCategoriesList/ExercisesCategoriesList";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";

import { CategoryType } from "@/types/categoryTypes";
import useAnimatedVisibility from "@/hooks/useAnimatedVisibility";
import { useEffect } from "react";

interface CreateExercisesListType {
  categoriesList: CategoryType[]
  unsetValue: () => void,
  selectCategory: (categoryId: number) => void
}

export const CreateExercisesList = ({ categoriesList, unsetValue, selectCategory }: CreateExercisesListType) => {
  const { isVisible, show, hide } = useAnimatedVisibility();

  useEffect(() => {
    show();
  }, [show]);

  const closePopup = () => {
    hide();
    unsetValue();
  };

  return (
    <div className={`${styles.createExercisesList} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closePopup} />
      <h3 className={styles.title}>Новое упражнение</h3>
      <h1 className={styles.subtitle}>Выберите категорию</h1>
      <ExercisesCategoriesList categoriesList={categoriesList} selectCategory={selectCategory} mini />
    </div>
  );
};
