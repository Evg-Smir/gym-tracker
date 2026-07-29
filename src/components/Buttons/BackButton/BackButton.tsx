import styles from './BackButton.module.scss';

import { withBasePath } from '@/lib/basePath';
import { useT } from '@/hooks/useT';

interface BackButtonType {
  clickButton: () => void,
}

export const BackButton = ({ clickButton }: BackButtonType) => {
  const t = useT();

  return (
    <button className={styles.backButton} onClick={clickButton}>
      <img src={withBasePath('/ui/arrow-light.svg')} alt={t('common.backAlt')}/>
      <span>{t('common.back')}</span>
    </button>
  )
}
