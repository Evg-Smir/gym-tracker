import styles from './CategoriesPopup.module.scss';

import { useExercisesStore } from "@/stores/exercises";

import { AddExerciseButton } from "@/components/Buttons/AddExerciseButton/AddExerciseButton";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";
import { useState, useCallback, useMemo } from "react";

import { CategoryType, ExercisesOfCategoryType, SelectedExerciseType } from "@/types/categoryTypes";

interface CategoryPopupType {
  category: CategoryType | null;
  unsetCategory: () => void;
  changeExercise: (value: SelectedExerciseType) => void;
  createExercise: (category: CategoryType | null) => void;
}

export const CategoriesPopup = ({ category, changeExercise, unsetCategory, createExercise }: CategoryPopupType) => {
  const [selectedExercises, setSelectedExercises] = useState<SelectedExerciseType[]>([]);
  const exercisesOfCurrentDay = useExercisesStore(state => state.exercisesOfCurrentDay);

  const selectExercise = useCallback((exerciseId: number, categoryId: number): void => {
    setSelectedExercises((prevState) => {
      const index = prevState.findIndex(
        (exercise) => exercise.exerciseId === exerciseId && exercise.categoryId === categoryId
      );

      if (index > -1) {
        return prevState.filter((_, i) => i !== index);
      } else {
        return [...prevState, { exerciseId, categoryId }];
      }
    });
  }, []);

  const checkMark = useCallback((category: CategoryType, exercise: ExercisesOfCategoryType) => {
    return (
      selectedExercises.some(
        (selected) =>
          selected.exerciseId === exercise.id &&
          selected.categoryId === category.id
      ) && <img src="/ui/check-mark.svg" alt="icon"/>
    );
  }, [selectedExercises]);

  const renderSelectButton = useMemo(() => (
    <button className={styles.selectButton}>Выбрать</button>
  ), []);

  const renderChangeButton = useMemo(() => (
    <button onClick={() => changeExercise(selectedExercises[0])} className={styles.changeButton}>Изменить</button>
  ), [changeExercise, selectedExercises]);

  return (
    <div className={styles.categoriesPopup}>
      <BackButton clickButton={unsetCategory}/>
      <h2 className={styles.categoryName}>{category?.name}</h2>
      <AddExerciseButton clickButton={() => createExercise(category)}/>
      <div className={styles.categoryExercises}>
        {category?.exercises.map(exercise => (
          <div
            className={styles.exercise}
            key={exercise.id}
            onClick={() => selectExercise(exercise.id, category?.id)}
          >
            <span>{exercise.name}</span>
            {checkMark(category, exercise)}
          </div>
        ))}
      </div>
      <div className={styles.categoriesPopupButtons}>
        {selectedExercises.length > 0 && (
          <>
            {renderSelectButton}
            {selectedExercises.length < 2 && renderChangeButton}
          </>
        )}
      </div>
    </div>
  );
};
