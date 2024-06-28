import styles from './BackActionButton.module.scss';
import { dark } from "@mui/material/styles/createPalette";

interface BackActionButtonType {
  clickButton: () => void,
  dark? : boolean
}

export const BackActionButton = ({ clickButton }: BackActionButtonType) => {
  return (
    <button className={`${styles.backActionButton} ${dark ? styles.dark : ''}`} onClick={clickButton}>
      <img src="/ui/arrow-left.svg" alt="arrow"/>
    </button>
  )
}
