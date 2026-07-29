import { useState, useEffect, useCallback } from 'react';
import { CategoryType } from '@/@types/categoryTypes';
import { filterCategories } from '@/services/filteredCategories';

const useFilteredCategories = (categories: CategoryType[], filter: string) => {
  const [filteredCategories, setFilteredCategories] = useState<CategoryType[]>([]);

  const applyFilter = useCallback((list: CategoryType[], filterValue: string): CategoryType[] => {
    return filterCategories(list, filterValue);
  }, []);

  useEffect(() => {
    setFilteredCategories(applyFilter(categories, filter));
  }, [categories, filter, applyFilter]);

  return filteredCategories;
};

export default useFilteredCategories;
