import styles from './MainPopup.module.scss';

import { useCallback, useEffect, useState } from 'react';

import { useCategoryStore } from '@/stores/category';

import { ExercisesCategoriesList } from '@/components/Exercises/ExercisesCategoriesList/ExersisesCategoriesList';
import { CreateExercisesList } from "@/components/Popups/CreateExercisesList/CreateExercisesList";
import { ActionExercisePopup } from "@/components/Popups/ActionExercisePopup/ActionExercisePopup";
import { AddExerciseButton } from "@/components/Buttons/AddExerciseButton/AddExerciseButton";
import { CategoriesPopup } from "@/components/Popups/CategoriesPopup/CategoriesPopup";
import { MenuPopupInput } from "@/components/Inputs/MenuPopupInput/MenuPopupInput";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";

import { CategoryType, SelectedExerciseType } from '@/types/categoryTypes';

interface MenuPopupProps {
  isOpen: boolean;
  setMenuVisible: (value: boolean) => void;
}

export const MainPopup = ({ isOpen, setMenuVisible }: MenuPopupProps) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredCategoriesList, setFilteredCategoriesList] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [exerciseForAction, setExerciseForAction] = useState<CategoryType | null>(null);
  const [exerciseForChange, setExerciseForChange] = useState<number | null>(null);
  const [exercisesListForCreate, setExercisesListForCreate] = useState<boolean>(false);

  const closeMenuPopup = useCallback((): void => {
    setMenuVisible(false);
  }, [setMenuVisible]);

  const unsetCategory = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const filterCategories = useCallback((list: CategoryType[], filter: string): CategoryType[] => {
    const lowercasedFilter = filter.toLowerCase();
    return list
      .map(category => {
        const filteredExercises = category.exercises.filter(exercise =>
          exercise.name.toLowerCase().includes(lowercasedFilter)
        );
        return filteredExercises.length > 0 ? { ...category, exercises: filteredExercises } : null;
      })
      .filter(category => category !== null) as CategoryType[];
  }, []);

  useEffect(() => {
    setFilteredCategoriesList(filterCategories(categoriesList, inputValue));
  }, [inputValue, categoriesList, filterCategories]);

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
    setExerciseForChange(null);
    setExerciseForAction(null);
    setSelectedCategory(null);
    setExercisesListForCreate(false);
  }, []);

  const changeExercise = useCallback((value: SelectedExerciseType) => {
    const category = categoriesList.find(categoryItem => categoryItem.id === value.categoryId);
    setExerciseForAction(category || null);
    setExerciseForChange(value.exerciseId);
  }, [categoriesList]);

  return (
    <div className={`${styles.menuPopup} ${isOpen ? styles.menuActive : ''}`}>
      <BackButton clickButton={closeMenuPopup}/>
      <MenuPopupInput updateValue={setInputValue}/>
      <AddExerciseButton clickButton={addExercise}/>
      <ExercisesCategoriesList categoriesList={filteredCategoriesList} selectCategory={selectCategory}/>
      {selectedCategory && (
        <CategoriesPopup
          createExercise={createExercise}
          category={selectedCategory}
          unsetCategory={unsetCategory}
          changeExercise={changeExercise}
        />
      )}
      {exercisesListForCreate && (
        <CreateExercisesList
          categoriesList={categoriesList}
          unsetValue={() => setExercisesListForCreate(false)}
          selectCategory={createNewExercise}
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
