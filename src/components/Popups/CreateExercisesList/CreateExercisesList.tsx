import styles from './CreateExercisesList.module.scss';

import { ExercisesCategoriesList } from '@/components/Exercises/ExercisesCategoriesList/ExercisesCategoriesList';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';

import { CategoryType } from '@/@types/categoryTypes';
import useAnimatedVisibility from '@/hooks/useAnimatedVisibility';
import useSwipeToClose from '@/hooks/useSwipeToClose';
import { useT } from '@/hooks/useT';
import { useEffect, useRef } from 'react';

interface CreateExercisesListType {
  categoriesList: CategoryType[];
  unsetValue: () => void;
  selectCategory: (categoryId: number) => void;
}

export const CreateExercisesList = ({
  categoriesList,
  unsetValue,
  selectCategory,
}: CreateExercisesListType) => {
  const { isVisible, show, hide } = useAnimatedVisibility();
  const t = useT();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    show();
  }, [show]);

  const closePopup = () => {
    hide();
    setTimeout(unsetValue, 300);
  };

  const swipeHandlers = useSwipeToClose(closePopup, scrollRef);

  return (
    <div
      {...swipeHandlers}
      className={`${styles.createExercisesList} ${isVisible ? styles.visible : ''}`}
    >
      <BackButton clickButton={closePopup} />
      <h3 className={styles.title}>{t('exercises.new')}</h3>
      <h1 className={styles.subtitle}>{t('exercises.chooseCategory')}</h1>
      <ExercisesCategoriesList
        ref={scrollRef}
        categoriesList={categoriesList}
        selectCategory={selectCategory}
        mini
      />
    </div>
  );
};
