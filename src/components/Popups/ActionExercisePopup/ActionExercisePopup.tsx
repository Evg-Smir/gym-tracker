import styles from './ActionExercisePopup.module.scss';
import { CategoryType } from "@/types/categoryTypes";
import { useCategoryStore } from "@/stores/categoriesStore";
import useAnimatedVisibility from "@/hooks/useAnimatedVisibility";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";
import { useEffect, useState, useCallback, useMemo } from "react";

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
  const [state, setState] = useState<ParamExerciseType>({
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
        setState({ name, doubleWeight, ownWeight });
      }
    }
    show();
  }, [changeExerciseId, category.exercises, show]);

  const memoizedParamExercise = useMemo(() => state, [state]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const closePopup = useCallback(() => {
    hide();
    setTimeout(unsetCreateCategory, 300)
  }, [hide, unsetCreateCategory]);

  const handleActionExercise = useCallback((action: 'create' | 'update' | 'remove') => {
    actionExerciseOfCategory(category.id, {
      ...memoizedParamExercise,
      id: action === 'create' ? -1 : Number(changeExerciseId),
    }, action);
    closePopup();
  }, [actionExerciseOfCategory, category.id, changeExerciseId, memoizedParamExercise, closePopup]);

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
            value={state.name}
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
              checked={state.doubleWeight}
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
              checked={state.ownWeight}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className={styles.actionExercisePopupButtons}>
          {!changeExerciseId && state.name && (
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
