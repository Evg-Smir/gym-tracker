import { CategoryType, ExercisesOfCategoryType } from '@/@types/categoryTypes';
import { DayOfExercisesType, ExerciseType } from '@/@types/exerciseTypes';

export interface ExercisesStateSlice {
  exercises: DayOfExercisesType[];
  exercisesOfCurrentDay: DayOfExercisesType;
}

export interface AddExerciseResult {
  exercises: DayOfExercisesType[];
  exercisesOfCurrentDay: DayOfExercisesType;
  created: boolean;
}

const createWorkoutExercise = (
  category: CategoryType,
  exercise: ExercisesOfCategoryType,
  maxId: number,
): ExerciseType => ({
  id: maxId + 1,
  category_id: category.id,
  category_icon: category.icon,
  exercise_id: exercise.id,
  exercise_name: exercise.name,
  doubleWeight: exercise.doubleWeight,
  ownWeight: exercise.ownWeight,
  sets: [],
});

export const addExerciseToDay = (
  state: ExercisesStateSlice,
  category: CategoryType,
  exercise: ExercisesOfCategoryType,
): AddExerciseResult | null => {
  const currentDayTime = state.exercisesOfCurrentDay.time;
  const dayIndex = state.exercises.findIndex((item) => item.time === currentDayTime);
  const newExercisesArray = [...state.exercises];

  if (dayIndex !== -1) {
    const currentDayExercises = state.exercises[dayIndex].exercises;
    const maxId = currentDayExercises.reduce((max, ex) => Math.max(max, ex.id), 0);
    const newExercise = createWorkoutExercise(category, exercise, maxId);

    newExercisesArray[dayIndex] = {
      ...state.exercises[dayIndex],
      exercises: [...currentDayExercises, newExercise],
    };

    return {
      exercises: newExercisesArray,
      exercisesOfCurrentDay: {
        time: currentDayTime,
        exercises: [...currentDayExercises, newExercise],
      },
      created: false,
    };
  }

  const newExercise = createWorkoutExercise(category, exercise, 0);
  newExercisesArray.push({
    time: currentDayTime,
    exercises: [newExercise],
  });

  return {
    exercises: newExercisesArray,
    exercisesOfCurrentDay: {
      time: currentDayTime,
      exercises: [newExercise],
    },
    created: true,
  };
};

export const updateExerciseInDay = (
  state: ExercisesStateSlice,
  exercise: ExerciseType,
): ExercisesStateSlice | null => {
  const currentDayTime = state.exercisesOfCurrentDay.time;
  const dayIndex = state.exercises.findIndex((item) => item.time === currentDayTime);

  if (dayIndex === -1) return null;

  const currentDayExercises = [...state.exercises[dayIndex].exercises];
  const exerciseIndex = currentDayExercises.findIndex((ex) => ex.id === exercise.id);

  if (exerciseIndex === -1) return null;

  currentDayExercises[exerciseIndex] = {
    ...currentDayExercises[exerciseIndex],
    ...exercise,
  };

  const newExercisesArray = [...state.exercises];
  newExercisesArray[dayIndex] = {
    ...state.exercises[dayIndex],
    exercises: currentDayExercises,
  };

  return {
    exercises: newExercisesArray,
    exercisesOfCurrentDay: {
      ...state.exercisesOfCurrentDay,
      exercises: currentDayExercises,
    },
  };
};

export interface RemoveExerciseResult {
  exercises: DayOfExercisesType[];
  exercisesOfCurrentDay: DayOfExercisesType;
  deleted: boolean;
}

export const removeExerciseFromDay = (
  state: ExercisesStateSlice,
  exercise: ExerciseType,
): RemoveExerciseResult | null => {
  const currentDayTime = state.exercisesOfCurrentDay.time;
  const dayIndex = state.exercises.findIndex((item) => item.time === currentDayTime);

  if (dayIndex === -1) return null;

  const currentDayExercises = state.exercises[dayIndex].exercises.filter((ex) => ex.id !== exercise.id);
  const newExercisesArray = [...state.exercises];

  if (!currentDayExercises.length) {
    newExercisesArray.splice(dayIndex, 1);
  } else {
    newExercisesArray[dayIndex] = {
      ...state.exercises[dayIndex],
      exercises: currentDayExercises,
    };
  }

  return {
    exercises: newExercisesArray,
    exercisesOfCurrentDay: {
      ...state.exercisesOfCurrentDay,
      exercises: currentDayExercises,
    },
    deleted: currentDayExercises.length === 0,
  };
};

export const selectDayFromExercises = (
  exercises: DayOfExercisesType[],
  time: Date,
): DayOfExercisesType => {
  const updatedTime = Number(new Date(time.getFullYear(), time.getMonth(), time.getDate()));
  const currentDay = exercises.find((item) => item.time === updatedTime);
  return currentDay || { time: updatedTime, exercises: [] };
};
