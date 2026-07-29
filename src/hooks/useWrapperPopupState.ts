import { useCallback, useEffect, useState } from 'react';

import { CategoryType, SelectedExerciseType } from '@/@types/categoryTypes';
import { useCategoryStore } from '@/stores/categoriesStore';

interface WrapperPopupState {
  selectedCategory: CategoryType | null;
  exerciseForAction: CategoryType | null;
  exerciseForChange: number | null;
  exercisesListForCreate: boolean;
}

export const useWrapperPopupState = (
  selectedCategoryProp: CategoryType | null,
  setListForCreate: boolean,
  closeMenuPopup: () => void,
  unsetSelectedCategory: () => void,
  unsetSetListForCreate: () => void,
) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const [state, setState] = useState<WrapperPopupState>({
    selectedCategory: selectedCategoryProp,
    exerciseForAction: null,
    exerciseForChange: null,
    exercisesListForCreate: setListForCreate,
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      exercisesListForCreate: setListForCreate,
      selectedCategory: selectedCategoryProp,
    }));
  }, [setListForCreate, selectedCategoryProp]);

  const createExercise = useCallback((category: CategoryType | null) => {
    setState((prevState) => ({
      ...prevState,
      exerciseForChange: null,
      exerciseForAction: category,
    }));
  }, []);

  const createNewExercise = useCallback(
    (categoryId: number) => {
      const category = categoriesList.find((item) => item.id === categoryId) || null;
      createExercise(category);
    },
    [categoriesList, createExercise],
  );

  const changeExercise = useCallback(
    (value: SelectedExerciseType) => {
      const category = categoriesList.find((item) => item.id === value.categoryId) || null;
      setState((prevState) => ({
        ...prevState,
        exerciseForAction: category,
        exerciseForChange: value.exerciseId,
      }));
    },
    [categoriesList],
  );

  const closeAllPopups = useCallback(() => {
    closeMenuPopup();
  }, [closeMenuPopup]);

  const closeCategoriesPopup = useCallback(() => {
    unsetSelectedCategory();
    setState((prevState) => ({ ...prevState, selectedCategory: null }));
  }, [unsetSelectedCategory]);

  const closeCreateExercisesList = useCallback(() => {
    unsetSetListForCreate();
    setState((prevState) => ({ ...prevState, exercisesListForCreate: false }));
  }, [unsetSetListForCreate]);

  const closeActionExercisePopup = useCallback(() => {
    setState((prevState) => ({ ...prevState, exerciseForAction: null }));
  }, []);

  return {
    state,
    categoriesList,
    createExercise,
    createNewExercise,
    changeExercise,
    closeAllPopups,
    closeCategoriesPopup,
    closeCreateExercisesList,
    closeActionExercisePopup,
  };
};
