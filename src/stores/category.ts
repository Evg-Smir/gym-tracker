import { create } from 'zustand';
import { CategoryStoreType } from "@/types/categoryTypes";

export const useCategoryStore = create<CategoryStoreType>((set) => ({
  categories: [
    {
      id: 1,
      name: 'Руки',
      icon: '/categories/Group 1.svg',
      exercises: [
        {
          id: 1,
          name: 'Отжимания на брусьях'
        },
        {
          id: 2,
          name: 'Подъем штанги на бицепс'
        },
      ]
    },
    {
      id: 2,
      name: 'Спина',
      icon: '/categories/Group 2.svg',
      exercises: [
        {
          id: 1,
          name: 'Тяга верхнего блока'
        },
      ]
    },
    {
      id: 3,
      name: 'Плечи',
      icon: '',
      exercises: [
        {
          id: 1,
          name: 'Жим гантелей сидя'
        },
      ]
    },
    {
      id: 4,
      name: 'Грудь',
      icon: '',
      exercises: [
        {
          id: 1,
          name: 'Жим штанги на плоской'
        },
      ]
    },
    {
      id: 5,
      name: 'Пресс',
      icon: '',
      exercises: [
        {
          id: 1,
          name: 'Скручивания'
        },
      ]
    },
    {
      id: 6,
      name: 'Ноги',
      icon: '',
      exercises: [
        {
          id: 1,
          name: 'Выпады со штангой'
        },
      ]
    },
  ],

  setCategories: (categories) => set((state) => ({ categories })),
  addNewCategory: (category) => set((state) => {
    state.categories.push(category);
    return { categories: state.categories };
  }),
  addNewExerciseOfCategory: (categoryId, exercise) => set((state) => ({
    categories: state.categories.map(cat =>
      cat.id === categoryId ? { ...cat, exercises: [...cat.exercises, exercise] } : cat
    )
  })),
}));
