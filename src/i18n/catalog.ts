import type { CategoryType } from '@/@types/categoryTypes';
import type { TranslationKey } from '@/i18n/dictionaries';
import { dictionaries } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/types';

const CATEGORY_SLUG_KEYS: Record<string, TranslationKey> = {
  arm: 'categories.arm',
  back: 'categories.back',
  shoulder: 'categories.shoulder',
  chest: 'categories.chest',
  abs: 'categories.abs',
  leg: 'categories.leg',
};

const EXERCISE_NAME_KEYS: Record<string, TranslationKey> = {
  'Отжимания на брусьях': 'catalog.exercises.dips',
  'Подъем штанги на бицепс': 'catalog.exercises.barbellCurl',
  'Тяга верхнего блока': 'catalog.exercises.latPulldown',
  'Жим гантелей сидя': 'catalog.exercises.seatedDumbbellPress',
  'Жим штанги на плоской': 'catalog.exercises.flatBarbellPress',
  Скручивания: 'catalog.exercises.crunches',
  'Выпады со штангой': 'catalog.exercises.barbellLunges',
};

const EXERCISE_NAME_LOOKUP: Record<string, TranslationKey> = Object.fromEntries(
  Object.entries(EXERCISE_NAME_KEYS).flatMap(([ruName, key]) => {
    const enName = dictionaries.en[key];
    return [
      [ruName.toLowerCase(), key],
      [enName.toLowerCase(), key],
    ];
  }),
);

type TranslateFn = (key: TranslationKey) => string;

const labelsForKey = (key: TranslationKey): string[] => [
  dictionaries.ru[key],
  dictionaries.en[key],
];

export const translateCategoryName = (
  category: Pick<CategoryType, 'slug' | 'name'>,
  t: TranslateFn,
): string => {
  const key = CATEGORY_SLUG_KEYS[category.slug];
  return key ? t(key) : category.name;
};

export const translateExerciseName = (name: string, t: TranslateFn): string => {
  const key = EXERCISE_NAME_LOOKUP[name.toLowerCase()];
  return key ? t(key) : name;
};

export const categorySearchLabels = (category: Pick<CategoryType, 'slug' | 'name'>): string[] => {
  const key = CATEGORY_SLUG_KEYS[category.slug];
  return key ? labelsForKey(key) : [category.name];
};

export const exerciseSearchLabels = (name: string): string[] => {
  const key = EXERCISE_NAME_LOOKUP[name.toLowerCase()];
  return key ? labelsForKey(key) : [name];
};

export const matchesSearch = (labels: string[], filter: string): boolean =>
  labels.some((label) => label.toLowerCase().includes(filter));
