import { CategoryType } from '@/@types/categoryTypes';

export const DEFAULT_CATEGORIES: CategoryType[] = [
  {
    id: 1,
    name: 'Руки',
    slug: 'arm',
    icon: '/categories/bicep.svg',
    exercises: [
      { id: 1, name: 'Отжимания на брусьях', doubleWeight: false, ownWeight: false },
      { id: 2, name: 'Подъем штанги на бицепс', doubleWeight: false, ownWeight: false },
    ],
  },
  {
    id: 2,
    name: 'Спина',
    slug: 'back',
    icon: '/categories/back.svg',
    exercises: [
      { id: 1, name: 'Тяга верхнего блока', doubleWeight: false, ownWeight: false },
    ],
  },
  {
    id: 3,
    name: 'Плечи',
    slug: 'shoulder',
    icon: '/categories/shoulders.svg',
    exercises: [
      { id: 1, name: 'Жим гантелей сидя', doubleWeight: false, ownWeight: false },
    ],
  },
  {
    id: 4,
    name: 'Грудь',
    slug: 'chest',
    icon: '/categories/chest.svg',
    exercises: [
      { id: 1, name: 'Жим штанги на плоской', doubleWeight: false, ownWeight: false },
    ],
  },
  {
    id: 5,
    name: 'Пресс',
    slug: 'abs',
    icon: '/categories/abs.svg',
    exercises: [
      { id: 1, name: 'Скручивания', doubleWeight: false, ownWeight: false },
    ],
  },
  {
    id: 6,
    name: 'Ноги',
    slug: 'leg',
    icon: '/categories/leg.svg',
    exercises: [
      { id: 1, name: 'Выпады со штангой', doubleWeight: false, ownWeight: false },
    ],
  },
];
