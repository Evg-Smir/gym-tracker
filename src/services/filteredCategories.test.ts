import { describe, expect, it } from 'vitest';
import { filterCategories } from '@/services/filteredCategories';
import { CategoryType } from '@/@types/categoryTypes';

const categories: CategoryType[] = [
  {
    id: 1,
    name: 'Руки',
    slug: 'arms',
    icon: '/categories/arm.svg',
    exercises: [
      { id: 1, name: 'Бицепс гантели', doubleWeight: false, ownWeight: false },
      { id: 2, name: 'Трицепс', doubleWeight: false, ownWeight: false },
    ],
  },
  {
    id: 2,
    name: 'Ноги',
    slug: 'legs',
    icon: '/categories/leg.svg',
    exercises: [
      { id: 1, name: 'Приседания', doubleWeight: false, ownWeight: false },
    ],
  },
];

describe('filterCategories', () => {
  it('returns all categories when filter is empty', () => {
    expect(filterCategories(categories, '   ')).toEqual(categories);
  });

  it('keeps full category when category name matches', () => {
    const result = filterCategories(categories, 'руки');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Руки');
    expect(result[0].exercises).toHaveLength(2);
  });

  it('filters exercises and hides empty categories', () => {
    const result = filterCategories(categories, 'присед');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Ноги');
    expect(result[0].exercises.map((ex) => ex.name)).toEqual(['Приседания']);
  });

  it('matches default categories by English labels via slug', () => {
    const seeded: CategoryType[] = [
      {
        id: 4,
        name: 'Грудь',
        slug: 'chest',
        icon: '/categories/chest.svg',
        exercises: [
          { id: 1, name: 'Жим штанги на плоской', doubleWeight: false, ownWeight: false },
        ],
      },
    ];

    const byCategory = filterCategories(seeded, 'chest');
    expect(byCategory).toHaveLength(1);
    expect(byCategory[0].exercises).toHaveLength(1);

    const byExercise = filterCategories(seeded, 'flat barbell');
    expect(byExercise).toHaveLength(1);
    expect(byExercise[0].exercises.map((ex) => ex.name)).toEqual(['Жим штанги на плоской']);
  });
});
