import styles from './StatisticsExercisesPopup.module.scss';
import { CategoryType } from '@/@types/categoryTypes';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useExerciseStatistics } from '@/hooks/useExerciseStatistics';
import useSwipeToClose from '@/hooks/useSwipeToClose';
import { withBasePath } from '@/lib/basePath';
import { useT } from '@/hooks/useT';
import { translateExerciseName } from '@/i18n/catalog';

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
  const t = useT();
  const swipeHandlers = useSwipeToClose(closePopup);

  if (!shouldRender || !category) return null;

  return (
    <div
      {...swipeHandlers}
      className={`${styles.statisticsExercisesPopup} ${isVisible ? styles.visible : ''}`}
    >
      <BackButton clickButton={closePopup} />
      <h2 className={styles.title}>{t('statistics.title')}</h2>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{t('statistics.exercise')}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={staticsState.exercise}
          label={t('statistics.exercise')}
          onChange={handleChange}
        >
          {category.exercises.map((ex) => (
            <MenuItem key={ex.id} value={ex.id}>
              {translateExerciseName(ex.name, t)}
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
            {t('statistics.metric.weight')}
          </button>
          <button
            type="button"
            className={staticsState.metric === 'volume' ? styles.metricActive : ''}
            onClick={() => handleMetricChange('volume')}
          >
            {t('statistics.metric.volume')}
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
          <img src={withBasePath('/ui/background.png')} alt={t('common.backgroundAlt')} />
          <p>{t('statistics.empty')}</p>
        </div>
      )}
    </div>
  );
};
