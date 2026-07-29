import { useCallback, useEffect, useState } from 'react';

import { CategoryType } from '@/@types/categoryTypes';
import useAnimatedVisibility from '@/hooks/useAnimatedVisibility';
import useFilteredCategories from '@/hooks/useFilteredCategories';
import { useCategoryStore } from '@/stores/categoriesStore';

interface MenuPopupState {
  inputValue: string;
  exercisesListForCreate: boolean;
  selectedCategory: CategoryType | null;
}

export const useMainPopupState = (toggleMenuPopupVisible: () => void) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const [state, setState] = useState<MenuPopupState>({
    inputValue: '',
    exercisesListForCreate: false,
    selectedCategory: null,
  });

  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const filteredCategoriesList = useFilteredCategories(categoriesList, state.inputValue);

  const setInputValue = useCallback((value: string) => {
    setState((prevState) => ({ ...prevState, inputValue: value }));
  }, []);

  const setSelectedCategory = useCallback((value: CategoryType | null) => {
    setState((prevState) => ({ ...prevState, selectedCategory: value }));
  }, []);

  const selectCategory = useCallback(
    (categoryId: number) => {
      const category = categoriesList.find((item) => item.id === categoryId) || null;
      setSelectedCategory(category);
    },
    [categoriesList, setSelectedCategory],
  );

  useEffect(() => {
    show();
  }, [show]);

  useEffect(() => {
    if (state.selectedCategory) {
      selectCategory(state.selectedCategory.id);
    }
  }, [categoriesList, selectCategory, state.selectedCategory]);

  const closeMenuPopup = useCallback(() => {
    hide();
    setTimeout(() => {
      toggleMenuPopupVisible();
    }, 300);
  }, [hide, toggleMenuPopupVisible]);

  const toggleStateListForCreate = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      exercisesListForCreate: !prevState.exercisesListForCreate,
    }));
  }, []);

  const unsetSelectedCategory = useCallback(() => {
    setSelectedCategory(null);
  }, [setSelectedCategory]);

  return {
    state,
    isVisible,
    shouldRender,
    filteredCategoriesList,
    setInputValue,
    selectCategory,
    closeMenuPopup,
    toggleStateListForCreate,
    unsetSelectedCategory,
  };
};
