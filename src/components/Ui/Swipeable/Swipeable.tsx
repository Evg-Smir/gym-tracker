import styles from './Swipeable.module.scss';
import { motion, PanInfo } from 'framer-motion';
import { useState, ReactNode } from 'react';

interface SwipeActionProps {
  children: ReactNode;
  actions?: { label: string; onClick: () => void; color?: string }[];
  actionWidth?: number;
}

export const SwipeAction = ({ children, actions = [], actionWidth = 100 }: SwipeActionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // Флаг блокировки кликов

  const animatePosition = (to: number, duration = 100) => {
    const start = currentPosition;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newPosition = start + (to - start) * progress;

      setCurrentPosition(newPosition);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setLastPosition(to);
        setIsDragging(false); // Разблокировать клики после анимации
      }
    };

    requestAnimationFrame(step);
  };

  const handleDragStart = () => {
    setIsDragging(true); // Блокируем клики при начале свайпа
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent, info: PanInfo) => {
    const swipeThreshold = actionWidth / 2;
    const shouldOpen = info.velocity.x < -100 || currentPosition < -swipeThreshold;
    const shouldClose = info.velocity.x > 100 || currentPosition > -swipeThreshold;

    setLastPosition(lastPosition + info.offset.x);
    setCurrentPosition(lastPosition + info.offset.x);

    if (isOpen && shouldClose) {
      setIsOpen(false);
      animatePosition(0);
    } else if (!isOpen && shouldOpen) {
      setIsOpen(true);
      animatePosition(-actionWidth);
    } else {
      animatePosition(isOpen ? -actionWidth : 0);
    }
  };

  const drag = (_: MouseEvent | TouchEvent, info: PanInfo) => {
    if (currentPosition > 0 || currentPosition < -100) return;
    setCurrentPosition(lastPosition + info.offset.x);
  };

  return (
    <div className={styles.swipeable}>
      <div className={styles.swipeableInner}>
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={styles.swipeableButton}
            style={{
              minWidth: `${actionWidth / actions.length}px`,
            }}
          >
            {action.label}
          </button>
        ))}
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -actionWidth, right: 0 }}
        onDragStart={handleDragStart}
        onDrag={drag}
        onDragEnd={handleDragEnd}
        transformTemplate={() => `translateX(${currentPosition}px)`}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={styles.swipeableWrapper}
        style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
      >
        {children}
      </motion.div>
    </div>
  );
};
