import { DayOfExercisesType, ExerciseType } from '@/@types/exerciseTypes';
import { formatTimestampToDate } from '@/services/formatTimestampToDate';

export type StatisticsMetric = 'weight' | 'volume' | 'reps';

export interface StatisticsPoint {
  time: string;
  value: number;
}

const parseNumber = (value: string): number | null => {
  if (value == null || String(value).trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const getMaxWeight = (exercise: ExerciseType): number | null => {
  if (exercise.ownWeight || !exercise.sets?.length) return null;

  let max: number | null = null;
  for (const set of exercise.sets) {
    const weight = parseNumber(set.weight);
    if (weight == null) continue;
    max = max == null ? weight : Math.max(max, weight);
  }
  return max;
};

export const getVolume = (exercise: ExerciseType): number | null => {
  if (exercise.ownWeight || !exercise.sets?.length) return null;

  let volume = 0;
  let hasValue = false;

  for (const set of exercise.sets) {
    const weight = parseNumber(set.weight);
    const reps = parseNumber(set.reps);
    if (weight == null || reps == null) continue;
    volume += weight * reps;
    hasValue = true;
  }

  return hasValue ? volume : null;
};

export const getTotalReps = (exercise: ExerciseType): number | null => {
  if (!exercise.sets?.length) return null;

  let total = 0;
  let hasValue = false;

  for (const set of exercise.sets) {
    const reps = parseNumber(set.reps);
    if (reps == null) continue;
    total += reps;
    hasValue = true;
  }

  return hasValue ? total : null;
};

export const buildStatisticsSeries = (
  workouts: DayOfExercisesType[],
  categoryId: number,
  exerciseId: number,
  metric: StatisticsMetric,
): StatisticsPoint[] => {
  return workouts
    .flatMap((day) =>
      day.exercises
        .filter((ex) => ex.exercise_id === exerciseId && ex.category_id === categoryId)
        .map((ex) => {
          let value: number | null = null;

          if (metric === 'weight') value = getMaxWeight(ex);
          else if (metric === 'volume') value = getVolume(ex);
          else value = getTotalReps(ex);

          if (value == null) return null;

          return {
            time: formatTimestampToDate(day.time),
            value,
          };
        })
        .filter((point): point is StatisticsPoint => point != null),
    );
};

export const resolveMetricForExercise = (
  catalogOwnWeight: boolean | undefined,
  preferred: 'weight' | 'volume',
): StatisticsMetric => {
  if (catalogOwnWeight) return 'reps';
  return preferred;
};
