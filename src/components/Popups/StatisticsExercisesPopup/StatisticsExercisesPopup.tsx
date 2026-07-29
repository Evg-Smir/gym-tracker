import styles from './StatisticsExercisesPopup.module.scss';
import { CategoryType } from '@/@types/categoryTypes';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useExerciseStatistics } from '@/hooks/useExerciseStatistics';

interface StatisticsExercisesPopupProps {
  category: CategoryType | null;
  unsetCategory: () => void;
}

export const StatisticsExercisesPopup = ({
  category,
  unsetCategory,
}: StatisticsExercisesPopupProps) => {
  const {
    isVisible,
    shouldRender,
    staticsState,
    selectedCatalogExercise,
    metricLabel,
    handleChange,
    handleMetricChange,
    closePopup,
  } = useExerciseStatistics(category, unsetCategory);

  if (!shouldRender || !category) return null;

  return (
    <div className={`${styles.statisticsExercisesPopup} ${isVisible ? styles.visible : ''}`}>
      <BackButton clickButton={closePopup} />
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
          {category.exercises.map((ex) => (
            <MenuItem key={ex.id} value={ex.id}>
              {ex.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {staticsState.exercise && !selectedCatalogExercise?.ownWeight && (
        <div className={styles.metricToggle}>
          <button
            type="button"
            className={staticsState.metric === 'weight' ? styles.metricActive : ''}
            onClick={() => handleMetricChange('weight')}
          >
            Вес
          </button>
          <button
            type="button"
            className={staticsState.metric === 'volume' ? styles.metricActive : ''}
            onClick={() => handleMetricChange('volume')}
          >
            Объём
          </button>
        </div>
      )}

      {staticsState.exerciseList.length > 0 ? (
        <>
          <h3 className={styles.label}>{metricLabel}</h3>
          <div className={styles.graphWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={staticsState.exerciseList}
                height={300}
                margin={{ top: 10, right: 5, left: 5, bottom: 0 }}
              >
                <XAxis dataKey="time" strokeWidth={0} />
                <Tooltip />
                <Line
                  dot={false}
                  type="monotone"
                  dataKey="value"
                  name={metricLabel}
                  stroke="#1C1C1EFF"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className={styles.emptyBlock}>
          <img src="/ui/background.png" alt="Фон" />
          <p>Добавьте подходы, чтобы показать статистику</p>
        </div>
      )}
    </div>
  );
};
