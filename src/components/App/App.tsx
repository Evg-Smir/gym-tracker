"use client"

import styles from './App.module.scss';
import { Calendar } from "@/components/Calendar/Calendar";
import { ExercisesList } from "@/components/Exercises/ExercisesList/ExercisesList";
import { MainPopup } from "@/components/Popups/MainPopup/MainPopup";
import { useCallback, useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import { useExercisesStore } from "@/stores/exercises";
import { ActionSetsPopup } from "@/components/Popups/ActionSetsPopup/ActionSetsPopup";

dayjs.locale('ru')

export const App = () => {
  const [isClient, setIsClient] = useState(false);
  const [menuIsOpen, setMenuVisible] = useState(false)
  const [actionSetId, setActionSetId] = useState<number | null>(null)
  const exercisesOfCurrentDay = useExercisesStore((state) => state.exercisesOfCurrentDay);
  const setExercisesOfCurrentDay = useExercisesStore((state) => state.setExercisesOfCurrentDay);

  useEffect(() => {
    setExercisesOfCurrentDay(new Date())
    setIsClient(true);
  }, []);

  const openMenu = () => {
    setMenuVisible(true)
  }

  const setActionSet = useCallback((setId: number) => {
    setActionSetId(setId)
  }, [])

  const unsetValue = useCallback(() => {
    setActionSetId(null);
  }, [])

  return (
    <>
      {!isClient ?
        <div className={styles.loading}><CircularProgress/></div>
        :
        <div className={styles.page}>
          <Calendar/>
          <ExercisesList {...exercisesOfCurrentDay} setActionSetId={setActionSet}/>
          <div className={styles.pageButtonWrapper}>
            <button
              onClick={openMenu}
              className={styles.pageButton}
            >
              Добавить упражнение
            </button>
          </div>
          {menuIsOpen && <MainPopup setMenuVisible={setMenuVisible}/>}
          {actionSetId && <ActionSetsPopup unsetValue={unsetValue} setId={actionSetId}/>}
        </div>
      }
    </>
  )
}
