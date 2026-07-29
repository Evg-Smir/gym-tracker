import { CategoryType } from '@/@types/categoryTypes';
import {
  categorySearchLabels,
  exerciseSearchLabels,
  matchesSearch,
} from '@/i18n/catalog';

export const filterCategories = (list: CategoryType[], filter: string): CategoryType[] => {
  const lowercasedFilter = filter.trim().toLowerCase();

  if (!lowercasedFilter) {
    return list;
  }

  return list
    .map((category) => {
      if (matchesSearch(categorySearchLabels(category), lowercasedFilter)) {
        return category;
      }

      const filteredExercises = category.exercises.filter((exercise) =>
        matchesSearch(exerciseSearchLabels(exercise.name), lowercasedFilter),
      );

      return { ...category, exercises: filteredExercises };
    })
    .filter((category) => category.exercises.length > 0);
};
