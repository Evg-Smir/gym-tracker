import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/IndexedDB', () => ({
  setStorage: vi.fn(),
}));

vi.mock('@/db/client', () => ({
  addWorkout: vi.fn(),
  updateWorkout: vi.fn(),
  deleteWorkout: vi.fn(),
}));

vi.mock('@/stores/categoriesStore', () => ({
  useCategoryStore: {
    getState: () => ({
      categories: [
        {
          id: 1,
          name: 'Грудь',
          slug: 'chest',
          icon: '/categories/chest.svg',
          exercises: [
            { id: 5, name: 'Жим', doubleWeight: true, ownWeight: false },
          ],
        },
      ],
    }),
  },
}));

import { addWorkout, deleteWorkout, updateWorkout } from '@/db/client';
import { setStorage } from '@/services/IndexedDB';
import { useExercisesStore } from '@/stores/exercisesStore';

const sampleExercise = {
  id: 1,
  category_id: 1,
  category_icon: '/categories/chest.svg',
  exercise_id: 5,
  exercise_name: 'Жим',
  doubleWeight: true,
  ownWeight: false,
  sets: [] as { weight: string; reps: string }[],
};

describe('exercisesStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useExercisesStore.setState({
      exercises: [],
      exercisesOfCurrentDay: {
        time: 1000,
        exercises: [],
      },
    });
  });

  describe('updateExercise', () => {
    beforeEach(() => {
      useExercisesStore.setState({
        exercises: [
          {
            time: 1000,
            exercises: [{ ...sampleExercise }],
          },
        ],
        exercisesOfCurrentDay: {
          time: 1000,
          exercises: [{ ...sampleExercise }],
        },
      });
    });

    it('writes sets to IndexedDB and Firestore', () => {
      const updated = {
        ...sampleExercise,
        sets: [{ weight: '80', reps: '5' }],
      };

      useExercisesStore.getState().updateExercise(updated, 'user-1');

      expect(setStorage).toHaveBeenCalledWith(
        'exercises',
        expect.arrayContaining([
          expect.objectContaining({
            time: 1000,
            exercises: [expect.objectContaining({ sets: updated.sets })],
          }),
        ]),
      );
      expect(updateWorkout).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({
          time: 1000,
          exercises: [expect.objectContaining({ sets: updated.sets })],
        }),
      );
    });
  });

  describe('setExercise', () => {
    it('creates a new day with addWorkout when the day is empty', () => {
      useExercisesStore.getState().setExercise(1, 5, 'user-1');

      const state = useExercisesStore.getState();
      expect(state.exercisesOfCurrentDay.exercises).toHaveLength(1);
      expect(state.exercisesOfCurrentDay.exercises[0]).toMatchObject({
        exercise_id: 5,
        exercise_name: 'Жим',
        category_id: 1,
        sets: [],
      });
      expect(addWorkout).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({
          time: 1000,
          exercises: [expect.objectContaining({ exercise_id: 5 })],
        }),
      );
      expect(setStorage).toHaveBeenCalledWith('exercises', expect.any(Array));
      expect(updateWorkout).not.toHaveBeenCalled();
    });

    it('appends to an existing day with updateWorkout', () => {
      useExercisesStore.setState({
        exercises: [
          {
            time: 1000,
            exercises: [{ ...sampleExercise }],
          },
        ],
        exercisesOfCurrentDay: {
          time: 1000,
          exercises: [{ ...sampleExercise }],
        },
      });

      useExercisesStore.getState().setExercise(1, 5, 'user-1');

      const state = useExercisesStore.getState();
      expect(state.exercisesOfCurrentDay.exercises).toHaveLength(2);
      expect(state.exercisesOfCurrentDay.exercises[1].id).toBe(2);
      expect(updateWorkout).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({
          exercises: expect.arrayContaining([
            expect.objectContaining({ id: 1 }),
            expect.objectContaining({ id: 2 }),
          ]),
        }),
      );
      expect(addWorkout).not.toHaveBeenCalled();
    });
  });

  describe('removeExercise', () => {
    it('calls updateWorkout when other exercises remain', () => {
      const second = { ...sampleExercise, id: 2, exercise_name: 'Жим 2' };
      useExercisesStore.setState({
        exercises: [
          {
            time: 1000,
            exercises: [{ ...sampleExercise }, second],
          },
        ],
        exercisesOfCurrentDay: {
          time: 1000,
          exercises: [{ ...sampleExercise }, second],
        },
      });

      useExercisesStore.getState().removeExercise(sampleExercise, 'user-1');

      expect(useExercisesStore.getState().exercisesOfCurrentDay.exercises).toHaveLength(1);
      expect(updateWorkout).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({
          exercises: [expect.objectContaining({ id: 2 })],
        }),
      );
      expect(deleteWorkout).not.toHaveBeenCalled();
      expect(setStorage).toHaveBeenCalled();
    });

    it('calls deleteWorkout when the day becomes empty', () => {
      useExercisesStore.setState({
        exercises: [
          {
            time: 1000,
            exercises: [{ ...sampleExercise }],
          },
        ],
        exercisesOfCurrentDay: {
          time: 1000,
          exercises: [{ ...sampleExercise }],
        },
      });

      useExercisesStore.getState().removeExercise(sampleExercise, 'user-1');

      expect(useExercisesStore.getState().exercisesOfCurrentDay.exercises).toHaveLength(0);
      expect(useExercisesStore.getState().exercises).toHaveLength(0);
      expect(deleteWorkout).toHaveBeenCalledWith('user-1', 1000);
      expect(updateWorkout).not.toHaveBeenCalled();
      expect(setStorage).toHaveBeenCalledWith('exercises', []);
    });
  });

  describe('setExercisesOfCurrentDay', () => {
    it('normalizes to midnight and loads matching day', () => {
      const day = new Date(2024, 5, 15, 14, 30, 0);
      const midnight = Number(new Date(2024, 5, 15));
      useExercisesStore.setState({
        exercises: [
          {
            time: midnight,
            exercises: [{ ...sampleExercise }],
          },
        ],
        exercisesOfCurrentDay: { time: 0, exercises: [] },
      });

      useExercisesStore.getState().setExercisesOfCurrentDay(day);

      expect(useExercisesStore.getState().exercisesOfCurrentDay).toEqual({
        time: midnight,
        exercises: [expect.objectContaining({ id: 1 })],
      });
    });

    it('returns an empty day when no workout exists', () => {
      const day = new Date(2024, 5, 16, 10, 0, 0);
      const midnight = Number(new Date(2024, 5, 16));

      useExercisesStore.getState().setExercisesOfCurrentDay(day);

      expect(useExercisesStore.getState().exercisesOfCurrentDay).toEqual({
        time: midnight,
        exercises: [],
      });
    });
  });
});
