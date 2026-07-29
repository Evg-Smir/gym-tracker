import styles from './StatisticsExercisesPopup.module.scss';
import { CategoryType } from "@/@types/categoryTypes";
import useAnimatedVisibility from "@/hooks/useAnimatedVisibility";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useExercisesStore } from "@/stores/exercisesStore";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  buildStatisticsSeries,
  resolveMetricForExercise,
  StatisticsMetric,
  StatisticsPoint,
} from '@/services/statistics';

interface StatisticsExercisesPopupProps {
  category: CategoryType | null;
  unsetCategory: () => void;
}

interface StaticsStateType {
  exercise: string;
  exerciseList: StatisticsPoint[];
  metric: 'weight' | 'volume';
}

export const StatisticsExercisesPopup = ({ category, unsetCategory }: StatisticsExercisesPopupProps) => {
  const exercisesList = useExercisesStore((state) => state.exercises);
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const [staticsState, setStaticsState] = useState<StaticsStateType>({
    exercise: '',
    exerciseList: [],
    metric: 'weight',
  });

  const selectedCatalogExercise = useMemo(() => {
    if (!category || !staticsState.exercise) return undefined;
    return category.exercises.find((ex) => ex.id === Number(staticsState.exercise));
  }, [category, staticsState.exercise]);

  const activeMetric: StatisticsMetric = resolveMetricForExercise(
    selectedCatalogExercise?.ownWeight,
    staticsState.metric,
  );

  const metricLabel = activeMetric === 'reps'
    ? 'Повторения'
    : activeMetric === 'volume'
      ? 'Объём'
      : 'Вес';

  const EmptyBlock = () => (
    <div className={styles.emptyBlock}>
      <img src="/ui/background.png" alt="Фон"/>
      <p>Добавьте подходы, чтобы показать статистику</p>
    </div>
  );

  const rebuildSeries = useCallback((exerciseId: string, metric: 'weight' | 'volume') => {
    if (!category || !exerciseId) {
      return [];
    }

    const catalogExercise = category.exercises.find((ex) => ex.id === Number(exerciseId));
    const resolved = resolveMetricForExercise(catalogExercise?.ownWeight, metric);

    return buildStatisticsSeries(
      exercisesList,
      category.id,
      Number(exerciseId),
      resolved,
    );
  }, [category, exercisesList]);

  const handleChange = useCallback((event: SelectChangeEvent) => {
    const exerciseId = event.target.value;
    setStaticsState((prevState) => ({
      ...prevState,
      exercise: exerciseId,
      exerciseList: rebuildSeries(exerciseId, prevState.metric),
    }));
  }, [rebuildSeries]);

  const handleMetricChange = useCallback((metric: 'weight' | 'volume') => {
    setStaticsState((prevState) => ({
      ...prevState,
      metric,
      exerciseList: rebuildSeries(prevState.exercise, metric),
    }));
  }, [rebuildSeries]);

  useEffect(() => {
    show();
  }, [show]);

  useEffect(() => {
    if (!staticsState.exercise) return;
    setStaticsState((prevState) => ({
      ...prevState,
      exerciseList: rebuildSeries(prevState.exercise, prevState.metric),
    }));
  }, [exercisesList, rebuildSeries]);

  const closePopup = useCallback(() => {
    hide();
    setTimeout(unsetCategory, 300);
  }, [hide, unsetCategory]);

  const exerciseOptions = useMemo(() => {
    if (!category) return null;
    return category.exercises.map(ex => (
      <MenuItem key={ex.id} value={ex.id}>{ex.name}</MenuItem>
    ));
  }, [category]);

  if (!shouldRender || !category) return null;

  return (
    <div className={`${styles.statisticsExercisesPopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closePopup}/>
      <h2 className={styles.title}>Статистика</h2>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Упражнение</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={staticsState.exercise}
          label="Упражнение"
          onChange={handleChange}
        >
          {exerciseOptions}
        </Select>
      </FormControl>

      {staticsState.exercise && !selectedCatalogExercise?.ownWeight && (
        <div className={styles.metricToggle}>
          <button
            type="button"
            className={staticsState.metric === 'weight' ? styles.metricActive : ''}
            onClick={() => handleMetricChange('weight')}
          >
            Вес
          </button>
          <button
            type="button"
            className={staticsState.metric === 'volume' ? styles.metricActive : ''}
            onClick={() => handleMetricChange('volume')}
          >
            Объём
          </button>
        </div>
      )}

      {staticsState.exerciseList.length > 0 ? (
        <>
          <h3 className={styles.label}>{metricLabel}</h3>
          <div className={styles.graphWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={staticsState.exerciseList}
                height={300}
                margin={{
                  top: 10,
                  right: 5,
                  left: 5,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="time" strokeWidth={0}/>
                <Tooltip/>
                <Line dot={false} type="monotone" dataKey="value" name={metricLabel} stroke="#1C1C1EFF" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) :
        <EmptyBlock />
      }
    </div>
  );
};
