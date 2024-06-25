import styles from './MenuPopup.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useCategoryStore } from '@/stores/category';
import { ExercisesCategoriesList } from '@/components/Exercises/ExercisesCategoriesList/ExersisesCategoriesList';
import { CategoryType } from '@/types/categoryTypes';

interface MenuPopupType {
  isOpen: boolean;
  setMenuVisible: (value: boolean) => void;
}

export const MenuPopup = ({ isOpen, setMenuVisible }: MenuPopupType) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const [inputValue, setInputValue] = useState('');
  const [filteredCategoriesList, setFilteredCategoriesList] = useState<CategoryType[]>([]);

  const closeMenuPopup = useCallback((): void => {
    setMenuVisible(false);
  }, [setMenuVisible]);

  const filterCategories = useCallback((list: CategoryType[]): CategoryType[] => {
    const lowercasedFilter = inputValue.toLowerCase();

    return list
      .map(category => {
        const filteredExercises = category.exercises.filter(exercise =>
          exercise.name.toLowerCase().includes(lowercasedFilter)
        );

        if (filteredExercises.length > 0) {
          return {
            ...category,
            exercises: filteredExercises,
          };
        }

        return null;
      })
      .filter(category => category !== null) as CategoryType[];
  }, [inputValue]);

  useEffect(() => {
    setFilteredCategoriesList(filterCategories(categoriesList));
  }, [inputValue, categoriesList, filterCategories]);

  const handlers = useSwipeable({
    onSwipedDown: closeMenuPopup,
    trackMouse: true,
  });

  const renderClearButton = useCallback(() => {
    return (
      <button onClick={() => setInputValue('')}>
        <img src="/ui/close.svg" alt="clear"/>
      </button>
    );
  }, []);

  return (
    <div className={`${styles.menuPopup} ${isOpen ? styles.menuActive : ''}`} {...handlers}>
      <div className={styles.menuPopupInputWrapper}>
        <img src="/ui/search.svg" alt="search"/>
        <input
          type="text"
          value={inputValue}
          placeholder="Искать"
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputValue && renderClearButton()}
      </div>
      <ExercisesCategoriesList categoriesList={filteredCategoriesList}/>
    </div>
  );
};
