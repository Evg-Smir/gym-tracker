export interface ExerciseRepsType {
  weight: number,
  reps: number,
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
  exercises: ExerciseType[]
}

export interface ExercisesStateType {
  exercises: DayOfExercisesType[];
  exercisesOfCurrentDay: DayOfExercisesType;
  setExercise: (exercise: DayOfExercisesType) => void;
  setExercisesOfCurrentDay: (time: Date) => void;
}
