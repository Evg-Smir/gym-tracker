import { useState, useCallback, useRef } from 'react';

interface UseAnimatedVisibilityProps {
  duration?: number;
}

const useAnimatedVisibility = ({ duration = 500 }: UseAnimatedVisibilityProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutIdRef = useRef<number | null>(null);

  const show = useCallback(() => {
    setShouldRender(true);
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = window.setTimeout(() => {
      setIsVisible(true);
      timeoutIdRef.current = null;
    }, 10);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = window.setTimeout(() => {
      setShouldRender(false);
      timeoutIdRef.current = null;
    }, duration);
  }, [duration]);

  const durationRef = useRef(duration);

  return {
    isVisible,
    shouldRender,
    show,
    hide,
    duration: durationRef.current,
  };
};

export default useAnimatedVisibility;
