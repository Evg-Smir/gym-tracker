import { create } from 'zustand';

import { CategoryStoreType, ExercisesOfCategoryType } from '@/@types/categoryTypes';
import { persistCategoriesLocal, persistCategory } from '@/application/persist';
import { mutateCategoryExercise } from '@/domain/categoryReducers';
import { DEFAULT_CATEGORIES } from '@/domain/seed/defaultCategories';

export const useCategoryStore = create<CategoryStoreType>((set, get) => ({
  categories: DEFAULT_CATEGORIES,

  setCategories: (categories) => {
    set({ categories });
  },

  actionExerciseOfCategory: (categoryId, exercise, action, uid) => {
    const result = mutateCategoryExercise(get().categories, categoryId, exercise, action);
    if (!result) return;

    set({ categories: result.categories });

    void persistCategory(uid, result.updatedCategory);
    void persistCategoriesLocal(result.categories);
  },
}));
