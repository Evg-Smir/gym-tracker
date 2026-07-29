import { useState, useEffect } from 'react';
import { CategoryType } from '@/@types/categoryTypes';
import { filterCategories } from '@/domain/filteredCategories';

const useFilteredCategories = (categories: CategoryType[], filter: string) => {
  const [filteredCategories, setFilteredCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    setFilteredCategories(filterCategories(categories, filter));
  }, [categories, filter]);

  return filteredCategories;
};

export default useFilteredCategories;
