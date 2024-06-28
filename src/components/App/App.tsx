"use client"

import styles from './App.module.scss';
import { Calendar } from "@/components/Calendar/Calendar";
import { ExercisesList } from "@/components/Exercises/ExercisesList/ExercisesList";
import { MainPopup } from "@/components/Popups/MainPopup/MainPopup";
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import { useExercisesStore } from "@/stores/exercises";

dayjs.locale('ru')

export const App = () => {
  const [isClient, setIsClient] = useState(false);
  const [menuIsOpen, setMenuVisible] = useState(false)
  const exercisesOfCurrentDay = useExercisesStore((state) => state.exercisesOfCurrentDay);
  const setExercisesOfCurrentDay = useExercisesStore((state) => state.setExercisesOfCurrentDay);

  useEffect(() => {
    setExercisesOfCurrentDay(new Date())
    setIsClient(true);
  }, []);

  const openMenu = () => {
    setMenuVisible(true)
  }

  return (
    <>
      {!isClient ?
        <div className={styles.loading}><CircularProgress/></div>
        :
        <div className={styles.page}>
          <Calendar/>
          <ExercisesList {...exercisesOfCurrentDay}/>
          <div className={styles.pageButtonWrapper}>
            <button
              onClick={openMenu}
              className={styles.pageButton}
            >
              Добавить упражнение
            </button>
          </div>
          <MainPopup isOpen={menuIsOpen} setMenuVisible={setMenuVisible}/>
        </div>
      }
    </>
  )
}
