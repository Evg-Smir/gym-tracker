import styles from './ActionExercisePopup.module.scss';
import { CategoryType } from "@/types/categoryTypes";
import { useCategoryStore } from "@/stores/category";
import useAnimatedVisibility from "@/hooks/useAnimatedVisibility";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";
import { useEffect, useState, useCallback } from "react";

interface ActionExercisePopupProps {
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

export const ActionExercisePopup = ({ category, unsetCreateCategory, changeExerciseId }: ActionExercisePopupProps) => {
  const actionExerciseOfCategory = useCategoryStore(state => state.actionExerciseOfCategory);
  const [paramExercise, setParamExercise] = useState<ParamExerciseType>({
    name: '',
    doubleWeight: false,
    ownWeight: false,
  });

  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();

  useEffect(() => {
    if (changeExerciseId) {
      const exercise = category.exercises.find(ex => ex.id === changeExerciseId);
      if (exercise) {
        const { name, doubleWeight, ownWeight } = exercise;
        setParamExercise({ name, doubleWeight, ownWeight });
      }
    }
    show();
  }, [changeExerciseId, category.exercises, show]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setParamExercise(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const closePopup = useCallback(() => {
    hide();
    unsetCreateCategory();
  }, [hide, unsetCreateCategory]);

  const handleActionExercise = useCallback((action: 'create' | 'update' | 'remove') => {
    actionExerciseOfCategory(category.id, {
      ...paramExercise,
      id: action === 'create' ? -1 : Number(changeExerciseId),
    }, action);
    closePopup();
  }, [actionExerciseOfCategory, category.id, changeExerciseId, paramExercise, closePopup]);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.actionExercisePopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closePopup}/>
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
          {changeExerciseId && (
            <button className={styles.removeButton} onClick={() => handleActionExercise('remove')}>
              Удалить упражнение
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
