import styles from './Bar.module.scss';

import React from 'react';

export const Bar = ({ openMenu, openStats, openProfile }: {
  openMenu: () => void,
  openStats: () => void,
  openProfile: () => void
}) => {

  return (
    <div className={styles.bar}>
      <div className={styles.bar__button}>
        <button className={styles.button} onClick={openMenu}>
          <img className={styles.button__icon} src="/ui/plus_2.svg" alt="Плюс" />
        </button>
      </div>
      <div className={styles.bar__button}>
        <button className={styles.button} onClick={openStats}>
          <img className={styles.button__icon} src="/ui/stats.svg" alt="Статистика" />
        </button>
      </div>
      <div className={styles.bar__button}>
        <button className={styles.button} onClick={openProfile}>
          <img className={styles.button__icon} src="/ui/user.svg" alt="Личный кабинет" />
        </button>
      </div>
    </div>
  );
};
