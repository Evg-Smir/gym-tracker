import { useCallback, useEffect, useState } from 'react';

import { ExerciseRepsType, ExerciseType } from '@/@types/exerciseTypes';
import { useAuth } from '@/context/AuthContext';
import useAnimatedVisibility from '@/hooks/useAnimatedVisibility';
import { useExercisesStore } from '@/stores/exercisesStore';

export const useActionSetsForm = (setId: number, unsetValue: () => void) => {
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const exercisesOfCurrentDay = useExercisesStore((state) => state.exercisesOfCurrentDay);
  const updateExercise = useExercisesStore((state) => state.updateExercise);
  const { user } = useAuth();
  const [currentSet, setCurrentSet] = useState<ExerciseType | undefined>();

  useEffect(() => {
    const nextSet = exercisesOfCurrentDay.exercises.find((ex) => ex.id === setId);
    setCurrentSet(nextSet);
    show();
  }, [setId, show, exercisesOfCurrentDay]);

  const closePopup = useCallback(() => {
    hide();
    setTimeout(unsetValue, 300);
  }, [hide, unsetValue]);

  const updateValue = useCallback((value: ExerciseRepsType, index: number) => {
    setCurrentSet((prevState) => {
      if (!prevState) return prevState;
      return {
        ...prevState,
        sets: prevState.sets.map((set, idx) => (idx === index ? value : set)),
      };
    });
  }, []);

  const addSet = () => {
    if (!currentSet) return;
    setCurrentSet((prevState) => ({
      ...prevState!,
      sets: [...prevState!.sets, { weight: prevState!.ownWeight ? '0' : '', reps: '' }],
    }));
  };

  const removeSet = (index: number) => {
    if (!currentSet) return;
    setCurrentSet((prevState) => ({
      ...prevState!,
      sets: prevState!.sets.filter((_, i) => i !== index),
    }));
  };

  const saveChanges = () => {
    if (!currentSet || !user) return;

    const updatedSet = currentSet.sets.filter((set) =>
      currentSet.ownWeight
        ? !!set.reps.trim().length
        : !!set.weight.trim().length || !!set.reps.trim().length,
    );
    const normalizedSets = updatedSet.map((set) =>
      currentSet.ownWeight ? { ...set, weight: '0' } : set,
    );
    updateExercise({ ...currentSet, sets: [...normalizedSets] }, user.uid);
    setTimeout(() => {
      closePopup();
    }, 0);
  };

  return {
    isVisible,
    shouldRender,
    currentSet,
    closePopup,
    updateValue,
    addSet,
    removeSet,
    saveChanges,
  };
};
