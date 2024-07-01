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
import { CategoryType } from "@/types/categoryTypes";

interface MenuPopupProps {
  setMenuVisible: (value: boolean) => void;
}

export const MainPopup = ({ setMenuVisible }: MenuPopupProps) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const [state, setState] = useState({
    inputValue: '' as string,
    exercisesListForCreate: false as boolean,
    selectedCategory: null as CategoryType | null,
  });

  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const filteredCategoriesList = useFilteredCategories(categoriesList, state.inputValue);

  const setInputValue = useCallback((value: string): void => {
    setState((prevState) => ({ ...prevState, inputValue: value }));
  }, []);

  const setExercisesListForCreate = useCallback((value: boolean): void => {
    setState((prevState) => ({ ...prevState, exercisesListForCreate: value }));
  }, []);

  const setSelectedCategory = useCallback((value: CategoryType | null): void => {
    setState((prevState) => ({ ...prevState, selectedCategory: value }));
  }, []);

  useEffect(() => {
    show();
  }, [show]);

  const closeMenuPopup = useCallback(() => {
    hide();
    setTimeout(() => {setMenuVisible(false)}, 300)
  }, [hide, setMenuVisible]);

  const selectCategory = useCallback((categoryId: number): void => {
    const category = categoriesList.find(categoryItem => categoryItem.id === categoryId) || null;
    setSelectedCategory(category);
  }, [categoriesList]);

  const addExercise = useCallback(() => {
    setExercisesListForCreate(true);
  }, []);

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
      <AddExerciseButton clickButton={addExercise}/>
      <ExercisesCategoriesList
        categoriesList={memoizedFilteredCategoriesList}
        selectCategory={memoizedSelectCategory}
      />
      <WrapperPopup
        closeMenuPopup={closeMenuPopup}
        setListForCreate={state.exercisesListForCreate}
        selectedCategoryProp={state.selectedCategory}
        unsetSelectedCategory={unsetSelectedCategory}
      />
    </div>
  );
};
