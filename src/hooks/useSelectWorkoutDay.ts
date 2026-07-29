import { useCallback, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { useExercisesStore } from '@/stores/exercisesStore';
import { useT } from '@/hooks/useT';
import { useLocaleStore } from '@/stores/localeStore';

const toMidnight = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const useSelectWorkoutDay = () => {
  const setExercisesOfCurrentDay = useExercisesStore((state) => state.setExercisesOfCurrentDay);
  const [calendarIsOpened, setCalendarIsOpened] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(() => toMidnight(new Date()));
  const t = useT();
  const locale = useLocaleStore((state) => state.locale);

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

  const getDateLabel = useCallback(
    (date: Date) => {
      const today = toMidnight(new Date());
      if (today.getTime() === toMidnight(date).getTime()) {
        return t('calendar.today');
      }
      return dayjs(date).locale(locale).format('D MMMM');
    },
    [t, locale],
  );

  return {
    calendarIsOpened,
    currentDate,
    toggleCalendar,
    handleCloseCalendar,
    onChangeDay,
    getDateLabel,
  };
};
