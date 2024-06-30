export interface ExercisesOfCategoryType {
  id: number;
  name: string;
  doubleWeight: boolean,
  ownWeight: boolean,
}

export interface CategoryType {
  id: number;
  name: string;
  icon: string;
  exercises: ExercisesOfCategoryType[];
}

export interface CategoryStoreType {
  categories: CategoryType[];
  setCategories: (categories: CategoryType[]) => void;
  actionExerciseOfCategory: (categoryId: number, exercise: ExercisesOfCategoryType, action: 'create' | 'update' | 'remove') => void;
}

export interface SelectedExerciseType {
  exerciseId: number,
  categoryId: number
}
