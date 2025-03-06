import styles from './ProfilePopup.module.scss';

import React, { useEffect } from 'react';
import useAnimatedVisibility from '@/hooks/useAnimatedVisibility';

import { Profile } from '@/components/Profile/Profile';

interface ProfilePopupProps {
  closeProfile: () => void;
}


export const ProfilePopup = ({ closeProfile }: ProfilePopupProps) => {
  const { isVisible, shouldRender, show, hide } = useAnimatedVisibility();


  useEffect(() => {
    show();
  }, [show]);

  const closePopup = () => {
    hide();
    setTimeout(closeProfile, 300);
  };

  if (!shouldRender) return null;

  return (
    <div className={`${styles.profilePopup} ${isVisible ? styles.visible : ''}`}>
      <Profile closePopup={closePopup} />
    </div>
  );
};
