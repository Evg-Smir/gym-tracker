import styles from './StatisticsExercisesPopup.module.scss';
import { CategoryType } from "@/types/categoryTypes";
import useAnimatedVisibility from "@/hooks/useAnimatedVisibility";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BackButton } from "@/components/Buttons/BackButton/BackButton";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useExercisesStore } from "@/stores/exercisesStore";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface StatisticsExercisesPopupProps {
  category: CategoryType | null;
  unsetCategory: () => void;
}

interface StaticsStateType {
  exercise: string,
  exerciseList: {}[],
}

export const StatisticsExercisesPopup = ({ category, unsetCategory }: StatisticsExercisesPopupProps) => {
  const exercisesList = useExercisesStore((state) => state.exercises);
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();
  const [staticsState, setStaticsState] = useState<StaticsStateType>({
    exercise: '',
    exerciseList: [],
  })

  const formatTimestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  const handleChange = useCallback((event: SelectChangeEvent) => {
    if (!category) return;

    const subcategoryId = Number(event.target.value);
    const categoryId = category.id;

    const filteredExercises = exercisesList.flatMap(exerciseItem => {
      return exerciseItem.exercises
        .filter(ex => ex.exercise_id === subcategoryId && ex.category_id === categoryId)
        .map(ex => ({ time: formatTimestampToDate(exerciseItem.time), weight: Number(ex.sets[0].weight) }));
    });

    setStaticsState(prevState => ({ ...prevState, exercise: event.target.value }));
    setStaticsState(prevState => ({ ...prevState, exerciseList: filteredExercises }));
  }, [category, exercisesList]);

  useEffect(() => {
    show();
  }, [show]);

  const closePopup = useCallback(() => {
    hide();
    setTimeout(unsetCategory, 300);
  }, [hide, unsetCategory]);

  const exerciseOptions = useMemo(() => {
    if (!category) return null;
    return category.exercises.map(ex => (
      <MenuItem key={ex.id} value={ex.id}>{ex.name}</MenuItem>
    ));
  }, [category]);


  if (!shouldRender || !category) return null;

  return (
    <div className={`${styles.statisticsExercisesPopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closePopup}/>
      <h2 className={styles.title}>Статистика</h2>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Упражнение</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={staticsState.exercise}
          label="Упражнение"
          onChange={handleChange}
        >
          {exerciseOptions}
        </Select>
      </FormControl>

      {staticsState.exerciseList.length > 0 && (
        <>
          <h3 className={styles.label}>Вес</h3>
          <div className={styles.graphWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={staticsState.exerciseList}
                height={300}
                margin={{
                  top: 10,
                  right: 5,
                  left: 5,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="time" strokeWidth={0}/>
                <Tooltip/>
                <Line dot={false} type="monotone" dataKey="weight" name={'Вес'} stroke="#1C1C1EFF" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};
