import styles from './CategoriesPopup.module.scss';
import { useExercisesStore } from '@/stores/exercisesStore';
import { AddExerciseButton } from '@/components/Buttons/AddExerciseButton/AddExerciseButton';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { CategoryType, ExercisesOfCategoryType, SelectedExerciseType } from '@/@types/categoryTypes';
import useAnimatedVisibility from '@/hooks/useAnimatedVisibility';
import { useAuth } from '@/context/AuthContext';

interface CategoriesPopupProps {
  category: CategoryType | null;
  unsetCategory: () => void;
  closeAllPopups: () => void;
  changeExercise: (value: SelectedExerciseType) => void;
  createExercise: (category: CategoryType | null) => void;
}

export const CategoriesPopup = (
  {
    category,
    changeExercise,
    unsetCategory,
    createExercise,
    closeAllPopups,
  }: CategoriesPopupProps) => {
  const [selectedExercises, setSelectedExercises] = useState<SelectedExerciseType[]>([]);
  const setCurrentExercise = useExercisesStore(state => state.setExercise);
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const { user } = useAuth();

  useEffect(() => {
    show();
  }, [show]);

  const selectExercise = useCallback((exerciseId: number, categoryId: number): void => {
    setSelectedExercises((prevState) => {
      const index = prevState.findIndex(
        (exercise) => exercise.exerciseId === exerciseId && exercise.categoryId === categoryId,
      );

      if (index > -1) {
        return prevState.filter((_, i) => i !== index);
      } else {
        return [...prevState, { exerciseId, categoryId }];
      }
    });
  }, []);

  const checkMark = useCallback((category: CategoryType, exercise: ExercisesOfCategoryType) => {
    return selectedExercises.some(
      (selected) =>
        selected.exerciseId === exercise.id &&
        selected.categoryId === category.id,
    ) ? <img src="/ui/check-mark.svg" alt="icon" /> : null;
  }, [selectedExercises]);

  const setExercise = useCallback(() => {
    const [{ categoryId, exerciseId }] = selectedExercises;
    user && setCurrentExercise(categoryId, exerciseId, user.uid);
    closeAllPopups();
  }, [selectedExercises, setCurrentExercise, closeAllPopups]);

  const closePopup = useCallback(() => {
    hide();
    setTimeout(unsetCategory, 300);
  }, [hide, unsetCategory]);

  const renderSelectButton = useMemo(() => {
    if (selectedExercises.length > 0) {
      return <button className={styles.selectButton} onClick={setExercise}>Выбрать</button>;
    }
    return null;
  }, [selectedExercises.length, setExercise]);

  const renderChangeButton = useMemo(() => {
    if (selectedExercises.length === 1) {
      return (
        <button onClick={() => {
          changeExercise(selectedExercises[0]);
          setTimeout(() => setSelectedExercises([]), 300);
        }} className={styles.changeButton}>
          Изменить
        </button>
      );
    }
    return null;
  }, [selectedExercises, changeExercise]);

  if (!shouldRender || !category) return null;

  return (
    <div className={`${styles.categoriesPopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closePopup} />
      <h2 className={styles.categoryName}>{category.name}</h2>
      <AddExerciseButton clickButton={() => createExercise(category)} />
      <div className={styles.categoryExercises}>
        {category.exercises.map(exercise => (
          <div
            className={`${styles.exercise} ${selectedExercises.some(se => se.exerciseId === exercise.id) ? styles.selected : ''}`}
            key={exercise.id}
            onClick={() => selectExercise(exercise.id, category!.id)}
          >
            <span>{exercise.name}</span>
            {checkMark(category, exercise)}
          </div>
        ))}
      </div>
      <div className={styles.categoriesPopupButtons}>
        {renderSelectButton}
        {renderChangeButton}
      </div>
    </div>
  );
};
