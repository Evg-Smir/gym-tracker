import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { UserDataType, UserID } from '@/@types/userStoreTypes';
import { db } from '@/lib/firebase/app';

export const getUserData = async (userId: UserID): Promise<UserDataType | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return userSnap.data() as UserDataType;
};

export const updateUserData = async (userId: UserID, updatedData: Partial<UserDataType>) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return;
  }

  await updateDoc(userRef, {
    ...updatedData,
    updatedAt: new Date(),
  });
};
