import styles from './App.module.scss';

import { Bar } from '@/components/Bar/Bar';
import { Calendar } from '@/components/Calendar/Calendar';
import { ExercisesList } from '@/components/Exercises/ExercisesList/ExercisesList';
import { MainPopup } from '@/components/Popups/MainPopup/MainPopup';
import { ActionSetsPopup } from '@/components/Popups/ActionSetsPopup/ActionSetsPopup';
import { StatisticsPopup } from '@/components/Popups/StatisticsPopup/StatisticsPopup';
import { ProfilePopup } from '@/components/Popups/ProfilePopup/ProfilePopup';
import { useAppPopups } from '@/hooks/useAppPopups';
import { useExercisesStore } from '@/stores/exercisesStore';

export const App = () => {
  const {
    state,
    toggleMenu,
    toggleStats,
    toggleProfile,
    setActionSetId,
    unsetActionSet,
  } = useAppPopups();

  const exercisesOfCurrentDay = useExercisesStore((store) => store.exercisesOfCurrentDay);

  return (
    <div className={styles.page}>
      <Calendar />
      <ExercisesList {...exercisesOfCurrentDay} setActionSetId={setActionSetId} />
      <Bar openMenu={toggleMenu} openStats={toggleStats} openProfile={toggleProfile} />
      {state.menuIsOpen && <MainPopup toggleMenuPopupVisible={toggleMenu} />}
      {state.actionSetId && (
        <ActionSetsPopup unsetValue={unsetActionSet} setId={state.actionSetId} />
      )}
      {state.statIsOpen && <StatisticsPopup closeStat={toggleStats} />}
      {state.profileIsOpen && <ProfilePopup closeProfile={toggleProfile} />}
    </div>
  );
};
