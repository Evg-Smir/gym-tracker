import { create } from 'zustand';

import { ExercisesStateType, ExerciseType, DayOfExercisesType } from '@/@types/exerciseTypes';
import { persistExercisesLocal, persistWorkoutDay } from '@/application/persist';
import {
  addExerciseToDay,
  removeExerciseFromDay,
  selectDayFromExercises,
  updateExerciseInDay,
} from '@/domain/workoutReducers';
import { useCategoryStore } from '@/stores/categoriesStore';

export const useExercisesStore = create<ExercisesStateType>((set, get) => ({
  exercises: [],
  exercisesOfCurrentDay: {
    time: 0,
    exercises: [],
  },

  setExercisesList: (exercisesList: DayOfExercisesType[]) => {
    set({ exercises: exercisesList });
  },

  setExercise: (categoryId, exerciseId, uid) => {
    const categoriesList = useCategoryStore.getState().categories;
    const category = categoriesList.find((cat) => cat.id === categoryId);
    if (!category) return;

    const exercise = category.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const result = addExerciseToDay(get(), category, exercise);
    if (!result) return;

    set({
      exercises: result.exercises,
      exercisesOfCurrentDay: result.exercisesOfCurrentDay,
    });

    void persistExercisesLocal(result.exercises);
    void persistWorkoutDay(uid, result.exercisesOfCurrentDay, result.created ? 'add' : 'update');
  },

  updateExercise: (exercise: ExerciseType, uid) => {
    const result = updateExerciseInDay(get(), exercise);
    if (!result) return;

    set({
      exercises: result.exercises,
      exercisesOfCurrentDay: result.exercisesOfCurrentDay,
    });

    void persistExercisesLocal(result.exercises);
    void persistWorkoutDay(uid, result.exercisesOfCurrentDay, 'update');
  },

  removeExercise: (exercise: ExerciseType, uid) => {
    const result = removeExerciseFromDay(get(), exercise);
    if (!result) return;

    set({
      exercises: result.exercises,
      exercisesOfCurrentDay: result.exercisesOfCurrentDay,
    });

    void persistExercisesLocal(result.exercises);
    void persistWorkoutDay(
      uid,
      result.exercisesOfCurrentDay,
      result.deleted ? 'delete' : 'update',
    );
  },

  setExercisesOfCurrentDay: (time) => {
    set({
      exercisesOfCurrentDay: selectDayFromExercises(get().exercises, time),
    });
  },
}));
