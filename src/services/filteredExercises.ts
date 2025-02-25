import { DayOfExercisesType } from '@/@types/exerciseTypes';

export const filteredExercises = (exercises: DayOfExercisesType[]): DayOfExercisesType[] => {
  return exercises.filter(exercise => exercise.time && exercise.exercises.length > 0);
};
