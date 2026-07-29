import styles from './ExercisesCategoriesList.module.scss';
import { CategoryType } from "@/@types/categoryTypes";
import { withBasePath } from '@/lib/basePath';
import { useT } from '@/hooks/useT';

interface ExercisesCategoriesListProps {
  categoriesList: CategoryType[];
  selectCategory: (categoryId: number) => void;
  mini?: boolean;
}

export const ExercisesCategoriesList = ({ categoriesList, selectCategory, mini }: ExercisesCategoriesListProps) => {
  const t = useT();

  return (
    <div className={`${styles.categoriesList} ${mini ? styles.mini : ''}`}>
      {categoriesList.map(category => (
        <div className={styles.category} key={category.id} onClick={() => selectCategory(category.id)}>
          <img className={styles.categoryImage} src={withBasePath(category.icon)} alt={t('categories.iconAlt')} />
          <div className={styles.categoryContent}>
            <span className={styles.categoryName}>{category.name}</span>
            <span className={styles.categoryCount}>{category.exercises ? category.exercises.length : 0}</span>
          </div>
          <img className={styles.arrow} src={withBasePath('/ui/arrow-light.svg')} alt={t('common.arrowAlt')} />
        </div>
      ))}
    </div>
  );
};
