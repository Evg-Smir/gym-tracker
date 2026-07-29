import styles from "@/components/Exercises/ExercisesList/ExercisesList.module.scss";
import { ExercisesItem } from "@/components/Exercises/ExercisesItem/ExercisesItem";
import { DayOfExercisesType } from "@/@types/exerciseTypes";
import { withBasePath } from '@/lib/basePath';
import { useT } from '@/hooks/useT';

interface ExercisesListProps extends DayOfExercisesType {
  setActionSetId: (id: number) => void;
}

const EmptyBlock = () => {
  const t = useT();

  return (
    <div className={styles.emptyBlock}>
      <img src={withBasePath('/ui/background.png')} alt={t('common.backgroundAlt')}/>
      <p>{t('exercises.empty')}</p>
    </div>
  );
};


export const ExercisesList = ({ exercises, setActionSetId }: ExercisesListProps) => {
  return (
    <div className={styles.exerciseList}>
      {exercises?.length ? (
        exercises.map((exercise) => (
          <ExercisesItem key={exercise.id} exercise={exercise} setActionSetId={setActionSetId}/>
        ))
      ) : (
        <EmptyBlock/>
      )}
    </div>
  );
};
