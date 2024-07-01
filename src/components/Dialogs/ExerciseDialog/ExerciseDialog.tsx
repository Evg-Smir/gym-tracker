import styles from "./ExerciseDialog.module.scss";
import Dialog from '@mui/material/Dialog';

interface ExerciseDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

export const ExerciseDialog = ({ open, onClose }: ExerciseDialogProps) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <div className={styles.exerciseDialogWrapper}>
        <button>Статистика</button>
        <button>Удалить</button>
      </div>
    </Dialog>
  )
}
