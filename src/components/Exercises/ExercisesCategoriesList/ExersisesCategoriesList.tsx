import styles from './ExercisesCategoriesList.module.scss'
import { CategoryType } from "@/types/categoryTypes";

interface ExercisesCategoriesListType {
  categoriesList: CategoryType[],
  selectCategory: (categoryId: number) => void,
  mini?: boolean,
}

export const ExercisesCategoriesList = ({ categoriesList, selectCategory, mini }: ExercisesCategoriesListType) => {
  return (
    <div className={`${styles.categoriesList} ${mini ? styles.mini : ''}`}>
      {
        categoriesList.map(category => (
          <div className={styles.category} key={category.id} onClick={() => {selectCategory(category.id)}}>
            <img className={styles.categoryImage} src={category.icon} alt="icon"/>
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
