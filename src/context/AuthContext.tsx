'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from '@/lib/firebase';

import { useExercisesStore } from '@/stores/exercisesStore';
import { useCategoryStore } from '@/stores/categoriesStore';
import { useUserStore } from '@/stores/userStore';

import styles from '@/components/App/App.module.scss';

import CircularProgress from '@mui/material/CircularProgress';

import { getAllCategories, getAllExercises, getUserData, updateUserData } from '@/db/client';
import { getStorage, setStorage } from '@/services/IndexedDB';
import { filteredExercises } from '@/services/filteredExercises';
import { getLocalStorage } from '@/services/localStorage';
import { setToFirebase } from '@/services/setToFirebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    setExercisesOfCurrentDay,
    setExercisesList,
    exercises,
  } = useExercisesStore((state) => ({
    setExercisesOfCurrentDay: state.setExercisesOfCurrentDay,
    setExercisesList: state.setExercisesList,
    exercises: state.exercises,
  }));

  const {
    setCategories,
    categories,
  } = useCategoryStore((state) => ({
    setCategories: state.setCategories,
    categories: state.categories,
  }));

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { userData, setUserData } = useUserStore((state) => ({
    userData: state.userData,
    setUserData: state.setUserData,
  }));

  const fetchUserData = useCallback(async () => {
    if (!user || userData?.uid === user.uid) return;
    const data = await getUserData(user.uid);
    if (data) setUserData({ ...data, uid: user.uid });
  }, [user, userData?.uid, setUserData]);

  const fetchData = useCallback(async () => {
    if (!user) return;

    await fetchUserData();

    const isFirebaseSupported = !!(await getStorage('isFirebaseSupported'))?.length;
    if (isFirebaseSupported || (userData?.exercisesIsUpload && userData?.categoriesIsUpload)) return;

    const isStorageSupported = !!(await getStorage('isStorageSupported'))?.length;
    let localCategories = isStorageSupported ? await getStorage('categories') : getLocalStorage('categories');
    let localExercises = isStorageSupported ? await getStorage('exercises') : getLocalStorage('exercises');

    localExercises = filteredExercises(localExercises);

    await setStorage('categories', localCategories);
    await setStorage('exercises', localExercises);
    if (!isStorageSupported) await setStorage('isStorageSupported', [{ isStorageSupported: '1' }]);

    if (localCategories?.length) setCategories(localCategories);
    if (localExercises?.length) setExercisesList(localExercises);
  }, [fetchUserData, setCategories, setExercisesList, user, userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!userData?.uid) return;

    const uploadDataIfNeeded = async (key: 'categories' | 'exercises', list: any[], field: 'categoriesIsUpload' | 'exercisesIsUpload') => {
      if (userData[field] || list.length === 0) return;

      await setToFirebase(key, list, userData.uid);
      await updateUserData(userData.uid, { [field]: true });
      setUserData({ ...userData, [field]: true });

      await setStorage('isFirebaseSupported', [{ isFirebaseSupported: '1' }]);
    };

    uploadDataIfNeeded('categories', categories, 'categoriesIsUpload');
    uploadDataIfNeeded('exercises', exercises, 'exercisesIsUpload');
  }, [userData, categories, exercises, setUserData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(true);

      if (user?.uid) {
        const [fetchedExercises, fetchedCategories] = await Promise.all([
          getAllExercises(user.uid),
          getAllCategories(user.uid),
        ]);

        if (fetchedCategories?.length) setCategories(fetchedCategories);
        if (fetchedExercises?.length) setExercisesList(fetchedExercises);
      }

      setExercisesOfCurrentDay(new Date());
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setCategories, setExercisesList, setExercisesOfCurrentDay]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className={styles.loading}><CircularProgress /></div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

