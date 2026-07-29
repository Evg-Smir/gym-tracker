import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/application/persist', () => ({
  persistCategoriesLocal: vi.fn(),
  persistCategory: vi.fn(),
}));

import { persistCategoriesLocal, persistCategory } from '@/application/persist';
import { useCategoryStore } from '@/stores/categoriesStore';

describe('categoriesStore.actionExerciseOfCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCategoryStore.setState({
      categories: [
        {
          id: 4,
          name: 'Грудь',
          slug: 'chest',
          icon: '/categories/chest.svg',
          exercises: [
            { id: 1, name: 'Жим штанги на плоской', doubleWeight: false, ownWeight: false },
          ],
        },
      ],
    });
  });

  it('creates an exercise and persists to Firestore and IndexedDB', () => {
    useCategoryStore.getState().actionExerciseOfCategory(
      4,
      { id: 0, name: 'Жим гантелей', doubleWeight: true, ownWeight: false },
      'create',
      'user-1',
    );

    const category = useCategoryStore.getState().categories[0];
    expect(category.exercises).toHaveLength(2);
    expect(category.exercises[1]).toMatchObject({
      id: 2,
      name: 'Жим гантелей',
      doubleWeight: true,
    });
    expect(persistCategory).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        slug: 'chest',
        exercises: expect.arrayContaining([
          expect.objectContaining({ name: 'Жим гантелей', id: 2 }),
        ]),
      }),
    );
    expect(persistCategoriesLocal).toHaveBeenCalledWith(expect.any(Array));
  });

  it('updates an existing exercise', () => {
    useCategoryStore.getState().actionExerciseOfCategory(
      4,
      { id: 1, name: 'Жим штанги (обновлено)', doubleWeight: true, ownWeight: false },
      'update',
      'user-1',
    );

    const exercise = useCategoryStore.getState().categories[0].exercises[0];
    expect(exercise).toMatchObject({
      id: 1,
      name: 'Жим штанги (обновлено)',
      doubleWeight: true,
    });
    expect(persistCategory).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        exercises: [expect.objectContaining({ name: 'Жим штанги (обновлено)' })],
      }),
    );
    expect(persistCategoriesLocal).toHaveBeenCalled();
  });

  it('removes an exercise', () => {
    useCategoryStore.getState().actionExerciseOfCategory(
      4,
      { id: 1, name: 'Жим штанги на плоской', doubleWeight: false, ownWeight: false },
      'remove',
      'user-1',
    );

    expect(useCategoryStore.getState().categories[0].exercises).toHaveLength(0);
    expect(persistCategory).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ exercises: [] }),
    );
    expect(persistCategoriesLocal).toHaveBeenCalled();
  });

  it('no-ops when category is missing', () => {
    useCategoryStore.getState().actionExerciseOfCategory(
      999,
      { id: 1, name: 'X', doubleWeight: false, ownWeight: false },
      'create',
      'user-1',
    );

    expect(persistCategory).not.toHaveBeenCalled();
    expect(persistCategoriesLocal).not.toHaveBeenCalled();
  });
});
