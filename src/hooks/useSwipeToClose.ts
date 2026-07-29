import { RefObject, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';

const useSwipeToClose = (
  onClose: () => void,
  scrollRef?: RefObject<HTMLElement | null>,
) => {
  const handleSwipedDown = useCallback(() => {
    if (scrollRef?.current && scrollRef.current.scrollTop > 0) {
      return;
    }
    onClose();
  }, [onClose, scrollRef]);

  return useSwipeable({
    onSwipedDown: handleSwipedDown,
    trackMouse: true,
    delta: 50,
    preventScrollOnSwipe: false,
  });
};

export default useSwipeToClose;
