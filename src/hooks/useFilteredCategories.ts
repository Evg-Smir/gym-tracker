import { useState, useEffect, useCallback } from 'react';
import { CategoryType } from '@/@types/categoryTypes';

const useFilteredCategories = (categories: CategoryType[], filter: string) => {
  const [filteredCategories, setFilteredCategories] = useState<CategoryType[]>([]);

  const filterCategories = useCallback((list: CategoryType[], filter: string): CategoryType[] => {
    const lowercasedFilter = filter.toLowerCase();
    return list
      .map(category => {
        const filteredExercises = category.exercises.filter(exercise =>
          exercise.name.toLowerCase().includes(lowercasedFilter)
        );
        return { ...category, exercises: filteredExercises };
      })
      .filter(category => category !== null) as CategoryType[];
  }, []);

  useEffect(() => {
    setFilteredCategories(filterCategories(categories, filter));
  }, [categories, filter, filterCategories]);

  return filteredCategories;
};

export default useFilteredCategories;
