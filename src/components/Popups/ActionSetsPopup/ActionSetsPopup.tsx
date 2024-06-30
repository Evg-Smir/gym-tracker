import styles from './ActionSetsPopup.module.scss';
import useAnimatedVisibility from "@/hooks/useAnimatedVisibility";
import React, { useEffect, useState, useMemo } from "react";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";
import { useExercisesStore } from "@/stores/exercisesStore";
import { ExerciseRepsType, ExerciseType } from "@/types/exerciseTypes";
import { SetItem } from "@/components/Sets/SetItem/SetItem";

interface ActionSetsPopupProps {
  setId: number;
  unsetValue: () => void;
}

export const ActionSetsPopup = ({ setId, unsetValue }: ActionSetsPopupProps) => {
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const exercisesOfCurrentDay = useExercisesStore((state) => state.exercisesOfCurrentDay);
  const updateExercise = useExercisesStore((state) => state.updateExercise);
  const [currentSet, setCurrentSet] = useState<ExerciseType | undefined>();

  useEffect(() => {
    const currentSet = exercisesOfCurrentDay.exercises.find(ex => ex.id === setId);
    setCurrentSet(currentSet);
    show();
  }, [setId, show, exercisesOfCurrentDay]);

  const closePopup = () => {
    hide();
    setTimeout(unsetValue, 300)
  };

  const updateValue = (value: ExerciseRepsType, index: number) => {
    if (!currentSet) return;
    setCurrentSet(prevState => ({
      ...prevState!,
      sets: prevState!.sets.map((set, idx) => (idx === index ? value : set))
    }));
  };

  const addSet = () => {
    if (!currentSet) return;
    setCurrentSet(prevState => ({
      ...prevState!,
      sets: [...prevState!.sets, { weight: '', reps: '' }]
    }));
  };

  const removeSet = (index: number) => {
    if (!currentSet) return;
    setCurrentSet(prevState => ({
      ...prevState!,
      sets: prevState!.sets.filter((_, i) => i !== index)
    }));
  };

  const saveChanges = () => {
    if (!currentSet) return;
    const updatedSet = { ...currentSet };
    updateExercise(updatedSet);
    setTimeout(() => {
      closePopup();
    }, 0);
  };

  const memoizedCurrentSet = useMemo(() => currentSet, [currentSet]);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.actionSetsPopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closePopup}/>
      {memoizedCurrentSet && (
        <>
          <div className={styles.name}>{memoizedCurrentSet.exercise_name}</div>
          {memoizedCurrentSet.sets.map((set, index) => (
            <SetItem
              key={index}
              index={index}
              {...set}
              removeSet={() => removeSet(index)}
              updateValue={(value) => updateValue(value, index)}
            />
          ))}
          <button className={styles.addSets} onClick={addSet}>Добавить подход</button>
          <div className={styles.actionSetsPopupButtons}>
            <button className={styles.addButton} onClick={saveChanges}>Готово</button>
          </div>
        </>
      )}
    </div>
  );
};
