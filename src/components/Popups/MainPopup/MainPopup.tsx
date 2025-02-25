import styles from './MainPopup.module.scss';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useCategoryStore } from '@/stores/categoriesStore';
import { ExercisesCategoriesList } from "@/components/Exercises/ExercisesCategoriesList/ExercisesCategoriesList";
import { AddExerciseButton } from "@/components/Buttons/AddExerciseButton/AddExerciseButton";
import { SearchInput } from "@/components/Inputs/MenuPopupInput/SearchInput";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";
import { WrapperPopup } from "@/components/Popups/WrapperPopups/WrapperPopup";
import useAnimatedVisibility from "@/hooks/useAnimatedVisibility";
import useFilteredCategories from "@/hooks/useFilteredCategories";
import { CategoryType } from "@/@types/categoryTypes";

interface MenuPopupProps {
  toggleMenuPopupVisible: () => void;
}

interface MenuPopupStateType {
  inputValue: string,
  exercisesListForCreate: boolean,
  selectedCategory: CategoryType | null
}

export const MainPopup = ({ toggleMenuPopupVisible }: MenuPopupProps) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const [state, setState] = useState<MenuPopupStateType>({
    inputValue: '',
    exercisesListForCreate: false,
    selectedCategory: null,
  });

  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const filteredCategoriesList = useFilteredCategories(categoriesList, state.inputValue);

  const setInputValue = useCallback((value: string): void => {
    setState((prevState) => ({ ...prevState, inputValue: value }));
  }, []);

  const setSelectedCategory = useCallback((value: CategoryType | null): void => {
    setState((prevState) => ({ ...prevState, selectedCategory: value }));
  }, []);

  useEffect(() => {
    show();
  }, [show]);

  useEffect(() => {
    if (state.selectedCategory) {
      selectCategory(state.selectedCategory.id)
    }
  }, [categoriesList]);

  const closeMenuPopup = useCallback(() => {
    hide();
    setTimeout(() => {
      toggleMenuPopupVisible()
    }, 300)
  }, [hide, toggleMenuPopupVisible]);

  const selectCategory = useCallback((categoryId: number): void => {
    const category = categoriesList.find(categoryItem => categoryItem.id === categoryId) || null;
    setSelectedCategory(category);
  }, [categoriesList]);

  const toggleStateListForCreate = useCallback(() => {
    setState((prevState) => ({ ...prevState, exercisesListForCreate: !prevState.exercisesListForCreate }));
  }, [])

  const unsetSelectedCategory = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const memoizedFilteredCategoriesList = useMemo(() => filteredCategoriesList, [filteredCategoriesList]);
  const memoizedSelectCategory = useCallback(selectCategory, [selectCategory]);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.menuPopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closeMenuPopup}/>
      <SearchInput updateValue={setInputValue}/>
      <AddExerciseButton clickButton={toggleStateListForCreate}/>
      <ExercisesCategoriesList
        categoriesList={memoizedFilteredCategoriesList}
        selectCategory={memoizedSelectCategory}
      />
      <WrapperPopup
        closeMenuPopup={closeMenuPopup}
        setListForCreate={state.exercisesListForCreate}
        selectedCategoryProp={state.selectedCategory}
        unsetSelectedCategory={unsetSelectedCategory}
        unsetSetListForCreate={toggleStateListForCreate}
      />
    </div>
  );
};
