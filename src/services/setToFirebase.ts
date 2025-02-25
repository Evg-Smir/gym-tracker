import { addCategory, addWorkout } from '@/db/client';
import { CategoryType } from '@/@types/categoryTypes';
import { DayOfExercisesType } from '@/@types/exerciseTypes';

export const setToFirebase = async (
  name: 'exercises' | 'categories',
  list: CategoryType[] | DayOfExercisesType[],
  uid: string
) => {
  if (!uid) {
    console.error('Ошибка: отсутствует UID пользователя');
    return;
  }

  if (!list.length) return;

  try {
    await Promise.all(
      list.map((item) =>
        name === 'categories'
          ? addCategory(uid, item as CategoryType)
          : addWorkout(uid, item as DayOfExercisesType)
      )
    );
    console.log(`Все ${name} успешно записаны в Firebase.`);
  } catch (error) {
    console.error(`Ошибка при записи ${name} в Firebase:`, error);
  }
};
