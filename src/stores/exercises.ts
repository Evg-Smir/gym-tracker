import { create } from 'zustand';
import { ExerciseRepsType, ExercisesStateType, ExerciseType } from "@/types/exerciseTypes";

export const useExercisesStore = create<ExercisesStateType>((set) => ({
  exercises: [
    {
      time: 1719342000001,
      exercises: [
        {
          id: 1,
          category_id: 1,
          category_icon: 'string',
          exercise_id: 1,
          exercise_name: 'Отжимания на брусьях',
          sets: [
            { weight: 15, reps: 4 },
            { weight: 15, reps: 12 },
            { weight: 15, reps: 12 },
          ]
        }
      ]
    },
  ],
  exercisesOfCurrentDay: {
    time: 0,
    exercises: []
  },

  setExercise: (exercise) => set((state) => {
    const indexOfExercise = state.exercises.findIndex((item) => item.time === exercise.time);
    if (indexOfExercise === -1) {
      return { exercises: [...state.exercises, exercise] };
    } else {
      const updatedExercises = [...state.exercises];
      updatedExercises[indexOfExercise] = exercise;
      return { exercises: updatedExercises };
    }
  }),
  setExercisesOfCurrentDay: (time) => set((state) => {
    const updatedTime = Number(new Date(time.getFullYear(), time.getMonth(), time.getDate()));
    const currentDay = state.exercises.find(item => item.time === updatedTime)
    return { exercisesOfCurrentDay: currentDay || { time: updatedTime, exercises: [] } }
  }),
}));
