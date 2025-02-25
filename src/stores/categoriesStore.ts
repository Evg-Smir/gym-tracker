import { create } from 'zustand';
import { CategoryStoreType } from '@/@types/categoryTypes';
import { setStorage } from '@/services/IndexedDB';
import { updateCategory } from '@/db/client';
import { useUserStore } from '@/stores/userStore';
import { useAuth } from '@/context/AuthContext';

export const useCategoryStore = create<CategoryStoreType>((set) => ({
  categories: [
    {
      id: 1,
      name: 'Руки',
      slug: 'arm',
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
      slug: 'back',
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
      slug: 'shoulder',
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
      slug: 'chest',
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
      slug: 'abs',
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
      slug: 'leg',
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
  actionExerciseOfCategory: (categoryId, exercise, action, uid) => set((state) => {
    const category = state.categories.find(cat => cat.id === categoryId);

    if (!category) {
      return state;
    }

    if (action === 'create') {
      const newExerciseId = category.exercises.length > 0
        ? Math.max(...category.exercises.map(ex => ex.id)) + 1
        : 1;

      const newExercise = { ...exercise, id: newExerciseId };

      const updatedCategory = {
        ...category,
        exercises: [...category.exercises, newExercise]
      }

      const newCategories = state.categories.map(cat =>
        cat.id === categoryId ? {
          ...updatedCategory
        } : cat);

      updateCategory(uid, updatedCategory)
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

      const updatedCategory = {
        ...category,
        exercises: updatedExercises
      }

      const newCategories = state.categories.map(cat =>
        cat.id === categoryId ? { ...updatedCategory } : cat,
      );

      updateCategory(uid, updatedCategory)
      setStorage('categories', newCategories);

      return {
        ...state,
        categories: newCategories,
      };
    } else if (action === 'remove') {
      const updatedExercises = category.exercises.filter(ex => ex.id !== exercise.id);

      const updatedCategory = {
        ...category,
        exercises: updatedExercises
      }

      const newCategories = state.categories.map(cat =>
        cat.id === categoryId ? { ...updatedCategory } : cat,
      );

      updateCategory(uid, updatedCategory)
      setStorage('categories', newCategories);

      return {
        ...state,
        categories: newCategories,
      };
    }

    return state;
  }),
}));
