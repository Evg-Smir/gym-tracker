import { CategoryType } from '@/@types/categoryTypes';
import { DayOfExercisesType } from '@/@types/exerciseTypes';
import { UserDataType } from '@/@types/userStoreTypes';
import { uploadListToFirebase } from '@/application/persist';
import { setStorage } from '@/repositories/localStoreRepository';
import { updateUserData } from '@/repositories/userRepository';

export type UploadField = 'categoriesIsUpload' | 'exercisesIsUpload';

export const migrateLocalToCloud = async (
  key: 'categories' | 'exercises',
  list: CategoryType[] | DayOfExercisesType[],
  userData: UserDataType,
  field: UploadField,
): Promise<UserDataType | null> => {
  if (userData[field] || list.length === 0 || !userData.uid) {
    return null;
  }

  await uploadListToFirebase(key, list, userData.uid);
  await updateUserData(userData.uid, { [field]: true });
  await setStorage('isFirebaseSupported', [{ isFirebaseSupported: '1' }]);

  return { ...userData, [field]: true };
};
