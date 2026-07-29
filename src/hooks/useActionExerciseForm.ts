import { useCallback, useEffect, useState } from 'react';

import { CategoryType } from '@/@types/categoryTypes';
import { useAuth } from '@/context/AuthContext';
import useAnimatedVisibility from '@/hooks/useAnimatedVisibility';
import { useCategoryStore } from '@/stores/categoriesStore';

interface ParamExerciseType {
  id?: number;
  name: string;
  doubleWeight: boolean;
  ownWeight: boolean;
}

export const useActionExerciseForm = (
  category: CategoryType,
  changeExerciseId: number | null,
  unsetCreateCategory: () => void,
) => {
  const actionExerciseOfCategory = useCategoryStore((state) => state.actionExerciseOfCategory);
  const [state, setState] = useState<ParamExerciseType>({
    name: '',
    doubleWeight: false,
    ownWeight: false,
  });
  const { user } = useAuth();
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();

  useEffect(() => {
    if (changeExerciseId) {
      const exercise = category.exercises.find((ex) => ex.id === changeExerciseId);
      if (exercise) {
        const { name, doubleWeight, ownWeight } = exercise;
        setState({ name, doubleWeight, ownWeight });
      }
    }
    show();
  }, [changeExerciseId, category.exercises, show]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const closePopup = useCallback(() => {
    hide();
    setTimeout(unsetCreateCategory, 300);
  }, [hide, unsetCreateCategory]);

  const handleActionExercise = useCallback(
    (action: 'create' | 'update' | 'remove') => {
      if (!user) return;

      actionExerciseOfCategory(
        category.id,
        {
          ...state,
          id: action === 'create' ? -1 : Number(changeExerciseId),
        },
        action,
        user.uid,
      );
      closePopup();
    },
    [actionExerciseOfCategory, category.id, changeExerciseId, state, closePopup, user],
  );

  return {
    state,
    isVisible,
    shouldRender,
    handleInputChange,
    closePopup,
    handleActionExercise,
  };
};
