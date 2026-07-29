import styles from './MainPopup.module.scss';
import { ExercisesCategoriesList } from '@/components/Exercises/ExercisesCategoriesList/ExercisesCategoriesList';
import { AddExerciseButton } from '@/components/Buttons/AddExerciseButton/AddExerciseButton';
import { SearchInput } from '@/components/Inputs/MenuPopupInput/SearchInput';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import { WrapperPopup } from '@/components/Popups/WrapperPopups/WrapperPopup';
import { useMainPopupState } from '@/hooks/useMainPopupState';
import useSwipeToClose from '@/hooks/useSwipeToClose';
import { useRef } from 'react';

interface MenuPopupProps {
  toggleMenuPopupVisible: () => void;
}

export const MainPopup = ({ toggleMenuPopupVisible }: MenuPopupProps) => {
  const {
    state,
    isVisible,
    shouldRender,
    filteredCategoriesList,
    setInputValue,
    selectCategory,
    closeMenuPopup,
    toggleStateListForCreate,
    unsetSelectedCategory,
  } = useMainPopupState(toggleMenuPopupVisible);
  const scrollRef = useRef<HTMLDivElement>(null);
  const swipeHandlers = useSwipeToClose(closeMenuPopup, scrollRef);

  if (!shouldRender) return null;

  return (
    <div
      {...swipeHandlers}
      className={`${styles.menuPopup} ${isVisible ? styles.visible : ''}`}
    >
      <BackButton clickButton={closeMenuPopup} />
      <SearchInput updateValue={setInputValue} />
      <AddExerciseButton clickButton={toggleStateListForCreate} />
      <ExercisesCategoriesList
        ref={scrollRef}
        categoriesList={filteredCategoriesList}
        selectCategory={selectCategory}
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
