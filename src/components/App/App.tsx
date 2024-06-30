"use client"

import styles from './App.module.scss';
import { Calendar } from "@/components/Calendar/Calendar";
import { ExercisesList } from "@/components/Exercises/ExercisesList/ExercisesList";
import { MainPopup } from "@/components/Popups/MainPopup/MainPopup";
import { useCallback, useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import { useExercisesStore } from "@/stores/exercisesStore";
import { ActionSetsPopup } from "@/components/Popups/ActionSetsPopup/ActionSetsPopup";
import { AddNewButton } from "@/components/Buttons/AddNewButton/AddNewButton";

dayjs.locale('ru');

interface AppState {
  isClient: boolean;
  menuIsOpen: boolean;
  actionSetId: number | null;
}

export const App = () => {
  const [appState, setAppState] = useState<AppState>({
    isClient: false,
    menuIsOpen: false,
    actionSetId: null
  });

  const exercisesOfCurrentDay = useExercisesStore((state) => state.exercisesOfCurrentDay);
  const setExercisesOfCurrentDay = useExercisesStore((state) => state.setExercisesOfCurrentDay);

  useEffect(() => {
    setExercisesOfCurrentDay(new Date());
    setAppState(prevState => ({ ...prevState, isClient: true }));
  }, [setExercisesOfCurrentDay]);

  const openMenu = useCallback(() => {
    setAppState(prevState => ({ ...prevState, menuIsOpen: true }));
  }, []);

  const setActionSet = useCallback((setId: number) => {
    setAppState(prevState => ({ ...prevState, actionSetId: setId }));
  }, []);

  const unsetValue = useCallback(() => {
    setAppState(prevState => ({ ...prevState, actionSetId: null }));
  }, []);

  return (
    <>
      {!appState.isClient ?
        <div className={styles.loading}><CircularProgress/></div>
        :
        <div className={styles.page}>
          <Calendar/>
          <ExercisesList {...exercisesOfCurrentDay} setActionSetId={setActionSet}/>
          <AddNewButton openMenu={openMenu}/>
          {appState.menuIsOpen && <MainPopup setMenuVisible={openMenu}/>}
          {appState.actionSetId && <ActionSetsPopup unsetValue={unsetValue} setId={appState.actionSetId}/>}
        </div>
      }
    </>
  );
};
