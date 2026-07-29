import { useCallback, useEffect, useMemo, useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';

import { CategoryType } from '@/@types/categoryTypes';
import {
  buildStatisticsSeries,
  resolveMetricForExercise,
  StatisticsMetric,
  StatisticsPoint,
} from '@/domain/statistics';
import useAnimatedVisibility from '@/hooks/useAnimatedVisibility';
import { useExercisesStore } from '@/stores/exercisesStore';
import { useT } from '@/hooks/useT';

interface StatisticsState {
  exercise: string;
  exerciseList: StatisticsPoint[];
  metric: 'weight' | 'volume';
}

export const useExerciseStatistics = (
  category: CategoryType | null,
  onClose: () => void,
) => {
  const exercisesList = useExercisesStore((state) => state.exercises);
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const t = useT();
  const [staticsState, setStaticsState] = useState<StatisticsState>({
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

  const metricLabel =
    activeMetric === 'reps'
      ? t('statistics.metric.reps')
      : activeMetric === 'volume'
        ? t('statistics.metric.volume')
        : t('statistics.metric.weight');

  const rebuildSeries = useCallback(
    (exerciseId: string, metric: 'weight' | 'volume') => {
      if (!category || !exerciseId) return [];

      const catalogExercise = category.exercises.find((ex) => ex.id === Number(exerciseId));
      const resolved = resolveMetricForExercise(catalogExercise?.ownWeight, metric);

      return buildStatisticsSeries(exercisesList, category.id, Number(exerciseId), resolved);
    },
    [category, exercisesList],
  );

  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      const exerciseId = event.target.value;
      setStaticsState((prevState) => ({
        ...prevState,
        exercise: exerciseId,
        exerciseList: rebuildSeries(exerciseId, prevState.metric),
      }));
    },
    [rebuildSeries],
  );

  const handleMetricChange = useCallback(
    (metric: 'weight' | 'volume') => {
      setStaticsState((prevState) => ({
        ...prevState,
        metric,
        exerciseList: rebuildSeries(prevState.exercise, metric),
      }));
    },
    [rebuildSeries],
  );

  useEffect(() => {
    show();
  }, [show]);

  useEffect(() => {
    if (!staticsState.exercise) return;
    setStaticsState((prevState) => ({
      ...prevState,
      exerciseList: rebuildSeries(prevState.exercise, prevState.metric),
    }));
  }, [exercisesList, rebuildSeries, staticsState.exercise]);

  const closePopup = useCallback(() => {
    hide();
    setTimeout(onClose, 300);
  }, [hide, onClose]);

  return {
    isVisible,
    shouldRender,
    staticsState,
    selectedCatalogExercise,
    metricLabel,
    handleChange,
    handleMetricChange,
    closePopup,
  };
};
