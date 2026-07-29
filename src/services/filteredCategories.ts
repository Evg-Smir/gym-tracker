import { CategoryType } from '@/@types/categoryTypes';

export const filterCategories = (list: CategoryType[], filter: string): CategoryType[] => {
  const lowercasedFilter = filter.trim().toLowerCase();

  if (!lowercasedFilter) {
    return list;
  }

  return list
    .map((category) => {
      const categoryMatches = category.name.toLowerCase().includes(lowercasedFilter);

      if (categoryMatches) {
        return category;
      }

      const filteredExercises = category.exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(lowercasedFilter),
      );

      return { ...category, exercises: filteredExercises };
    })
    .filter((category) => category.exercises.length > 0);
};
