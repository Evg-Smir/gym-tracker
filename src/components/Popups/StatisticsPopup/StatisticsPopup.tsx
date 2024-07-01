import styles from './StatisticsPopup.module.scss';
import { SearchInput } from "@/components/Inputs/MenuPopupInput/SearchInput";
import React, { useEffect, useState } from "react";
import useAnimatedVisibility from "@/hooks/useAnimatedVisibility";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";
import { ExercisesCategoriesList } from "@/components/Exercises/ExercisesCategoriesList/ExercisesCategoriesList";
import { useCategoryStore } from "@/stores/categoriesStore";

interface StatisticsPopupProps {
  closeStat: () => void
}

interface popupStateType {
  searchInput: string,
}

export const StatisticsPopup = ({ closeStat }: StatisticsPopupProps) => {
  const categoriesList = useCategoryStore((state) => state.categories);
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const [popupState, setPopupState] = useState<popupStateType>({
    searchInput: ''
  })

  useEffect(() => {
    show();
  }, [show]);

  const closePopup = () => {
    hide();
    setTimeout(closeStat, 300)
  }

  const selectCategory = (categoryId: number) => {
    console.log(categoryId)
  }

  if (!shouldRender) return null;

  return (
    <div className={`${styles.statisticsPopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closePopup}/>
      <h2 className={styles.title}>Статистика</h2>
      <SearchInput updateValue={value => setPopupState(prevState => ({ ...prevState, searchInput: value }))}/>
      <ExercisesCategoriesList categoriesList={categoriesList} selectCategory={selectCategory} />
    </div>
  )
}
