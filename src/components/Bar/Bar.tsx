import styles from './Bar.module.scss';

import React from 'react';

import { withBasePath } from '@/lib/basePath';
import { useT } from '@/hooks/useT';

export const Bar = ({ openMenu, openStats, openProfile }: {
  openMenu: () => void,
  openStats: () => void,
  openProfile: () => void
}) => {
  const t = useT();

  return (
    <div className={styles.bar}>
      <div className={styles.bar__button}>
        <button className={styles.button} onClick={openMenu}>
          <img className={styles.button__icon} src={withBasePath('/ui/plus_2.svg')} alt={t('bar.addAlt')} />
        </button>
      </div>
      <div className={styles.bar__button}>
        <button className={styles.button} onClick={openStats}>
          <img className={styles.button__icon} src={withBasePath('/ui/stats.svg')} alt={t('bar.statsAlt')} />
        </button>
      </div>
      <div className={styles.bar__button}>
        <button className={styles.button} onClick={openProfile}>
          <img className={styles.button__icon} src={withBasePath('/ui/user.svg')} alt={t('bar.profileAlt')} />
        </button>
      </div>
    </div>
  );
};
