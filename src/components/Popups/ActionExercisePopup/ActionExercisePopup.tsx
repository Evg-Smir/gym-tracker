import styles from './ActionExercisePopup.module.scss';
import { CategoryType } from '@/@types/categoryTypes';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import { useActionExerciseForm } from '@/hooks/useActionExerciseForm';
import useSwipeToClose from '@/hooks/useSwipeToClose';
import { useT } from '@/hooks/useT';
import { translateCategoryName } from '@/i18n/catalog';

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
  const t = useT();
  const swipeHandlers = useSwipeToClose(closePopup);

  if (!shouldRender) return null;

  return (
    <div
      {...swipeHandlers}
      className={`${styles.actionExercisePopup} ${isVisible ? styles.visible : ''}`}
    >
      <BackButton clickButton={closePopup} />
      <div className={styles.actionExercisePopupWrapper}>
        <h1 className={styles.actionExercisePopupName}>{translateCategoryName(category, t)}</h1>
        <div className={styles.actionExercisePopupInput}>
          <input
            type="text"
            placeholder={t('exercises.namePlaceholder')}
            name="name"
            value={state.name}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.actionExercisePopupSelect}>
          <div className={styles.createExerciseName}>
            <span>{t('exercises.doubleWeight')}</span>
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
            <span>{t('exercises.ownWeight')}</span>
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
              {t('exercises.create')}
            </button>
          )}
          {changeExerciseId && (
            <button className={styles.saveButton} onClick={() => handleActionExercise('update')}>
              {t('exercises.update')}
            </button>
          )}
          {changeExerciseId && (
            <button className={styles.removeButton} onClick={() => handleActionExercise('remove')}>
              {t('exercises.delete')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
