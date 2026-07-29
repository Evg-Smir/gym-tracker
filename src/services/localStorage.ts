import { CategoryType } from '@/@types/categoryTypes';
import { DayOfExercisesType } from '@/@types/exerciseTypes';

export const getLocalStorage = (
  name: 'exercises' | 'categories',
): CategoryType[] | DayOfExercisesType[] => {
  try {
    const key = name === 'exercises' ? 'listExercises' : 'listCategories';
    const localData = localStorage.getItem(key);
    if (!localData) return [];
    const parsed = JSON.parse(localData);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
