import { create } from 'zustand';
import { ExercisesStateType, ExerciseType } from '@/types/exerciseTypes';
import { useCategoryStore } from '@/stores/categoriesStore';
import { setLocalStorage } from '@/helpers/localStorage';

export const useExercisesStore = create<ExercisesStateType>((set) => ({
  exercises: [],
  exercisesOfCurrentDay: {
    time: 0,
    exercises: [],
  },

  setExercisesList: (exercisesList) => set((state) => {
    return {
      ...state,
      exercises: exercisesList,
    };
  }),

  setExercise: (categoryId, exerciseId) => set((state) => {
    const currentDayTime = state.exercisesOfCurrentDay.time;
    const categoriesList = useCategoryStore.getState().categories;

    const category = categoriesList.find(cat => cat.id === categoryId);
    if (!category) return state;

    const exercise = category.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return state;

    const dayIndex = state.exercises.findIndex(item => item.time === currentDayTime);
    let newExercisesArray = [...state.exercises];

    const createNewExercise = (maxId: number) => ({
      id: maxId + 1,
      category_id: category.id,
      category_icon: category.icon,
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      sets: [],
    });

    let updatedCurrentDayExercises: { exercises: ExerciseType[]; time: number };

    if (dayIndex !== -1) {
      const currentDayExercises = state.exercises[dayIndex].exercises;
      const maxId = currentDayExercises.reduce((max, ex) => Math.max(max, ex.id), 0);
      const newExercise = createNewExercise(maxId);

      newExercisesArray[dayIndex] = {
        ...state.exercises[dayIndex],
        exercises: [...currentDayExercises, newExercise],
      };

      updatedCurrentDayExercises = {
        time: currentDayTime,
        exercises: [...currentDayExercises, newExercise],
      };
    } else {
      const newExercise = createNewExercise(0);

      newExercisesArray.push({
        time: currentDayTime,
        exercises: [newExercise],
      });

      updatedCurrentDayExercises = {
        time: currentDayTime,
        exercises: [newExercise],
      };
    }

    setLocalStorage('exercises', newExercisesArray);

    return {
      exercises: newExercisesArray,
      exercisesOfCurrentDay: updatedCurrentDayExercises,
    };
  }),

  updateExercise: (exercise) => set((state) => {
    const currentDayTime = state.exercisesOfCurrentDay.time;
    const dayIndex = state.exercises.findIndex(item => item.time === currentDayTime);

    if (dayIndex === -1) {
      return state;
    }

    const currentDayExercises = [...state.exercises[dayIndex].exercises];
    const exerciseIndex = currentDayExercises.findIndex(ex => ex.id === exercise.id);

    if (exerciseIndex === -1) {
      return state;
    }

    currentDayExercises[exerciseIndex] = {
      ...currentDayExercises[exerciseIndex],
      ...exercise,
    };

    const newExercisesArray = [...state.exercises];
    newExercisesArray[dayIndex] = {
      ...state.exercises[dayIndex],
      exercises: currentDayExercises,
    };

    const newExercisesOfCurrentDay = {
      ...state.exercisesOfCurrentDay,
      exercises: currentDayExercises,
    };

    setLocalStorage('exercises', newExercisesArray);

    return {
      exercises: newExercisesArray,
      exercisesOfCurrentDay: newExercisesOfCurrentDay,
    };
  }),

  removeExercise: (exercise) => set((state) => {
    const currentDayTime = state.exercisesOfCurrentDay.time;
    const dayIndex = state.exercises.findIndex(item => item.time === currentDayTime);

    if (dayIndex === -1) {
      return state;
    }

    const currentDayExercises = state.exercises[dayIndex].exercises.filter(ex => ex.id !== exercise.id);

    const newExercisesArray = [...state.exercises];
    newExercisesArray[dayIndex] = {
      ...state.exercises[dayIndex],
      exercises: currentDayExercises,
    };

    const newExercisesOfCurrentDay = {
      ...state.exercisesOfCurrentDay,
      exercises: currentDayExercises,
    };

    setLocalStorage('exercises', newExercisesArray);

    return {
      exercises: newExercisesArray,
      exercisesOfCurrentDay: newExercisesOfCurrentDay,
    };
  }),

  setExercisesOfCurrentDay: (time) => set((state) => {
    const updatedTime = Number(new Date(time.getFullYear(), time.getMonth(), time.getDate()));
    const currentDay = state.exercises.find(item => item.time === updatedTime);
    return { exercisesOfCurrentDay: currentDay || { time: updatedTime, exercises: [] } };
  }),
}));
