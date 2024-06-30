import styles from "./AddNewButton.module.scss";

interface AddNewButtonType {
  openMenu: () => void
}

export const AddNewButton = ({ openMenu }: AddNewButtonType) => {
  return (
    <div className={styles.pageButtonWrapper}>
      <button
        onClick={openMenu}
        className={styles.pageButton}
      >
        Добавить упражнение
      </button>
    </div>
  )
}
