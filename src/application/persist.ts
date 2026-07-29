import { CategoryType } from '@/@types/categoryTypes';
import { DayOfExercisesType } from '@/@types/exerciseTypes';
import { UserID } from '@/@types/userStoreTypes';
import { addCategory, updateCategory } from '@/repositories/categoryRepository';
import { setStorage } from '@/repositories/localStoreRepository';
import { addWorkout, deleteWorkout, updateWorkout } from '@/repositories/workoutRepository';

export const persistExercisesLocal = async (exercises: DayOfExercisesType[]) => {
  await setStorage('exercises', exercises);
};

export const persistCategoriesLocal = async (categories: CategoryType[]) => {
  await setStorage('categories', categories);
};

export const persistWorkoutDay = async (
  uid: UserID,
  day: DayOfExercisesType,
  mode: 'add' | 'update' | 'delete',
) => {
  if (mode === 'add') {
    await addWorkout(uid, day);
    return;
  }

  if (mode === 'update') {
    await updateWorkout(uid, day);
    return;
  }

  await deleteWorkout(uid, day.time);
};

export const persistCategory = async (uid: UserID, category: CategoryType) => {
  await updateCategory(uid, category);
};

export const uploadListToFirebase = async (
  name: 'exercises' | 'categories',
  list: CategoryType[] | DayOfExercisesType[],
  uid: string,
) => {
  if (!uid || !list.length) return;

  await Promise.all(
    list.map((item) =>
      name === 'categories'
        ? addCategory(uid, item as CategoryType)
        : addWorkout(uid, item as DayOfExercisesType),
    ),
  );
};
