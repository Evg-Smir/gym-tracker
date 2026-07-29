import styles from './SetItem.module.scss';
import { ExerciseRepsType } from "@/@types/exerciseTypes";
import React, { useEffect, useState } from "react";

type UpdatedValue = (value: ExerciseRepsType) => void;

interface SetItemProps extends ExerciseRepsType {
  index: number;
  updateValue: UpdatedValue;
  removeSet: (index: number) => void;
  doubleWeight?: boolean;
  ownWeight?: boolean;
}

export const SetItem = ({
  weight,
  reps,
  updateValue,
  index,
  removeSet,
  doubleWeight = false,
  ownWeight = false,
}: SetItemProps) => {
  const displayWeight = doubleWeight && weight
    ? String(Number(weight) / 2 || '')
    : weight;

  const [valueSets, setValueSets] = useState<ExerciseRepsType>({
    weight: ownWeight ? '0' : displayWeight,
    reps,
  });

  useEffect(() => {
    setValueSets({
      weight: ownWeight ? '0' : (doubleWeight && weight ? String(Number(weight) / 2 || '') : weight),
      reps,
    });
  }, [weight, reps, doubleWeight, ownWeight]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeight = e.target.value;
    setValueSets(prev => ({ ...prev, weight: newWeight }));
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newReps = e.target.value;
    setValueSets(prev => ({ ...prev, reps: newReps }));
  };

  useEffect(() => {
    if (ownWeight) {
      updateValue({ weight: '0', reps: valueSets.reps });
      return;
    }

    if (doubleWeight) {
      const raw = Number(valueSets.weight);
      const effective = valueSets.weight.trim() === '' || Number.isNaN(raw)
        ? valueSets.weight
        : String(raw * 2);
      updateValue({ weight: effective, reps: valueSets.reps });
      return;
    }

    updateValue(valueSets);
  }, [valueSets, ownWeight, doubleWeight]);

  return (
    <div className={styles.inputsWrapper}>
      <span className={styles.label}>{index + 1}</span>
      <div className={styles.inputsRow}>
        {!ownWeight && (
          <div className={styles.weightField}>
            <input
              type="number"
              value={valueSets.weight}
              onChange={handleWeightChange}
              placeholder={"Вес"}
              inputMode={"numeric"}
            />
            {doubleWeight && <span className={styles.doubleHint}>×2</span>}
          </div>
        )}
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
