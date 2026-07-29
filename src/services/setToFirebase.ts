import { addCategory, addWorkout } from '@/db/client';
import { CategoryType } from '@/@types/categoryTypes';
import { DayOfExercisesType } from '@/@types/exerciseTypes';

export const setToFirebase = async (
  name: 'exercises' | 'categories',
  list: CategoryType[] | DayOfExercisesType[],
  uid: string,
): Promise<void> => {
  if (!uid) {
    throw new Error('User id is required');
  }

  if (!list.length) return;

  await Promise.all(
    list.map((item) =>
      name === 'categories'
        ? addCategory(uid, item as CategoryType)
        : addWorkout(uid, item as DayOfExercisesType),
    ),
  );
};
