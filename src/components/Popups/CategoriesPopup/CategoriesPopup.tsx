import styles from './CategoriesPopup.module.scss';
import { AddExerciseButton } from '@/components/Buttons/AddExerciseButton/AddExerciseButton';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import { CategoryType, SelectedExerciseType } from '@/@types/categoryTypes';
import { useCategoryExerciseSelection } from '@/hooks/useCategoryExerciseSelection';
import { withBasePath } from '@/lib/basePath';
import { useT } from '@/hooks/useT';

interface CategoriesPopupProps {
  category: CategoryType | null;
  unsetCategory: () => void;
  closeAllPopups: () => void;
  changeExercise: (value: SelectedExerciseType) => void;
  createExercise: (category: CategoryType | null) => void;
}

export const CategoriesPopup = ({
  category,
  changeExercise,
  unsetCategory,
  createExercise,
  closeAllPopups,
}: CategoriesPopupProps) => {
  const {
    selectedExercises,
    isVisible,
    shouldRender,
    selectExercise,
    isSelected,
    confirmSelection,
    closePopup,
    clearSelection,
  } = useCategoryExerciseSelection(category, unsetCategory, closeAllPopups);
  const t = useT();

  if (!shouldRender || !category) return null;

  return (
    <div className={`${styles.categoriesPopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closePopup} />
      <h2 className={styles.categoryName}>{category.name}</h2>
      <AddExerciseButton clickButton={() => createExercise(category)} />
      <div className={styles.categoryExercises}>
        {category.exercises.map((exercise) => (
          <div
            className={`${styles.exercise} ${isSelected(exercise) ? styles.selected : ''}`}
            key={exercise.id}
            onClick={() => selectExercise(exercise.id, category.id)}
          >
            <span>{exercise.name}</span>
            {isSelected(exercise) ? <img src={withBasePath('/ui/check-mark.svg')} alt={t('common.checkAlt')} /> : null}
          </div>
        ))}
      </div>
      <div className={styles.categoriesPopupButtons}>
        {selectedExercises.length > 0 && (
          <button className={styles.selectButton} onClick={confirmSelection}>
            {t('categories.select')}
          </button>
        )}
        {selectedExercises.length === 1 && (
          <button
            onClick={() => {
              changeExercise(selectedExercises[0]);
              clearSelection();
            }}
            className={styles.changeButton}
          >
            {t('categories.edit')}
          </button>
        )}
      </div>
    </div>
  );
};
