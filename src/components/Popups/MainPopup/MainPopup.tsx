import styles from './MainPopup.module.scss';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useCategoryStore } from '@/stores/category';
import { ExercisesCategoriesList } from "@/components/Exercises/ExercisesCategoriesList/ExercisesCategoriesList";
import { CreateExercisesList } from "@/components/Popups/CreateExercisesList/CreateExercisesList";
import { ActionExercisePopup } from "@/components/Popups/ActionExercisePopup/ActionExercisePopup";
import { AddExerciseButton } from "@/components/Buttons/AddExerciseButton/AddExerciseButton";
import { CategoriesPopup } from "@/components/Popups/CategoriesPopup/CategoriesPopup";
import { MenuPopupInput } from "@/components/Inputs/MenuPopupInput/MenuPopupInput";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";
import { CategoryType, SelectedExerciseType } from '@/types/categoryTypes';
import useAnimatedVisibility from "@/hooks/useAnimatedVisibility";
import useFilteredCategories from "@/hooks/useFilteredCategories";

interface MenuPopupProps {
  setMenuVisible: (value: boolean) => void;
}

export const MainPopup = ({ setMenuVisible }: MenuPopupProps) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [exerciseForAction, setExerciseForAction] = useState<CategoryType | null>(null);
  const [exerciseForChange, setExerciseForChange] = useState<number | null>(null);
  const [exercisesListForCreate, setExercisesListForCreate] = useState<boolean>(false);
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const filteredCategoriesList = useFilteredCategories(categoriesList, inputValue);

  useEffect(() => {
    show();
  }, [show]);

  const closeMenuPopup = useCallback(() => {
    hide();
    setMenuVisible(false);
  }, [hide, setMenuVisible]);

  const unsetCategory = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const selectCategory = useCallback((categoryId: number): void => {
    const category = categoriesList.find(categoryItem => categoryItem.id === categoryId) || null;
    setSelectedCategory(category);
  }, [categoriesList]);

  const addExercise = useCallback(() => {
    setExercisesListForCreate(true);
  }, []);

  const createExercise = useCallback((category: CategoryType | null): void => {
    setExerciseForAction(category);
  }, []);

  const createNewExercise = useCallback((categoryId: number) => {
    const category = categoriesList.find(categoryItem => categoryItem.id === categoryId) || null;
    createExercise(category);
  }, [categoriesList, createExercise]);

  const closePopups = useCallback(() => {
    setSelectedCategory(null);
    setExercisesListForCreate(false);
    setExerciseForChange(null);
    setExerciseForAction(null);
  }, []);

  const changeExercise = useCallback((value: SelectedExerciseType) => {
    const category = categoriesList.find(categoryItem => categoryItem.id === value.categoryId);
    setExerciseForAction(category || null);
    setExerciseForChange(value.exerciseId);
  }, [categoriesList]);

  const closeAllPopups = useCallback(() => {
    closePopups();
    closeMenuPopup();
  }, [closePopups, closeMenuPopup]);

  const memoizedSelectCategory = useCallback(selectCategory, [selectCategory]);
  const memoizedCreateExercise = useCallback(createExercise, [createExercise]);
  const memoizedCreateNewExercise = useCallback(createNewExercise, [createNewExercise]);
  const memoizedChangeExercise = useCallback(changeExercise, [changeExercise]);

  const memoizedFilteredCategoriesList = useMemo(() => filteredCategoriesList, [filteredCategoriesList]);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.menuPopup} ${isVisible ? styles.menuActive : ''}`}>
      <BackButton clickButton={closeMenuPopup}/>
      <MenuPopupInput updateValue={setInputValue}/>
      <AddExerciseButton clickButton={addExercise}/>
      <ExercisesCategoriesList
        categoriesList={memoizedFilteredCategoriesList}
        selectCategory={memoizedSelectCategory}
      />
      {selectedCategory && (
        <CategoriesPopup
          closeAllPopups={closeAllPopups}
          createExercise={memoizedCreateExercise}
          category={selectedCategory}
          unsetCategory={unsetCategory}
          changeExercise={memoizedChangeExercise}
        />
      )}
      {exercisesListForCreate && (
        <CreateExercisesList
          categoriesList={categoriesList}
          unsetValue={() => setExercisesListForCreate(false)}
          selectCategory={memoizedCreateNewExercise}
        />
      )}
      {exerciseForAction && (
        <ActionExercisePopup
          category={exerciseForAction}
          changeExerciseId={exerciseForChange}
          unsetCreateCategory={closePopups}
        />
      )}
    </div>
  );
};
