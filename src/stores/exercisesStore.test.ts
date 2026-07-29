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

import { updateWorkout } from '@/db/client';
import { setStorage } from '@/services/IndexedDB';
import { useExercisesStore } from '@/stores/exercisesStore';

describe('exercisesStore.updateExercise', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useExercisesStore.setState({
      exercises: [
        {
          time: 1000,
          exercises: [
            {
              id: 1,
              category_id: 1,
              category_icon: '/categories/chest.svg',
              exercise_id: 5,
              exercise_name: 'Жим',
              doubleWeight: true,
              ownWeight: false,
              sets: [],
            },
          ],
        },
      ],
      exercisesOfCurrentDay: {
        time: 1000,
        exercises: [
          {
            id: 1,
            category_id: 1,
            category_icon: '/categories/chest.svg',
            exercise_id: 5,
            exercise_name: 'Жим',
            doubleWeight: true,
            ownWeight: false,
            sets: [],
          },
        ],
      },
    });
  });

  it('writes sets to IndexedDB and Firestore', () => {
    const updated = {
      id: 1,
      category_id: 1,
      category_icon: '/categories/chest.svg',
      exercise_id: 5,
      exercise_name: 'Жим',
      doubleWeight: true,
      ownWeight: false,
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
