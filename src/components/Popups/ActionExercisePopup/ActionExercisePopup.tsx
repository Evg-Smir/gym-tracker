import styles from './ActionExercisePopup.module.scss';
import { CategoryType } from '@/@types/categoryTypes';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import { useActionExerciseForm } from '@/hooks/useActionExerciseForm';

interface ActionExercisePopupProps {
  category: CategoryType;
  unsetCreateCategory: () => void;
  changeExerciseId: number | null;
}

export const ActionExercisePopup = ({
  category,
  unsetCreateCategory,
  changeExerciseId,
}: ActionExercisePopupProps) => {
  const {
    state,
    isVisible,
    shouldRender,
    handleInputChange,
    closePopup,
    handleActionExercise,
  } = useActionExerciseForm(category, changeExerciseId, unsetCreateCategory);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.actionExercisePopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closePopup} />
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
