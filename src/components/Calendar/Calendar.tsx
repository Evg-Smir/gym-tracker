"use client"

import styles from './Calendar.module.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ruRU } from '@mui/x-date-pickers/locales';
import { useState, useCallback, useEffect } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import dayjs from "dayjs";
import Image from "next/image";
import { useExercisesStore } from "@/stores/exercisesStore";
import { useSwipeable } from 'react-swipeable';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  ruRU,
);

export const Calendar = () => {
  const setExercisesOfCurrentDay = useExercisesStore((state) => state.setExercisesOfCurrentDay)
  const exercisesOfCurrentDay = useExercisesStore((state) => state.exercisesOfCurrentDay)
  const [calendarIsOpened, setCalendarIsOpened] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const toggleCalendar = useCallback(() => {
    setCalendarIsOpened(prev => !prev);
  }, []);

  const handlers = useSwipeable({
    onSwipedDown: toggleCalendar,
    trackMouse: true,
  });

  const setDay = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  const handleCloseCalendar = useCallback(() => {
    setCalendarIsOpened(false);
  }, []);

  const onChangeDay = useCallback(({ $d: day }: { $d: Date }) => {
    if (currentDate === day) return false;

    setExercisesOfCurrentDay(day)
    setCurrentDate(day);
  }, []);

  const getDate = useCallback((date: Date) => {
    const now = new Date();

    const currentDateWithoutTime = setDay(now);
    const inputDateWithoutTime = setDay(date);

    const areDatesEqual = currentDateWithoutTime.getTime() === inputDateWithoutTime.getTime();

    if (areDatesEqual) {
      return 'Сегодня';
    }

    return dayjs(date).format('D MMMM');
  }, []);


  const ref = useClickOutside<HTMLDivElement>(handleCloseCalendar);

  return (
    <div {...handlers}>
      <div className={styles.calendar} ref={ref}>
        <div className={styles.calendarTop}>
          <div className={styles.currentDate}>{getDate(currentDate)}</div>
          <button className={styles.calendarButton} onClick={toggleCalendar}>
            <Image src="/ui/calendar.svg" alt="Calendar" width={28} height={28}/>
          </button>
        </div>
        <div
          className={`${styles.calendarBottom} ${calendarIsOpened ? styles.calendarBottomActive : ''}`}
        >
          <div className={styles.calendarBottomContent}>
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <DateCalendar className={styles.dateCalendar} views={['day']} onChange={onChangeDay}/>
              </LocalizationProvider>
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
