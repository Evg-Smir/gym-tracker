import { useCallback, useEffect, useState } from 'react';

import { CategoryType, ExercisesOfCategoryType, SelectedExerciseType } from '@/@types/categoryTypes';
import { useAuth } from '@/context/AuthContext';
import useAnimatedVisibility from '@/hooks/useAnimatedVisibility';
import { useExercisesStore } from '@/stores/exercisesStore';

export const useCategoryExerciseSelection = (
  category: CategoryType | null,
  unsetCategory: () => void,
  closeAllPopups: () => void,
) => {
  const [selectedExercises, setSelectedExercises] = useState<SelectedExerciseType[]>([]);
  const setCurrentExercise = useExercisesStore((state) => state.setExercise);
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const { user } = useAuth();

  useEffect(() => {
    show();
  }, [show]);

  const selectExercise = useCallback((exerciseId: number, categoryId: number) => {
    setSelectedExercises((prevState) => {
      const index = prevState.findIndex(
        (exercise) => exercise.exerciseId === exerciseId && exercise.categoryId === categoryId,
      );

      if (index > -1) {
        return prevState.filter((_, i) => i !== index);
      }

      return [...prevState, { exerciseId, categoryId }];
    });
  }, []);

  const isSelected = useCallback(
    (exercise: ExercisesOfCategoryType) =>
      selectedExercises.some((selected) => selected.exerciseId === exercise.id),
    [selectedExercises],
  );

  const confirmSelection = useCallback(() => {
    if (!user || selectedExercises.length === 0) return;

    selectedExercises.forEach(({ categoryId, exerciseId }) => {
      setCurrentExercise(categoryId, exerciseId, user.uid);
    });
    closeAllPopups();
  }, [selectedExercises, setCurrentExercise, closeAllPopups, user]);

  const closePopup = useCallback(() => {
    hide();
    setTimeout(unsetCategory, 300);
  }, [hide, unsetCategory]);

  const clearSelection = useCallback(() => {
    setTimeout(() => setSelectedExercises([]), 300);
  }, []);

  return {
    selectedExercises,
    isVisible,
    shouldRender,
    selectExercise,
    isSelected,
    confirmSelection,
    closePopup,
    clearSelection,
  };
};
