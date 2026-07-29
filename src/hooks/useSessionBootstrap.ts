import { useEffect, useRef } from 'react';
import { User } from 'firebase/auth';

import { bootstrapLocalData, hydrateFromCloud } from '@/application/bootstrapUserData';
import { migrateLocalToCloud } from '@/application/migrateLocalToCloud';
import { useCategoryStore } from '@/stores/categoriesStore';
import { useExercisesStore } from '@/stores/exercisesStore';
import { useUserStore } from '@/stores/userStore';

export const useSessionBootstrap = (
  user: User | null,
  authResolved: boolean,
  onReady: () => void,
) => {
  const setCategories = useCategoryStore((state) => state.setCategories);
  const categories = useCategoryStore((state) => state.categories);
  const setExercisesList = useExercisesStore((state) => state.setExercisesList);
  const exercises = useExercisesStore((state) => state.exercises);
  const setExercisesOfCurrentDay = useExercisesStore((state) => state.setExercisesOfCurrentDay);
  const setUserData = useUserStore((state) => state.setUserData);
  const userData = useUserStore((state) => state.userData);
  const migrating = useRef(false);

  useEffect(() => {
    if (!authResolved) return;

    let cancelled = false;

    const run = async () => {
      if (!user?.uid) {
        setExercisesOfCurrentDay(new Date());
        onReady();
        return;
      }

      const hydrated = await hydrateFromCloud(user.uid);
      if (cancelled) return;

      if (hydrated.userData) {
        setUserData(hydrated.userData);
      }

      if (hydrated.categories.length) {
        setCategories(hydrated.categories);
      }

      if (hydrated.workouts.length) {
        setExercisesList(hydrated.workouts);
      }

      const local = await bootstrapLocalData(user.uid, hydrated.userData);
      if (cancelled) return;

      if (!local.shouldSkip) {
        if (local.categories.length) setCategories(local.categories);
        if (local.exercises.length) setExercisesList(local.exercises);
      }

      setExercisesOfCurrentDay(new Date());
      onReady();
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [
    authResolved,
    user?.uid,
    onReady,
    setCategories,
    setExercisesList,
    setExercisesOfCurrentDay,
    setUserData,
  ]);

  useEffect(() => {
    if (!authResolved || !user?.uid || !userData?.uid || userData.uid !== user.uid || migrating.current) {
      return;
    }

    const runMigration = async () => {
      migrating.current = true;
      try {
        const categoriesResult = await migrateLocalToCloud(
          'categories',
          categories,
          userData,
          'categoriesIsUpload',
        );
        if (categoriesResult) {
          setUserData(categoriesResult);
        }

        const latestUser = categoriesResult ?? userData;
        const exercisesResult = await migrateLocalToCloud(
          'exercises',
          exercises,
          latestUser,
          'exercisesIsUpload',
        );
        if (exercisesResult) {
          setUserData(exercisesResult);
        }
      } finally {
        migrating.current = false;
      }
    };

    void runMigration();
  }, [authResolved, user?.uid, userData, categories, exercises, setUserData]);
};
