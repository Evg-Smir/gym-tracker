'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from '@/lib/firebase';

import { useExercisesStore } from '@/stores/exercisesStore';
import { useCategoryStore } from '@/stores/categoriesStore';
import { useUserStore } from '@/stores/userStore';

import styles from '@/components/App/App.module.scss';

import CircularProgress from '@mui/material/CircularProgress';

import { getAllCategories, getAllWorkouts, getUserData, updateUserData } from '@/db/client';
import { getStorage, setStorage } from '@/services/IndexedDB';
import { filteredExercises } from '@/services/filteredExercises';
import { getLocalStorage } from '@/services/localStorage';
import { setToFirebase } from '@/services/setToFirebase';
import { DEFAULT_CATEGORIES } from '@/services/defaultCategories';
import { CategoryType } from '@/@types/categoryTypes';
import { DayOfExercisesType } from '@/@types/exerciseTypes';
import { UserDataType } from '@/@types/userStoreTypes';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

const resetClientState = () => {
  useExercisesStore.getState().resetExercises();
  useCategoryStore.getState().resetCategories();
  useUserStore.getState().resetUserData();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const syncGeneration = useRef(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      const generation = ++syncGeneration.current;

      setLoading(true);
      setUser(nextUser);

      if (!nextUser?.uid) {
        resetClientState();
        if (generation === syncGeneration.current) {
          setLoading(false);
        }
        return;
      }

      try {
        const profile = await getUserData(nextUser.uid);
        if (generation !== syncGeneration.current) return;

        const userData: UserDataType = profile ?? {
          uid: nextUser.uid,
          firstName: '',
          lastName: '',
          email: nextUser.email ?? '',
          createdAt: '',
          categoriesIsUpload: false,
          exercisesIsUpload: false,
        };

        useUserStore.getState().setUserData(userData);

        const [cloudWorkouts, cloudCategories] = await Promise.all([
          getAllWorkouts(nextUser.uid),
          getAllCategories(nextUser.uid),
        ]);
        if (generation !== syncGeneration.current) return;

        let nextCategories: CategoryType[] = cloudCategories;
        let nextWorkouts: DayOfExercisesType[] = cloudWorkouts;

        // Cloud wins when present. Otherwise migrate local/legacy data once.
        if (!cloudCategories.length && !userData.categoriesIsUpload) {
          const localCategories = await getStorage<CategoryType[]>(nextUser.uid, 'categories');
          const legacyCategories = localCategories.length
            ? localCategories
            : (getLocalStorage('categories') as CategoryType[]);

          nextCategories = legacyCategories.length ? legacyCategories : DEFAULT_CATEGORIES;

          try {
            await setToFirebase('categories', nextCategories, nextUser.uid);
            await updateUserData(nextUser.uid, { categoriesIsUpload: true });
            userData.categoriesIsUpload = true;
            useUserStore.getState().setUserData({ ...userData });
          } catch (error) {
            console.error('Failed to upload categories:', error);
          }
        }

        if (!cloudWorkouts.length && !userData.exercisesIsUpload) {
          const localExercises = await getStorage<DayOfExercisesType[]>(nextUser.uid, 'exercises');
          const legacyExercises = localExercises.length
            ? localExercises
            : (getLocalStorage('exercises') as DayOfExercisesType[]);

          nextWorkouts = filteredExercises(legacyExercises);

          if (nextWorkouts.length) {
            try {
              await setToFirebase('exercises', nextWorkouts, nextUser.uid);
              await updateUserData(nextUser.uid, { exercisesIsUpload: true });
              userData.exercisesIsUpload = true;
              useUserStore.getState().setUserData({ ...userData });
            } catch (error) {
              console.error('Failed to upload exercises:', error);
            }
          } else {
            try {
              await updateUserData(nextUser.uid, { exercisesIsUpload: true });
              userData.exercisesIsUpload = true;
              useUserStore.getState().setUserData({ ...userData });
            } catch (error) {
              console.error('Failed to mark exercises as uploaded:', error);
            }
          }
        }

        if (generation !== syncGeneration.current) return;

        if (nextCategories.length) {
          useCategoryStore.getState().setCategories(nextCategories);
          await setStorage(nextUser.uid, 'categories', nextCategories);
        }

        useExercisesStore.getState().setExercisesList(nextWorkouts);
        await setStorage(nextUser.uid, 'exercises', nextWorkouts);
        useExercisesStore.getState().setExercisesOfCurrentDay(new Date());
      } catch (error) {
        console.error('Auth bootstrap failed:', error);
      } finally {
        if (generation === syncGeneration.current) {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

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
