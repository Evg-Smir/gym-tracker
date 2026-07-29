import { CategoryType, ExercisesOfCategoryType } from '@/@types/categoryTypes';

export type CategoryExerciseAction = 'create' | 'update' | 'remove';

export interface CategoryMutationResult {
  categories: CategoryType[];
  updatedCategory: CategoryType;
}

export const mutateCategoryExercise = (
  categories: CategoryType[],
  categoryId: number,
  exercise: ExercisesOfCategoryType,
  action: CategoryExerciseAction,
): CategoryMutationResult | null => {
  const category = categories.find((cat) => cat.id === categoryId);
  if (!category) return null;

  if (action === 'create') {
    const newExerciseId = category.exercises.length > 0
      ? Math.max(...category.exercises.map((ex) => ex.id)) + 1
      : 1;

    const updatedCategory: CategoryType = {
      ...category,
      exercises: [...category.exercises, { ...exercise, id: newExerciseId }],
    };

    return {
      updatedCategory,
      categories: categories.map((cat) => (cat.id === categoryId ? updatedCategory : cat)),
    };
  }

  if (action === 'update') {
    const exists = category.exercises.some((ex) => ex.id === exercise.id);
    if (!exists) return null;

    const updatedCategory: CategoryType = {
      ...category,
      exercises: category.exercises.map((ex) => (ex.id === exercise.id ? { ...ex, ...exercise } : ex)),
    };

    return {
      updatedCategory,
      categories: categories.map((cat) => (cat.id === categoryId ? updatedCategory : cat)),
    };
  }

  const updatedCategory: CategoryType = {
    ...category,
    exercises: category.exercises.filter((ex) => ex.id !== exercise.id),
  };

  return {
    updatedCategory,
    categories: categories.map((cat) => (cat.id === categoryId ? updatedCategory : cat)),
  };
};
