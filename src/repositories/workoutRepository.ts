import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

import { DayOfExercisesType } from '@/@types/exerciseTypes';
import { UserID } from '@/@types/userStoreTypes';
import { formatTimestampToDate } from '@/domain/formatTimestampToDate';
import { db } from '@/lib/firebase/app';

export const addWorkout = async (userId: UserID, workout: DayOfExercisesType) => {
  const workoutRef = doc(db, `users/${userId}/workouts`, String(formatTimestampToDate(workout.time)));
  await setDoc(workoutRef, workout);
};

export const updateWorkout = async (userId: UserID, updatedWorkout: Partial<DayOfExercisesType>) => {
  const workoutRef = doc(
    db,
    `users/${userId}/workouts`,
    String(formatTimestampToDate(updatedWorkout.time as number)),
  );
  await updateDoc(workoutRef, updatedWorkout);
};

export const deleteWorkout = async (userId: UserID, workoutTime: number) => {
  const workoutRef = doc(db, `users/${userId}/workouts`, String(formatTimestampToDate(workoutTime)));
  await deleteDoc(workoutRef);
};

export const getAllWorkouts = async (userId: UserID): Promise<DayOfExercisesType[]> => {
  try {
    const workoutsRef = collection(db, `users/${userId}/workouts`);
    const querySnapshot = await getDocs(workoutsRef);
    return querySnapshot.docs.map((snapshot) => snapshot.data() as DayOfExercisesType);
  } catch {
    return [];
  }
};
