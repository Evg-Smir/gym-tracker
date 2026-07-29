import { describe, expect, it } from 'vitest';
import {
  buildStatisticsSeries,
  getMaxWeight,
  getTotalReps,
  getVolume,
  resolveMetricForExercise,
} from '@/services/statistics';
import { DayOfExercisesType, ExerciseType } from '@/@types/exerciseTypes';

const weightedExercise: ExerciseType = {
  id: 1,
  category_id: 1,
  category_icon: '/icon.svg',
  exercise_id: 10,
  exercise_name: 'Жим',
  ownWeight: false,
  sets: [
    { weight: '40', reps: '10' },
    { weight: '50', reps: '8' },
  ],
};

const bodyweightExercise: ExerciseType = {
  ...weightedExercise,
  id: 2,
  exercise_id: 11,
  ownWeight: true,
  sets: [
    { weight: '0', reps: '12' },
    { weight: '0', reps: '10' },
  ],
};

describe('statistics helpers', () => {
  it('computes max weight across sets', () => {
    expect(getMaxWeight(weightedExercise)).toBe(50);
  });

  it('computes volume as sum(weight * reps)', () => {
    expect(getVolume(weightedExercise)).toBe(40 * 10 + 50 * 8);
  });

  it('returns null volume/max for ownWeight exercises', () => {
    expect(getMaxWeight(bodyweightExercise)).toBeNull();
    expect(getVolume(bodyweightExercise)).toBeNull();
    expect(getTotalReps(bodyweightExercise)).toBe(22);
  });

  it('resolves metric for bodyweight to reps', () => {
    expect(resolveMetricForExercise(true, 'weight')).toBe('reps');
    expect(resolveMetricForExercise(false, 'volume')).toBe('volume');
  });

  it('builds series points for matching workouts', () => {
    const dayTime = new Date(2026, 6, 29).getTime();
    const workouts: DayOfExercisesType[] = [
      {
        time: dayTime,
        exercises: [weightedExercise],
      },
      {
        time: new Date(2026, 6, 28).getTime(),
        exercises: [{ ...weightedExercise, sets: [] }],
      },
    ];

    const series = buildStatisticsSeries(workouts, 1, 10, 'weight');
    expect(series).toEqual([{ time: '29.07.2026', value: 50 }]);
  });
});
