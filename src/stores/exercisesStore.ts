import { create } from 'zustand';
import { DayOfExercisesType, ExercisesStateType, ExerciseType, SelectedExerciseInput } from '@/@types/exerciseTypes';
import { useCategoryStore } from '@/stores/categoriesStore';
import { setStorage } from '@/services/IndexedDB';
import { addWorkout, deleteWorkout, updateWorkout } from '@/db/client';

const emptyDay = (time = 0): DayOfExercisesType => ({
  time,
  exercises: [],
});

const persistWorkoutDay = async (
  uid: string,
  exercises: DayOfExercisesType[],
  day: DayOfExercisesType,
  isNew: boolean,
) => {
  await setStorage(uid, 'exercises', exercises);

  if (day.exercises.length > 0) {
    if (isNew) {
      await addWorkout(uid, day);
    } else {
      await updateWorkout(uid, day);
    }
  } else {
    await deleteWorkout(uid, day.time);
  }
};

const createExerciseFromCatalog = (
  categoryId: number,
  exerciseId: number,
  maxId: number,
): ExerciseType | null => {
  const categoriesList = useCategoryStore.getState().categories;
  const category = categoriesList.find((cat) => cat.id === categoryId);
  if (!category) return null;

  const exercise = category.exercises.find((ex) => ex.id === exerciseId);
  if (!exercise) return null;

  return {
    id: maxId + 1,
    category_id: category.id,
    category_icon: category.icon,
    exercise_id: exercise.id,
    exercise_name: exercise.name,
    doubleWeight: exercise.doubleWeight,
    ownWeight: exercise.ownWeight,
    sets: [],
  };
};

export const useExercisesStore = create<ExercisesStateType>((set, get) => ({
  exercises: [],
  exercisesOfCurrentDay: emptyDay(),

  setExercisesList: (exercisesList) => set({ exercises: exercisesList }),

  resetExercises: () => set({
    exercises: [],
    exercisesOfCurrentDay: emptyDay(),
  }),

  setExercise: (categoryId, exerciseId, uid) => {
    get().addExercises([{ categoryId, exerciseId }], uid);
  },

  addExercises: (items: SelectedExerciseInput[], uid: string) => {
    if (!items.length || !uid) return;

    const state = get();
    const currentDayTime = state.exercisesOfCurrentDay.time;
    const dayIndex = state.exercises.findIndex((item) => item.time === currentDayTime);
    const isNew = dayIndex === -1;

    let currentDayExercises = isNew
      ? []
      : [...state.exercises[dayIndex].exercises];

    let maxId = currentDayExercises.reduce((max, ex) => Math.max(max, ex.id), 0);

    for (const { categoryId, exerciseId } of items) {
      const newExercise = createExerciseFromCatalog(categoryId, exerciseId, maxId);
      if (!newExercise) continue;
      currentDayExercises = [...currentDayExercises, newExercise];
      maxId = newExercise.id;
    }

    if (currentDayExercises.length === (isNew ? 0 : state.exercises[dayIndex].exercises.length)) {
      return;
    }

    const updatedDay: DayOfExercisesType = {
      time: currentDayTime,
      exercises: currentDayExercises,
    };

    const newExercisesArray = [...state.exercises];
    if (isNew) {
      newExercisesArray.push(updatedDay);
    } else {
      newExercisesArray[dayIndex] = updatedDay;
    }

    set({
      exercises: newExercisesArray,
      exercisesOfCurrentDay: updatedDay,
    });

    void persistWorkoutDay(uid, newExercisesArray, updatedDay, isNew).catch((error) => {
      console.error('Failed to persist added exercises:', error);
    });
  },

  updateExercise: (exercise, uid) => {
    const state = get();
    const currentDayTime = state.exercisesOfCurrentDay.time;
    const dayIndex = state.exercises.findIndex((item) => item.time === currentDayTime);

    if (dayIndex === -1) return;

    const currentDayExercises = [...state.exercises[dayIndex].exercises];
    const exerciseIndex = currentDayExercises.findIndex((ex) => ex.id === exercise.id);

    if (exerciseIndex === -1) return;

    currentDayExercises[exerciseIndex] = {
      ...currentDayExercises[exerciseIndex],
      ...exercise,
    };

    const newExercisesArray = [...state.exercises];
    const updatedDay: DayOfExercisesType = {
      ...state.exercises[dayIndex],
      exercises: currentDayExercises,
    };
    newExercisesArray[dayIndex] = updatedDay;

    set({
      exercises: newExercisesArray,
      exercisesOfCurrentDay: {
        ...state.exercisesOfCurrentDay,
        exercises: currentDayExercises,
      },
    });

    void persistWorkoutDay(uid, newExercisesArray, updatedDay, false).catch((error) => {
      console.error('Failed to persist exercise update:', error);
    });
  },

  removeExercise: (exercise, uid) => {
    const state = get();
    const currentDayTime = state.exercisesOfCurrentDay.time;
    const dayIndex = state.exercises.findIndex((item) => item.time === currentDayTime);

    if (dayIndex === -1) return;

    const currentDayExercises = state.exercises[dayIndex].exercises.filter(
      (ex) => ex.id !== exercise.id,
    );

    const newExercisesArray = [...state.exercises];
    const updatedDay: DayOfExercisesType = {
      time: currentDayTime,
      exercises: currentDayExercises,
    };

    if (!currentDayExercises.length) {
      newExercisesArray.splice(dayIndex, 1);
    } else {
      newExercisesArray[dayIndex] = {
        ...state.exercises[dayIndex],
        exercises: currentDayExercises,
      };
    }

    set({
      exercises: newExercisesArray,
      exercisesOfCurrentDay: updatedDay,
    });

    void persistWorkoutDay(uid, newExercisesArray, updatedDay, false).catch((error) => {
      console.error('Failed to persist exercise removal:', error);
    });
  },

  setExercisesOfCurrentDay: (time) => set((state) => {
    const updatedTime = Number(new Date(time.getFullYear(), time.getMonth(), time.getDate()));
    const currentDay = state.exercises.find((item) => item.time === updatedTime);
    return { exercisesOfCurrentDay: currentDay || emptyDay(updatedTime) };
  }),
}));
