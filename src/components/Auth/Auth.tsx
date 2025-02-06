'use client';

import styles from './Auth.module.scss';
import { useEffect } from 'react';
import { authUser } from '@/db/auth';
import { app } from '@/db/client';

export const Authentication = () => {
  useEffect(() => {
    authUser(app, 'admin@admin.com', 'adminadmin123');
  }, []);

  return (
    <div className={styles.authWrapper}>
      <h1>Авторизация</h1>
    </div>
  );
};
