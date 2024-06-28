import styles from './ActionExercisePopup.module.scss';
import { CategoryType } from "@/types/categoryTypes";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";
import { useEffect, useState, useCallback } from "react";
import { useCategoryStore } from "@/stores/category";

interface ActionExercisePopupType {
  category: CategoryType;
  unsetCreateCategory: () => void;
  changeExerciseId: number | null;
}

interface ParamExerciseType {
  id?: number;
  name: string;
  doubleWeight: boolean;
  ownWeight: boolean;
}

export const ActionExercisePopup = ({ category, unsetCreateCategory, changeExerciseId }: ActionExercisePopupType) => {
  const actionExerciseOfCategory = useCategoryStore(state => state.actionExerciseOfCategory);
  const [paramExercise, setParamExercise] = useState<ParamExerciseType>({
    name: '',
    doubleWeight: false,
    ownWeight: false,
  });

  useEffect(() => {
    if (changeExerciseId) {
      const exercise = category.exercises.find(ex => ex.id === changeExerciseId);
      if (exercise) {
        const { name, doubleWeight, ownWeight } = exercise;
        setParamExercise({ name, doubleWeight, ownWeight });
      }
    }
  }, [changeExerciseId, category.exercises]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setParamExercise(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleActionExercise = useCallback((action: 'create' | 'update' | 'remove') => {
    actionExerciseOfCategory(category.id, {
      ...paramExercise,
      id: action === 'create' ? -1 : Number(changeExerciseId),
    }, action);
    unsetCreateCategory();
  }, [actionExerciseOfCategory, category.id, changeExerciseId, paramExercise, unsetCreateCategory]);

  return (
    <div className={styles.actionExercisePopup}>
      <BackButton clickButton={unsetCreateCategory}/>
      <div className={styles.actionExercisePopupWrapper}>
        <h1 className={styles.actionExercisePopupName}>{category.name}</h1>
        <div className={styles.actionExercisePopupInput}>
          <input
            type="text"
            placeholder="Название упражнения"
            name="name"
            value={paramExercise.name}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.actionExercisePopupSelect}>
          <div className={styles.createExerciseName}>
            <span>Удвоить вес</span>
            <span className={styles.tooltip}>i</span>
          </div>
          <div className={styles.actionExercisePopupCheckbox}>
            <input
              type="checkbox"
              name="doubleWeight"
              checked={paramExercise.doubleWeight}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className={styles.actionExercisePopupSelect}>
          <div className={styles.createExerciseName}>
            <span>Собственный вес</span>
            <span className={styles.tooltip}>i</span>
          </div>
          <div className={styles.actionExercisePopupCheckbox}>
            <input
              type="checkbox"
              name="ownWeight"
              checked={paramExercise.ownWeight}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {changeExerciseId && (
          <button className={styles.removeButton} onClick={() => handleActionExercise('remove')}>
            Удалить упражнение
          </button>
        )}
        <div className={styles.actionExercisePopupButtons}>
          {!changeExerciseId && paramExercise.name && (
            <button className={styles.saveButton} onClick={() => handleActionExercise('create')}>
              Создать упражнение
            </button>
          )}
          {changeExerciseId && (
            <button className={styles.saveButton} onClick={() => handleActionExercise('update')}>
              Изменить упражнение
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
