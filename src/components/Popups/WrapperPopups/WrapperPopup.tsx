import { CategoriesPopup } from "@/components/Popups/CategoriesPopup/CategoriesPopup";
import { CreateExercisesList } from "@/components/Popups/CreateExercisesList/CreateExercisesList";
import { ActionExercisePopup } from "@/components/Popups/ActionExercisePopup/ActionExercisePopup";
import { useCallback, useEffect, useState } from "react";
import { CategoryType, SelectedExerciseType } from "@/types/categoryTypes";
import { useCategoryStore } from "@/stores/categoriesStore";

interface WrapperPopupProps {
  closeMenuPopup: () => void;
  setListForCreate: boolean;
  selectedCategoryProp: CategoryType | null;
}

export const WrapperPopup = ({ closeMenuPopup, setListForCreate, selectedCategoryProp }: WrapperPopupProps) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const [state, setState] = useState({
    selectedCategory: selectedCategoryProp,
    exerciseForAction: null as CategoryType | null,
    exerciseForChange: null as number | null,
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

  const unsetCategory = useCallback(() => {
    setState((prevState) => ({ ...prevState, selectedCategory: null }));
  }, []);

  const closePopups = useCallback(() => {
    setState({
      selectedCategory: null,
      exerciseForAction: null,
      exerciseForChange: null,
      exercisesListForCreate: false
    });
  }, []);

  const closeAllPopups = useCallback(() => {
    closePopups();
    closeMenuPopup();
  }, [closePopups, closeMenuPopup]);

  return (
    <>
      {state.selectedCategory && (
        <CategoriesPopup
          closeAllPopups={closeAllPopups}
          createExercise={createExercise}
          category={state.selectedCategory}
          unsetCategory={unsetCategory}
          changeExercise={changeExercise}
        />
      )}
      {state.exercisesListForCreate && (
        <CreateExercisesList
          categoriesList={categoriesList}
          unsetValue={() => setState((prevState) => ({ ...prevState, exercisesListForCreate: false }))}
          selectCategory={createNewExercise}
        />
      )}
      {state.exerciseForAction && (
        <ActionExercisePopup
          category={state.exerciseForAction}
          changeExerciseId={state.exerciseForChange}
          unsetCreateCategory={closePopups}
        />
      )}
    </>
  );
};
