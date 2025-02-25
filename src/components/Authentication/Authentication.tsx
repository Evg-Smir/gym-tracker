import styles from './Authentication.module.scss';

export const Authentication = () => {
  return (
    <div className={styles.authWrapper}>
      <div className={styles.authWrapperTop}>
        <h1 className={styles.authTitle}>Авторизация</h1>
      </div>

      <div className={styles.authWrapperBottom}>
        Тут будет авторизация
      </div>
    </div>
  )
}
