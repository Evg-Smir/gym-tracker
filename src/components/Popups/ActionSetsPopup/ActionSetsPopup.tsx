import styles from './ActionSetsPopup.module.scss';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import { SetItem } from '@/components/Sets/SetItem/SetItem';
import { useActionSetsForm } from '@/hooks/useActionSetsForm';

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

  if (!shouldRender) return null;

  return (
    <div className={`${styles.actionSetsPopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton
        clickButton={() => {
          closePopup();
          saveChanges();
        }}
      />
      {currentSet && (
        <>
          <div className={styles.name}>{currentSet.exercise_name}</div>
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
            Добавить подход
          </button>
          <div className={styles.actionSetsPopupButtons}>
            <button className={styles.addButton} onClick={saveChanges}>
              Готово
            </button>
          </div>
        </>
      )}
    </div>
  );
};
