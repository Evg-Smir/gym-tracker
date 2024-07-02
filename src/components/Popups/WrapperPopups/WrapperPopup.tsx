import { CategoriesPopup } from "@/components/Popups/CategoriesPopup/CategoriesPopup";
import { CreateExercisesList } from "@/components/Popups/CreateExercisesList/CreateExercisesList";
import { ActionExercisePopup } from "@/components/Popups/ActionExercisePopup/ActionExercisePopup";
import { useCallback, useEffect, useState } from "react";
import { CategoryType, SelectedExerciseType } from "@/types/categoryTypes";
import { useCategoryStore } from "@/stores/categoriesStore";

interface WrapperPopupProps {
  closeMenuPopup: () => void;
  unsetSelectedCategory: () => void;
  unsetSetListForCreate: () => void;
  setListForCreate: boolean;
  selectedCategoryProp: CategoryType | null;
}

interface WrapperPopupStateType {
  selectedCategory: CategoryType | null,
  exerciseForAction: CategoryType | null,
  exerciseForChange: number | null,
  exercisesListForCreate: boolean
}

export const WrapperPopup = (
  {
    closeMenuPopup,
    setListForCreate,
    selectedCategoryProp,
    unsetSelectedCategory,
    unsetSetListForCreate
  }: WrapperPopupProps) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const [state, setState] = useState<WrapperPopupStateType>({
    selectedCategory: selectedCategoryProp,
    exerciseForAction: null,
    exerciseForChange: null,
    exercisesListForCreate: setListForCreate
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      exercisesListForCreate: setListForCreate,
      selectedCategory: selectedCategoryProp
    }));
  }, [setListForCreate, selectedCategoryProp]);

  const createExercise = useCallback((category: CategoryType | null): void => {
    setState((prevState) => ({ ...prevState, exerciseForAction: category }));
  }, []);

  const createNewExercise = useCallback((categoryId: number) => {
    const category = categoriesList.find(categoryItem => categoryItem.id === categoryId) || null;
    createExercise(category);
  }, [categoriesList, createExercise]);

  const changeExercise = useCallback((value: SelectedExerciseType) => {
    const category = categoriesList.find(categoryItem => categoryItem.id === value.categoryId) || null;
    setState((prevState) => ({
      ...prevState,
      exerciseForAction: category,
      exerciseForChange: value.exerciseId
    }));
  }, [categoriesList]);

  const closeAllPopups = useCallback(() => {
    closeMenuPopup();
  }, [closeMenuPopup]);

  const closeCategoriesPopup = () => {
    unsetSelectedCategory()
    setState((prevState) => ({ ...prevState, selectedCategory: null }));
  }

  const closeCreateExercisesList = () => {
    unsetSetListForCreate()
    setState((prevState) => ({ ...prevState, exercisesListForCreate: false }));
  }

  const closeActionExercisePopup = () => {
    setState((prevState) => ({ ...prevState, exerciseForAction: null }));
  }


  return (
    <>
      {state.selectedCategory && (
        <CategoriesPopup
          closeAllPopups={closeAllPopups}
          createExercise={createExercise}
          category={state.selectedCategory}
          unsetCategory={closeCategoriesPopup}
          changeExercise={changeExercise}
        />
      )}
      {state.exercisesListForCreate && (
        <CreateExercisesList
          categoriesList={categoriesList}
          unsetValue={closeCreateExercisesList}
          selectCategory={createNewExercise}
        />
      )}
      {state.exerciseForAction && (
        <ActionExercisePopup
          category={state.exerciseForAction}
          changeExerciseId={state.exerciseForChange}
          unsetCreateCategory={closeActionExercisePopup}
        />
      )}
    </>
  );
};
