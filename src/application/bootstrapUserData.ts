import { CategoryType } from '@/@types/categoryTypes';
import { DayOfExercisesType } from '@/@types/exerciseTypes';
import { UserDataType, UserID } from '@/@types/userStoreTypes';
import { filteredExercises } from '@/domain/filteredExercises';
import { getAllCategories } from '@/repositories/categoryRepository';
import {
  getLegacyLocalStorage,
  getStorage,
  setStorage,
} from '@/repositories/localStoreRepository';
import { getUserData } from '@/repositories/userRepository';
import { getAllWorkouts } from '@/repositories/workoutRepository';

export interface HydratedSessionData {
  userData: UserDataType | null;
  workouts: DayOfExercisesType[];
  categories: CategoryType[];
}

export const hydrateFromCloud = async (uid: UserID): Promise<HydratedSessionData> => {
  const [userData, workouts, categories] = await Promise.all([
    getUserData(uid),
    getAllWorkouts(uid),
    getAllCategories(uid),
  ]);

  return {
    userData: userData ? { ...userData, uid } : null,
    workouts,
    categories,
  };
};

export interface LocalBootstrapResult {
  categories: CategoryType[];
  exercises: DayOfExercisesType[];
  shouldSkip: boolean;
}

export const bootstrapLocalData = async (
  _uid: UserID,
  userData: UserDataType | null | undefined,
): Promise<LocalBootstrapResult> => {
  const isFirebaseSupported = !!(await getStorage('isFirebaseSupported'))?.length;
  if (isFirebaseSupported || (userData?.exercisesIsUpload && userData?.categoriesIsUpload)) {
    return { categories: [], exercises: [], shouldSkip: true };
  }

  const isStorageSupported = !!(await getStorage('isStorageSupported'))?.length;
  let localCategories = isStorageSupported
    ? await getStorage<CategoryType>('categories')
    : getLegacyLocalStorage('categories');
  let localExercises = isStorageSupported
    ? await getStorage<DayOfExercisesType>('exercises')
    : getLegacyLocalStorage('exercises');

  localExercises = filteredExercises(localExercises || []);

  await setStorage('categories', localCategories || []);
  await setStorage('exercises', localExercises || []);
  if (!isStorageSupported) {
    await setStorage('isStorageSupported', [{ isStorageSupported: '1' }]);
  }

  return {
    categories: localCategories || [],
    exercises: localExercises || [],
    shouldSkip: false,
  };
};
