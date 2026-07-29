import { CategoriesPopup } from '@/components/Popups/CategoriesPopup/CategoriesPopup';
import { CreateExercisesList } from '@/components/Popups/CreateExercisesList/CreateExercisesList';
import { ActionExercisePopup } from '@/components/Popups/ActionExercisePopup/ActionExercisePopup';
import { CategoryType } from '@/@types/categoryTypes';
import { useWrapperPopupState } from '@/hooks/useWrapperPopupState';

interface WrapperPopupProps {
  closeMenuPopup: () => void;
  unsetSelectedCategory: () => void;
  unsetSetListForCreate: () => void;
  setListForCreate: boolean;
  selectedCategoryProp: CategoryType | null;
}

export const WrapperPopup = ({
  closeMenuPopup,
  setListForCreate,
  selectedCategoryProp,
  unsetSelectedCategory,
  unsetSetListForCreate,
}: WrapperPopupProps) => {
  const {
    state,
    categoriesList,
    createExercise,
    createNewExercise,
    changeExercise,
    closeAllPopups,
    closeCategoriesPopup,
    closeCreateExercisesList,
    closeActionExercisePopup,
  } = useWrapperPopupState(
    selectedCategoryProp,
    setListForCreate,
    closeMenuPopup,
    unsetSelectedCategory,
    unsetSetListForCreate,
  );

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
