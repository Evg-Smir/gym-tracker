import { create } from 'zustand';
import { CategoryStoreType, ExercisesOfCategoryType } from '@/@types/categoryTypes';
import { setStorage } from '@/services/IndexedDB';
import { updateCategory } from '@/db/client';
import { DEFAULT_CATEGORIES } from '@/services/defaultCategories';

const persistCategories = async (uid: string, categories: CategoryStoreType['categories']) => {
  await setStorage(uid, 'categories', categories);
};

export const useCategoryStore = create<CategoryStoreType>((set, get) => ({
  categories: DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    exercises: category.exercises.map((exercise) => ({ ...exercise })),
  })),

  setCategories: (categories) => set({ categories }),

  resetCategories: () => set({
    categories: DEFAULT_CATEGORIES.map((category) => ({
      ...category,
      exercises: category.exercises.map((exercise) => ({ ...exercise })),
    })),
  }),

  actionExerciseOfCategory: (categoryId, exercise, action, uid) => {
    const { categories } = get();
    const category = categories.find((cat) => cat.id === categoryId);

    if (!category) return;

    let updatedCategory = category;

    if (action === 'create') {
      const newExerciseId = category.exercises.length > 0
        ? Math.max(...category.exercises.map((ex) => ex.id)) + 1
        : 1;

      const newExercise: ExercisesOfCategoryType = { ...exercise, id: newExerciseId };
      updatedCategory = {
        ...category,
        exercises: [...category.exercises, newExercise],
      };
    } else if (action === 'update') {
      const isExercise = category.exercises.find((ex) => ex.id === exercise.id);
      if (!isExercise) return;

      updatedCategory = {
        ...category,
        exercises: category.exercises.map((ex) =>
          ex.id === exercise.id ? { ...ex, ...exercise } : ex,
        ),
      };
    } else if (action === 'remove') {
      updatedCategory = {
        ...category,
        exercises: category.exercises.filter((ex) => ex.id !== exercise.id),
      };
    } else {
      return;
    }

    const newCategories = categories.map((cat) =>
      cat.id === categoryId ? updatedCategory : cat,
    );

    set({ categories: newCategories });

    void (async () => {
      try {
        await updateCategory(uid, updatedCategory);
        await persistCategories(uid, newCategories);
      } catch (error) {
        console.error('Failed to persist category change:', error);
      }
    })();
  },
}));
