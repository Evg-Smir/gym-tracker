import styles from './ExercisesCategoriesList.module.scss'
import { CategoryType } from "@/types/categoryTypes";

interface ExercisesCategoriesListType {
  categoriesList: CategoryType[]
}

export const ExercisesCategoriesList = ({ categoriesList }: ExercisesCategoriesListType) => {
  return (
    <div className={styles.categoriesList}>
      {
        categoriesList.map(category => (
          <div className={styles.category} key={category.id}>
            <img src={category.icon} alt="icon"/>
            <div className={styles.categoryContent}>
              <span className={styles.categoryName}>{category.name}</span>
              <span className={styles.categoryCount}>{category.exercises.length}</span>
            </div>
            <img className={styles.arrow} src="/ui/arrow-light.svg" alt="arrow"/>
          </div>
        ))
      }
    </div>
  )
}
