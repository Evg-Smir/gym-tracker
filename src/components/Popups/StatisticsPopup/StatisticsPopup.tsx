import styles from './StatisticsPopup.module.scss';
import { SearchInput } from "@/components/Inputs/MenuPopupInput/SearchInput";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useAnimatedVisibility from "@/hooks/useAnimatedVisibility";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";
import { ExercisesCategoriesList } from "@/components/Exercises/ExercisesCategoriesList/ExercisesCategoriesList";
import { StatisticsExercisesPopup } from "@/components/Popups/StatisticsExercisesPopup/StatisticsExercisesPopup";
import { useCategoryStore } from "@/stores/categoriesStore";
import { CategoryType } from "@/@types/categoryTypes";
import useFilteredCategories from "@/hooks/useFilteredCategories";

interface StatisticsPopupProps {
  closeStat: () => void
}

interface PopupStateType {
  searchInput: string,
  selectedCategory: CategoryType | null
}

export const StatisticsPopup = ({ closeStat }: StatisticsPopupProps) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const [popupState, setPopupState] = useState<PopupStateType>({
    searchInput: '',
    selectedCategory: null,
  });
  const filteredCategoriesList = useFilteredCategories(categoriesList, popupState.searchInput);

  useEffect(() => {
    show();
  }, [show]);

  const closePopup = () => {
    hide();
    setTimeout(closeStat, 300);
  };

  const unsetCategory = (): void => {
    setPopupState(prevState => ({ ...prevState, selectedCategory: null }));
  };

  const setInputValue = useCallback((value: string): void => {
    setPopupState((prevState) => ({ ...prevState, searchInput: value }));
  }, []);

  const selectCategory = (categoryId: number): void => {
    const category = categoriesList.find(categoryItem => categoryItem.id === categoryId) || null;
    setPopupState(prevState => ({ ...prevState, selectedCategory: category }));
  };

  const memoizedFilteredCategoriesList = useMemo(() => filteredCategoriesList, [filteredCategoriesList]);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.statisticsPopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closePopup}/>
      <h2 className={styles.title}>Статистика</h2>
      <SearchInput updateValue={setInputValue}/>
      <ExercisesCategoriesList categoriesList={memoizedFilteredCategoriesList} selectCategory={selectCategory}/>
      {
        popupState.selectedCategory &&
        <StatisticsExercisesPopup
          category={popupState.selectedCategory}
          unsetCategory={unsetCategory}
        />
      }
    </div>
  );
}
