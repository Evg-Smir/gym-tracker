import { useCallback, useEffect, useState } from 'react';

import { CategoryType } from '@/@types/categoryTypes';
import useAnimatedVisibility from '@/hooks/useAnimatedVisibility';
import useFilteredCategories from '@/hooks/useFilteredCategories';
import { useCategoryStore } from '@/stores/categoriesStore';

interface StatisticsPopupState {
  searchInput: string;
  selectedCategory: CategoryType | null;
}

export const useStatisticsPopup = (closeStat: () => void) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const [popupState, setPopupState] = useState<StatisticsPopupState>({
    searchInput: '',
    selectedCategory: null,
  });
  const filteredCategoriesList = useFilteredCategories(categoriesList, popupState.searchInput);

  useEffect(() => {
    show();
  }, [show]);

  const closePopup = useCallback(() => {
    hide();
    setTimeout(closeStat, 300);
  }, [hide, closeStat]);

  const unsetCategory = useCallback(() => {
    setPopupState((prevState) => ({ ...prevState, selectedCategory: null }));
  }, []);

  const setInputValue = useCallback((value: string) => {
    setPopupState((prevState) => ({ ...prevState, searchInput: value }));
  }, []);

  const selectCategory = useCallback(
    (categoryId: number) => {
      const category = categoriesList.find((item) => item.id === categoryId) || null;
      setPopupState((prevState) => ({ ...prevState, selectedCategory: category }));
    },
    [categoriesList],
  );

  return {
    isVisible,
    shouldRender,
    popupState,
    filteredCategoriesList,
    closePopup,
    unsetCategory,
    setInputValue,
    selectCategory,
  };
};
