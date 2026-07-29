import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

import { CategoryType } from '@/@types/categoryTypes';
import { UserID } from '@/@types/userStoreTypes';
import { db } from '@/lib/firebase/app';

export const addCategory = async (userId: UserID, category: CategoryType) => {
  const categoryRef = doc(db, `users/${userId}/categories`, category.slug);
  await setDoc(categoryRef, {
    ...category,
    createdAt: new Date(),
  });
};

export const updateCategory = async (userId: UserID, category: CategoryType) => {
  const categoryRef = doc(db, `users/${userId}/categories`, category.slug);
  const docSnap = await getDoc(categoryRef);

  if (!docSnap.exists()) {
    return;
  }

  await updateDoc(categoryRef, {
    ...category,
    updatedAt: new Date(),
  });
};

export const getAllCategories = async (userId: UserID): Promise<CategoryType[]> => {
  try {
    const categoriesRef = collection(db, `users/${userId}/categories`);
    const querySnapshot = await getDocs(categoriesRef);
    return querySnapshot.docs.map((snapshot) => snapshot.data() as CategoryType);
  } catch {
    return [];
  }
};
