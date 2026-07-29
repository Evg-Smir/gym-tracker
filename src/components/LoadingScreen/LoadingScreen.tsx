import CircularProgress from '@mui/material/CircularProgress';

import styles from './LoadingScreen.module.scss';

export const LoadingScreen = () => (
  <div className={styles.loading}>
    <CircularProgress />
  </div>
);
