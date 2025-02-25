import styles from './SetItem.module.scss';
import { ExerciseRepsType } from "@/@types/exerciseTypes";
import React, { useEffect, useState } from "react";

type UpdatedValue = (value: ExerciseRepsType) => void;

interface SetItemProps extends ExerciseRepsType {
  index: number;
  updateValue: UpdatedValue;
  removeSet: (index: number) => void;
}

export const SetItem = ({ weight, reps, updateValue, index, removeSet }: SetItemProps) => {
  const [valueSets, setValueSets] = useState<ExerciseRepsType>({ weight, reps });

  useEffect(() => {
    setValueSets({ weight, reps });
  }, [weight, reps]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeight = e.target.value;
    setValueSets(prev => ({ ...prev, weight: newWeight }));
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newReps = e.target.value;
    setValueSets(prev => ({ ...prev, reps: newReps }));
  };

  useEffect(() => {
    updateValue(valueSets);
  }, [valueSets]);

  return (
    <div className={styles.inputsWrapper}>
      <span className={styles.label}>{index + 1}</span>
      <div className={styles.inputsRow}>
        <input
          type="number"
          value={valueSets.weight}
          onChange={handleWeightChange}
          placeholder={"Вес"}
          inputMode={"numeric"}
        />
        <input
          type="number"
          value={valueSets.reps}
          onChange={handleRepsChange}
          placeholder={"Повторения"}
          inputMode={"numeric"}
        />
      </div>
      <button onClick={() => removeSet(index)}>
        <img src="/ui/close-red.svg" alt=""/>
      </button>
    </div>
  );
};
