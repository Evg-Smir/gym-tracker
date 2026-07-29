import { useCallback, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { useExercisesStore } from '@/stores/exercisesStore';

const toMidnight = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const useSelectWorkoutDay = () => {
  const setExercisesOfCurrentDay = useExercisesStore((state) => state.setExercisesOfCurrentDay);
  const [calendarIsOpened, setCalendarIsOpened] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(() => toMidnight(new Date()));

  const toggleCalendar = useCallback(() => {
    setCalendarIsOpened((prev) => !prev);
  }, []);

  const handleCloseCalendar = useCallback(() => {
    setCalendarIsOpened(false);
  }, []);

  const onChangeDay = useCallback(
    (value: Dayjs | null) => {
      if (!value) return;

      const day = value.toDate();
      setExercisesOfCurrentDay(day);
      setCurrentDate(toMidnight(day));
      setCalendarIsOpened(false);
    },
    [setExercisesOfCurrentDay],
  );

  const getDateLabel = useCallback((date: Date) => {
    const today = toMidnight(new Date());
    if (today.getTime() === toMidnight(date).getTime()) {
      return 'Сегодня';
    }
    return dayjs(date).format('D MMMM');
  }, []);

  return {
    calendarIsOpened,
    currentDate,
    toggleCalendar,
    handleCloseCalendar,
    onChangeDay,
    getDateLabel,
  };
};
