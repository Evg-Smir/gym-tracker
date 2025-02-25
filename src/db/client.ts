import { getDocs, doc, setDoc, getDoc, collection, updateDoc, deleteDoc } from 'firebase/firestore';

import { DayOfExercisesType, ExerciseType } from '@/@types/exerciseTypes';
import { CategoryType } from '@/@types/categoryTypes';
import { UserDataType, UserID } from '@/@types/userStoreTypes';
import { db } from '@/lib/firebase';
import { formatTimestampToDate } from '@/services/formatTimestampToDate';

export const getUserData = async (userId: UserID) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    console.log('Пользователь не найден!');
    return null;
  }
};

export const updateUserData = async (userId: UserID, updatedData: Partial<UserDataType>) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn(`Пользователь ${userId} не найден`);
      return;
    }

    await updateDoc(userRef, {
      ...updatedData,
      updatedAt: new Date(),
    });

    console.log(`Информация пользователя ${userId} обновлена`);
  } catch (error) {
    console.error('Ошибка обновления данных пользователя: ', error);
  }
};

export const addWorkout = async (userId: UserID, workout: DayOfExercisesType) => {
  try {
    const workoutRef = doc(db, `users/${userId}/workouts`, String(formatTimestampToDate(workout.time)));
    await setDoc(workoutRef, workout);
    console.log(`Тренировка с time=${workout.time} добавлена для пользователя ${userId}`);
  } catch (error) {
    console.error('Ошибка записи тренировки: ', error);
  }
};

export const updateWorkout = async (userId: UserID, updatedWorkout: Partial<DayOfExercisesType>) => {
  try {
    const workoutRef = doc(db, `users/${userId}/workouts`, String(formatTimestampToDate(updatedWorkout.time as number)));
    await updateDoc(workoutRef, updatedWorkout);
    console.log(`Тренировка с time=${formatTimestampToDate(updatedWorkout.time as number)} обновлена для пользователя ${userId}`);
  } catch (error) {
    console.error('Ошибка обновления тренировки: ', error);
  }
};

export const deleteWorkout = async (userId: UserID, workoutTime: number) => {
  try {
    const workoutRef = doc(db, `users/${userId}/workouts`, String(formatTimestampToDate(workoutTime)));
    await deleteDoc(workoutRef);
    console.log(`Тренировка с time=${workoutTime} удалена у пользователя ${userId}`);
  } catch (error) {
    console.error('Ошибка удаления тренировки: ', error);
  }
};

export const addCategory = async (userId: UserID, category: CategoryType) => {
  try {
    const categoryRef = doc(db, `users/${userId}/categories`, category.slug);
    await setDoc(categoryRef, {
      ...category,
      createdAt: new Date(),
    });
    console.log(`Категория ${category.slug} добавлена для пользователя ${userId}`);
  } catch (error) {
    console.error('Ошибка добавления категории: ', error);
  }
};

export const updateCategory = async (userId: UserID, category: CategoryType) => {
  try {
    const categoryRef = doc(db, `users/${userId}/categories`, category.slug);
    const docSnap = await getDoc(categoryRef);

    if (docSnap.exists()) {
      await updateDoc(categoryRef, {
        ...category,
        updatedAt: new Date(),
      });
      console.log(`Категория ${category.slug} обновлена для пользователя ${userId}`);
    } else {
      console.warn(`Категория ${category.slug} не найдена у пользователя ${userId}`);
    }
  } catch (error) {
    console.error('Ошибка обновления категории: ', error);
  }
};

export const getAllCategories = async (userId: UserID): Promise<CategoryType[]> => {
  try {
    const categoriesRef = collection(db, `users/${userId}/categories`);
    const querySnapshot = await getDocs(categoriesRef);

    const categories = querySnapshot.docs.map(doc => (doc.data()));

    console.log(`Загружены категории пользователя ${userId}:`, categories);
    return categories as CategoryType[];
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    return [];
  }
};

export const getAllExercises = async (userId: UserID): Promise<ExerciseType[]> => {
  try {
    const exercisesRef = collection(db, `users/${userId}/workouts`);
    const querySnapshot = await getDocs(exercisesRef);

    const exercises = querySnapshot.docs.map(doc => (doc.data()));

    console.log(`Загружены упражнения пользователя ${userId}:`, exercises);
    return exercises as ExerciseType[];
  } catch (error) {
    console.error('Ошибка при загрузке упражнений:', error);
    return [];
  }
};
