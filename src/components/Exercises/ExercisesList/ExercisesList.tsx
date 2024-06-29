import styles from "@/components/Exercises/ExercisesList/ExercisesList.module.scss";
import { ExercisesItem } from "@/components/Exercises/ExercisesItem/ExercisesItem";
import { DayOfExercisesType } from "@/types/exerciseTypes";

interface ExercisesListProps extends DayOfExercisesType {
  setActionSetId: (id: number) => void;
}

const EmptyBlock = () => (
  <div className={styles.emptyBlock}>
    <img src="/ui/background.png" alt="Фон"/>
    <p>Добавьте упражнение или тренировку, чтобы записать тренировку</p>
  </div>
);

export const ExercisesList = ({ exercises, setActionSetId }: ExercisesListProps) => {
  return (
    <div className={styles.exerciseList}>
      {exercises?.length ? (
        exercises.map(exercise => (
          <ExercisesItem key={exercise.id} exercise={exercise} setActionSetId={setActionSetId} />
        ))
      ) : (
        <EmptyBlock />
      )}
    </div>
  );
};
