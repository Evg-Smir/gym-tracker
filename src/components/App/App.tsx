'use client';

import styles from './App.module.scss';
import { Calendar } from '@/components/Calendar/Calendar';
import { ExercisesList } from '@/components/Exercises/ExercisesList/ExercisesList';
import { MainPopup } from '@/components/Popups/MainPopup/MainPopup';
import { useCallback, useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useExercisesStore } from '@/stores/exercisesStore';
import { ActionSetsPopup } from '@/components/Popups/ActionSetsPopup/ActionSetsPopup';
import { AddNewButton } from '@/components/Buttons/AddNewButton/AddNewButton';
import { StatisticsPopup } from '@/components/Popups/StatisticsPopup/StatisticsPopup';

dayjs.locale('ru');

interface AppState {
  isClient: boolean;
  menuIsOpen: boolean;
  statIsOpen: boolean;
  actionSetId: number | null;
}

export const App = () => {
  const [appState, setAppState] = useState<AppState>({
    isClient: false,
    menuIsOpen: false,
    actionSetId: null,
    statIsOpen: false,
  });

  const exercisesOfCurrentDay = useExercisesStore((state) => state.exercisesOfCurrentDay);
  const setExercisesOfCurrentDay = useExercisesStore((state) => state.setExercisesOfCurrentDay);

  useEffect(() => {
    setExercisesOfCurrentDay(new Date());
    setAppState(prevState => ({ ...prevState, isClient: true }));
  }, [setExercisesOfCurrentDay]);

  const toggleMenu = useCallback(() => {
    setAppState(prevState => ({ ...prevState, menuIsOpen: !prevState.menuIsOpen }));
  }, []);

  const toggleStatPopup = useCallback(() => {
    setAppState(prevState => ({ ...prevState, statIsOpen: !prevState.statIsOpen }));
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
        <div className={styles.loading}><CircularProgress /></div>
        :
        <div className={styles.page}>
          <Calendar />
          <ExercisesList {...exercisesOfCurrentDay} setActionSetId={setActionSet} />
          <AddNewButton openMenu={toggleMenu} />
          <button className={styles.statButton} onClick={toggleStatPopup}>Статистика</button>
          {appState.menuIsOpen && <MainPopup toggleMenuPopupVisible={toggleMenu} />}
          {appState.actionSetId && <ActionSetsPopup unsetValue={unsetValue} setId={appState.actionSetId} />}
          {appState.statIsOpen && <StatisticsPopup closeStat={toggleStatPopup} />}
        </div>
      }
    </>
  );
};
