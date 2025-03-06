import { useReducer } from 'react';

import styles from './App.module.scss';

import { Bar } from '@/components/Bar/Bar';
import { Calendar } from '@/components/Calendar/Calendar';
import { ExercisesList } from '@/components/Exercises/ExercisesList/ExercisesList';
import { MainPopup } from '@/components/Popups/MainPopup/MainPopup';
import { ActionSetsPopup } from '@/components/Popups/ActionSetsPopup/ActionSetsPopup';
import { StatisticsPopup } from '@/components/Popups/StatisticsPopup/StatisticsPopup';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

import { useExercisesStore } from '@/stores/exercisesStore';
import { ProfilePopup } from '@/components/Popups/ProfilePopup/ProfilePopup';

interface AppState {
  menuIsOpen: boolean;
  statIsOpen: boolean;
  profileIsOpen: boolean;
  actionSetId: number | null;
}

type Action =
  | { type: 'TOGGLE_MENU' }
  | { type: 'TOGGLE_STATS' }
  | { type: 'TOGGLE_PROFILE' }
  | { type: 'SET_ACTION_SET'; payload: number }
  | { type: 'UNSET_ACTION_SET' };

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return { ...state, menuIsOpen: !state.menuIsOpen };
    case 'TOGGLE_STATS':
      return { ...state, statIsOpen: !state.statIsOpen };
    case 'TOGGLE_PROFILE':
      return { ...state, profileIsOpen: !state.profileIsOpen };
    case 'SET_ACTION_SET':
      return { ...state, actionSetId: action.payload };
    case 'UNSET_ACTION_SET':
      return { ...state, actionSetId: null };
    default:
      return state;
  }
};

export const App = () => {
    const [state, dispatch] = useReducer(reducer, {
      menuIsOpen: false,
      statIsOpen: false,
      profileIsOpen: false,
      actionSetId: null,
    });

    const { exercisesOfCurrentDay } = useExercisesStore((state) => ({ exercisesOfCurrentDay: state.exercisesOfCurrentDay }));

    return (
      <div className={styles.page}>
        <Calendar />
        <ExercisesList
          {...exercisesOfCurrentDay}
          setActionSetId={(id) => dispatch({ type: 'SET_ACTION_SET', payload: id })}
        />
        <Bar
          openMenu={() => dispatch({ type: 'TOGGLE_MENU' })}
          openStats={() => dispatch({ type: 'TOGGLE_STATS' })}
          openProfile={() => dispatch({ type: 'TOGGLE_PROFILE' })}
        />
        {state.menuIsOpen && <MainPopup toggleMenuPopupVisible={() => dispatch({ type: 'TOGGLE_MENU' })} />}
        {state.actionSetId && (
          <ActionSetsPopup
            unsetValue={() => dispatch({ type: 'UNSET_ACTION_SET' })}
            setId={state.actionSetId}
          />
        )}
        {state.statIsOpen && <StatisticsPopup closeStat={() => dispatch({ type: 'TOGGLE_STATS' })} />}
        {state.profileIsOpen && <ProfilePopup closeProfile={() => dispatch({ type: 'TOGGLE_PROFILE' })} />}
      </div>
    );
  }
;
