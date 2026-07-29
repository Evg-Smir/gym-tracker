import styles from './StatisticsPopup.module.scss';
import { SearchInput } from '@/components/Inputs/MenuPopupInput/SearchInput';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import { ExercisesCategoriesList } from '@/components/Exercises/ExercisesCategoriesList/ExercisesCategoriesList';
import { StatisticsExercisesPopup } from '@/components/Popups/StatisticsExercisesPopup/StatisticsExercisesPopup';
import { useStatisticsPopup } from '@/hooks/useStatisticsPopup';

interface StatisticsPopupProps {
  closeStat: () => void;
}

export const StatisticsPopup = ({ closeStat }: StatisticsPopupProps) => {
  const {
    isVisible,
    shouldRender,
    popupState,
    filteredCategoriesList,
    closePopup,
    unsetCategory,
    setInputValue,
    selectCategory,
  } = useStatisticsPopup(closeStat);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.statisticsPopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closePopup} />
      <h2 className={styles.title}>Статистика</h2>
      <SearchInput updateValue={setInputValue} />
      <ExercisesCategoriesList
        categoriesList={filteredCategoriesList}
        selectCategory={selectCategory}
      />
      {popupState.selectedCategory && (
        <StatisticsExercisesPopup
          category={popupState.selectedCategory}
          unsetCategory={unsetCategory}
        />
      )}
    </div>
  );
};
