import styles from './ProfilePopup.module.scss';

import { useCallback, useEffect } from 'react';
import useAnimatedVisibility from '@/hooks/useAnimatedVisibility';
import useSwipeToClose from '@/hooks/useSwipeToClose';
import { Profile } from '@/components/Profile/Profile';

interface ProfilePopupProps {
  closeProfile: () => void;
}

export const ProfilePopup = ({ closeProfile }: ProfilePopupProps) => {
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();

  useEffect(() => {
    show();
  }, [show]);

  const closePopup = useCallback(() => {
    hide();
    setTimeout(closeProfile, 300);
  }, [hide, closeProfile]);

  const swipeHandlers = useSwipeToClose(closePopup);

  if (!shouldRender) return null;

  return (
    <div
      {...swipeHandlers}
      className={`${styles.profilePopup} ${isVisible ? styles.visible : ''}`}
    >
      <Profile closePopup={closePopup} />
    </div>
  );
};
