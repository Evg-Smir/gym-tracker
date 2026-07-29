import { getDocs, doc, setDoc, getDoc, collection, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

import { DayOfExercisesType } from '@/@types/exerciseTypes';
import { CategoryType } from '@/@types/categoryTypes';
import { UserDataType, UserID } from '@/@types/userStoreTypes';
import { db } from '@/lib/firebase';
import { formatTimestampToDate } from '@/services/formatTimestampToDate';

const toIsoString = (value: unknown): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return String(value);
};

export const getUserData = async (userId: UserID): Promise<UserDataType | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  const data = userSnap.data();
  return {
    uid: userId,
    firstName: String(data.firstName ?? ''),
    lastName: String(data.lastName ?? ''),
    email: String(data.email ?? ''),
    createdAt: toIsoString(data.createdAt),
    updatedAt: data.updatedAt ? toIsoString(data.updatedAt) : undefined,
    categoriesIsUpload: Boolean(data.categoriesIsUpload),
    exercisesIsUpload: Boolean(data.exercisesIsUpload),
  };
};

export const updateUserData = async (userId: UserID, updatedData: Partial<UserDataType>) => {
  if (!userId) {
    throw new Error('User id is required');
  }

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error(`User ${userId} not found`);
  }

  const { uid: _uid, createdAt: _createdAt, ...writable } = updatedData;

  await updateDoc(userRef, {
    ...writable,
    updatedAt: new Date(),
  });
};

export const addWorkout = async (userId: UserID, workout: DayOfExercisesType) => {
  if (!userId) {
    throw new Error('User id is required');
  }
  if (workout.time == null || Number.isNaN(workout.time)) {
    throw new Error('Workout time is required');
  }

  const workoutRef = doc(db, `users/${userId}/workouts`, String(formatTimestampToDate(workout.time)));
  await setDoc(workoutRef, workout);
};

export const updateWorkout = async (userId: UserID, updatedWorkout: Partial<DayOfExercisesType> & { time: number }) => {
  if (!userId) {
    throw new Error('User id is required');
  }
  if (updatedWorkout.time == null || Number.isNaN(updatedWorkout.time)) {
    throw new Error('Workout time is required');
  }

  const workoutRef = doc(db, `users/${userId}/workouts`, String(formatTimestampToDate(updatedWorkout.time)));
  await updateDoc(workoutRef, updatedWorkout);
};

export const deleteWorkout = async (userId: UserID, workoutTime: number) => {
  if (!userId) {
    throw new Error('User id is required');
  }
  if (workoutTime == null || Number.isNaN(workoutTime)) {
    throw new Error('Workout time is required');
  }

  const workoutRef = doc(db, `users/${userId}/workouts`, String(formatTimestampToDate(workoutTime)));
  await deleteDoc(workoutRef);
};

export const addCategory = async (userId: UserID, category: CategoryType) => {
  if (!userId) {
    throw new Error('User id is required');
  }

  const categoryRef = doc(db, `users/${userId}/categories`, category.slug);
  await setDoc(categoryRef, {
    ...category,
    createdAt: new Date(),
  });
};

export const updateCategory = async (userId: UserID, category: CategoryType) => {
  if (!userId) {
    throw new Error('User id is required');
  }

  const categoryRef = doc(db, `users/${userId}/categories`, category.slug);
  const docSnap = await getDoc(categoryRef);

  if (docSnap.exists()) {
    await updateDoc(categoryRef, {
      ...category,
      updatedAt: new Date(),
    });
  } else {
    await setDoc(categoryRef, {
      ...category,
      createdAt: new Date(),
    });
  }
};

export const getAllCategories = async (userId: UserID): Promise<CategoryType[]> => {
  if (!userId) return [];

  const categoriesRef = collection(db, `users/${userId}/categories`);
  const querySnapshot = await getDocs(categoriesRef);

  return querySnapshot.docs.map((categoryDoc) => categoryDoc.data() as CategoryType);
};

export const getAllWorkouts = async (userId: UserID): Promise<DayOfExercisesType[]> => {
  if (!userId) return [];

  const workoutsRef = collection(db, `users/${userId}/workouts`);
  const querySnapshot = await getDocs(workoutsRef);

  return querySnapshot.docs.map((workoutDoc) => workoutDoc.data() as DayOfExercisesType);
};
