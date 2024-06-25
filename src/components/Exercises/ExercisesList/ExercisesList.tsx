import styles from "@/components/Exercises/ExercisesList/ExercisesList.module.scss";
import { ExercisesItem } from "@/components/Exercises/ExercisesItem/ExercisesItem";
import { ReactElement } from "react";
import { DayOfExercisesType } from "@/types/exerciseTypes";

const nothingBlank = (): ReactElement => {
  return (
    <div className={styles.emptyBlock}>
      <img src="/ui/background.png" alt="background"/>
      <p>Добавь упражнение или тренировку, чтобы записать тренировку</p>
    </div>
  )
}

export const ExercisesList = ({ exercises }: DayOfExercisesType) => {
  return (
    <div className={styles.exerciseList}>
      {
        exercises?.length ?
          exercises.map(exercise => (
            <ExercisesItem exercise={exercise} key={exercise.id}/>
          ))
          : nothingBlank()
      }
    </div>
  )
}
