import styles from './MenuPopup.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useCategoryStore } from '@/stores/category';
import { ExercisesCategoriesList } from '@/components/Exercises/ExercisesCategoriesList/ExersisesCategoriesList';
import { MenuPopupInput } from "@/components/Popups/MenuPopupInput/MenuPopupInput";
import { CategoryType } from '@/types/categoryTypes';
import { CategoryPopup } from "@/components/Popups/CategoryPopup/CategoryPopup";

interface MenuPopupType {
  isOpen: boolean;
  setMenuVisible: (value: boolean) => void;
}

export const MenuPopup = ({ isOpen, setMenuVisible }: MenuPopupType) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredCategoriesList, setFilteredCategoriesList] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  const closeMenuPopup = useCallback((): void => {
    setMenuVisible(false);
  }, [setMenuVisible]);

  const unsetCategory = () => {
    setSelectedCategory(null);
  }

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

  const selectCategory = (categoryId: number): void => {
    const category = categoriesList.find(categoryItem => categoryItem.id === categoryId) || null
    setSelectedCategory(category)
  }

  return (
    <div className={`${styles.menuPopup} ${isOpen ? styles.menuActive : ''}`} {...handlers}>
      <MenuPopupInput updateValue={setInputValue}/>
      <ExercisesCategoriesList categoriesList={filteredCategoriesList} selectCategory={selectCategory}/>
      {selectedCategory && <CategoryPopup category={selectedCategory} unsetCategory={unsetCategory}/>}
    </div>
  );
};
