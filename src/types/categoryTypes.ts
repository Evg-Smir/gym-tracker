export interface ExercisesOfCategoryType {
  id: number;
  name: string;
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
  addNewCategory: (category: CategoryType) => void;
  addNewExerciseOfCategory: (categoryId: number, exercise: ExercisesOfCategoryType) => void;
}
