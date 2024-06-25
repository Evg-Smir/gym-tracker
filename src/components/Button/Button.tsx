import styles from './Button.module.scss';

interface ButtonType {
  label: String
}

export const Button = ({ label }: ButtonType) => {
  return (
    <button className={styles.button}>{label}</button>
  )
}
