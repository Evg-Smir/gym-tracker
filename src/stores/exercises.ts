import { create } from 'zustand';
import { ExercisesStateType, ExerciseType } from "@/types/exerciseTypes";
import { useCategoryStore } from "@/stores/category";

export const useExercisesStore = create<ExercisesStateType>((set) => ({
  exercises: [
    {
      time: 1719687600000,
      exercises: [
        {
          id: 1,
          category_id: 1,
          category_icon: '/categories/bicep2.svg',
          exercise_id: 1,
          exercise_name: 'Отжимания на брусьях',
          sets: [
            { weight: 15, reps: 4 },
            { weight: 15, reps: 12 },
            { weight: 15, reps: 12 },
          ]
        },
        {
          id: 2,
          category_id: 1,
          category_icon: '/categories/bicep2.svg',
          exercise_id: 1,
          exercise_name: 'Отжимания на брусьях',
          sets: []
        }
      ]
    },
  ],
  exercisesOfCurrentDay: {
    time: 0,
    exercises: []
  },

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
      sets: []
    });

    let updatedCurrentDayExercises: { exercises: ExerciseType[]; time: number };

    if (dayIndex !== -1) {
      const currentDayExercises = state.exercises[dayIndex].exercises;
      const maxId = currentDayExercises.reduce((max, ex) => Math.max(max, ex.id), 0);
      const newExercise = createNewExercise(maxId);

      newExercisesArray[dayIndex] = {
        ...state.exercises[dayIndex],
        exercises: [...currentDayExercises, newExercise]
      };

      updatedCurrentDayExercises = {
        time: currentDayTime,
        exercises: [...currentDayExercises, newExercise]
      };
    } else {
      const newExercise = createNewExercise(0);

      newExercisesArray.push({
        time: currentDayTime,
        exercises: [newExercise]
      });

      updatedCurrentDayExercises = {
        time: currentDayTime,
        exercises: [newExercise]
      };
    }

    return {
      exercises: newExercisesArray,
      exercisesOfCurrentDay: updatedCurrentDayExercises
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
      ...exercise
    };

    const newExercisesArray = [...state.exercises];
    newExercisesArray[dayIndex] = {
      ...state.exercises[dayIndex],
      exercises: currentDayExercises
    };

    const newExercisesOfCurrentDay = {
      ...state.exercisesOfCurrentDay,
      exercises: currentDayExercises
    };

    return {
      exercises: newExercisesArray,
      exercisesOfCurrentDay: newExercisesOfCurrentDay
    };
  }),

  setExercisesOfCurrentDay: (time) => set((state) => {
    const updatedTime = Number(new Date(time.getFullYear(), time.getMonth(), time.getDate()));
    const currentDay = state.exercises.find(item => item.time === updatedTime);
    return { exercisesOfCurrentDay: currentDay || { time: updatedTime, exercises: [] } };
  }),
}));
