import styles from './BackButton.module.scss';

import { withBasePath } from '@/lib/basePath';

interface BackButtonType {
  clickButton: () => void,
}

export const BackButton = ({ clickButton }: BackButtonType) => {
  return (
    <button className={styles.backButton} onClick={clickButton}>
      <img src={withBasePath('/ui/arrow-light.svg')} alt="arrow"/>
      <span>назад</span>
    </button>
  )
}
