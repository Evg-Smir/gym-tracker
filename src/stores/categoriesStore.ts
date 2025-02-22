import { create } from 'zustand';
import { CategoryStoreType } from '@/types/categoryTypes';
import { setStorage } from '@/helpers/IndexedDB';

export const useCategoryStore = create<CategoryStoreType>((set) => ({
  categories: [
    {
      id: 1,
      name: 'Руки',
      icon: '/categories/bicep.svg',
      exercises: [
        {
          id: 1,
          name: 'Отжимания на брусьях',
          doubleWeight: false,
          ownWeight: false,
        },
        {
          id: 2,
          name: 'Подъем штанги на бицепс',
          doubleWeight: false,
          ownWeight: false,
        },
      ],
    },
    {
      id: 2,
      name: 'Спина',
      icon: '/categories/back.svg',
      exercises: [
        {
          id: 1,
          name: 'Тяга верхнего блока',
          doubleWeight: false,
          ownWeight: false,
        },
      ],
    },
    {
      id: 3,
      name: 'Плечи',
      icon: '/categories/shoulders.svg',
      exercises: [
        {
          id: 1,
          name: 'Жим гантелей сидя',
          doubleWeight: false,
          ownWeight: false,
        },
      ],
    },
    {
      id: 4,
      name: 'Грудь',
      icon: '/categories/chest.svg',
      exercises: [
        {
          id: 1,
          name: 'Жим штанги на плоской',
          doubleWeight: false,
          ownWeight: false,
        },
      ],
    },
    {
      id: 5,
      name: 'Пресс',
      icon: '/categories/abs.svg',
      exercises: [
        {
          id: 1,
          name: 'Скручивания',
          doubleWeight: false,
          ownWeight: false,
        },
      ],
    },
    {
      id: 6,
      name: 'Ноги',
      icon: '/categories/leg.svg',
      exercises: [
        {
          id: 1,
          name: 'Выпады со штангой',
          doubleWeight: false,
          ownWeight: false,
        },
      ],
    },
  ],

  setCategories: (categories) => set((state) => ({ categories })),
  actionExerciseOfCategory: (categoryId, exercise, action) => set((state) => {
    const category = state.categories.find(cat => cat.id === categoryId);

    if (!category) {
      return state;
    }

    if (action === 'create') {
      const newExerciseId = category.exercises.length > 0
        ? Math.max(...category.exercises.map(ex => ex.id)) + 1
        : 1;

      const newExercise = { ...exercise, id: newExerciseId };

      const newCategories = state.categories.map(cat =>
        cat.id === categoryId ? {
          ...cat, exercises: [...cat.exercises, newExercise],
        } : cat);

      setStorage('categories', newCategories);

      return {
        ...state,
        categories: newCategories,
      };
    } else if (action === 'update') {
      const isExercise = category.exercises.find(ex => ex.id === exercise.id);

      if (!isExercise) return state;

      const updatedExercises = category.exercises.map(ex =>
        ex.id === exercise.id ? { ...ex, ...exercise } : ex,
      );

      const newCategories = state.categories.map(cat =>
        cat.id === categoryId ? { ...cat, exercises: updatedExercises } : cat,
      );

      setStorage('categories', newCategories);

      return {
        ...state,
        categories: newCategories,
      };
    } else if (action === 'remove') {
      const updatedExercises = category.exercises.filter(ex => ex.id !== exercise.id);

      const newCategories = state.categories.map(cat =>
        cat.id === categoryId ? { ...cat, exercises: updatedExercises } : cat,
      );

      setStorage('categories', newCategories);

      return {
        ...state,
        categories: newCategories,
      };
    }

    return state;
  }),
}));
