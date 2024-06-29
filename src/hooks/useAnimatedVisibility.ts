import { useState, useCallback } from 'react';

interface UseAnimatedVisibilityProps {
  duration?: number;
}

const useAnimatedVisibility = ({ duration = 500 }: UseAnimatedVisibilityProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const show = useCallback(() => {
    setShouldRender(true);
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setShouldRender(false), duration);
  }, [duration]);

  return {
    isVisible,
    shouldRender,
    show,
    hide,
    duration,
  };
};

export default useAnimatedVisibility;
