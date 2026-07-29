import styles from './ActionSetsPopup.module.scss';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import { SetItem } from '@/components/Sets/SetItem/SetItem';
import { useActionSetsForm } from '@/hooks/useActionSetsForm';
import useSwipeToClose from '@/hooks/useSwipeToClose';
import { useT } from '@/hooks/useT';
import { translateExerciseName } from '@/i18n/catalog';
import { useCallback } from 'react';

interface ActionSetsPopupProps {
  setId: number;
  unsetValue: () => void;
}

export const ActionSetsPopup = ({ setId, unsetValue }: ActionSetsPopupProps) => {
  const {
    isVisible,
    shouldRender,
    currentSet,
    closePopup,
    updateValue,
    addSet,
    removeSet,
    saveChanges,
  } = useActionSetsForm(setId, unsetValue);
  const t = useT();

  const handleClose = useCallback(() => {
    closePopup();
    saveChanges();
  }, [closePopup, saveChanges]);

  const swipeHandlers = useSwipeToClose(handleClose);

  if (!shouldRender) return null;

  return (
    <div
      {...swipeHandlers}
      className={`${styles.actionSetsPopup} ${isVisible ? styles.visible : ''}`}
    >
      <BackButton clickButton={handleClose} />
      {currentSet && (
        <>
          <div className={styles.name}>{translateExerciseName(currentSet.exercise_name, t)}</div>
          {currentSet.sets.map((set, index) => (
            <SetItem
              key={index}
              index={index}
              {...set}
              doubleWeight={currentSet.doubleWeight}
              ownWeight={currentSet.ownWeight}
              removeSet={() => removeSet(index)}
              updateValue={(value) => updateValue(value, index)}
            />
          ))}
          <button className={styles.addSets} onClick={addSet}>
            {t('sets.add')}
          </button>
          <div className={styles.actionSetsPopupButtons}>
            <button className={styles.addButton} onClick={saveChanges}>
              {t('common.done')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
