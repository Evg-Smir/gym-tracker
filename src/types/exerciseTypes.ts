export interface ExerciseRepsType {
  weight: string,
  reps: string,
}

export interface ExerciseType {
  id: number,
  category_id: number,
  category_icon: string,
  exercise_id: number,
  exercise_name: string,
  sets: ExerciseRepsType[]
}

export interface DayOfExercisesType {
  time: number;
  exercises: ExerciseType[];
}

export interface ExercisesStateType {
  exercises: DayOfExercisesType[];
  exercisesOfCurrentDay: DayOfExercisesType;
  setExercisesList: (exercisesList: any) => void;
  setExercise: (categoryId: number, exerciseId: number) => void;
  updateExercise: (exercise: ExerciseType) => void;
  removeExercise: (exercise: ExerciseType) => void;
  setExercisesOfCurrentDay: (time: Date) => void;
}
