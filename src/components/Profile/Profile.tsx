import styles from './Profile.module.scss';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/lib/firebase';
import { useUserStore } from '@/stores/userStore';
import { useEffect, useState } from 'react';
import { getUserData, updateUserData } from '@/db/client';
import { Input } from '@/components/Inputs/Input/Input';
import { Button } from '@/components/Buttons/Button/Button';
import { redirect, useRouter } from 'next/navigation';
import { BackButton } from '@/components/Buttons/BackButton/BackButton';
import { UserDataType } from '@/@types/userStoreTypes';

export const Profile = ({ closePopup }: { closePopup: () => void }) => {
  const setUser = useUserStore((state) => state.setUserData);
  const userData = useUserStore((state) => state.userData);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [changes, setChanges] = useState(false);
  const { user } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
  };

  const setUserData = async (uid: string, local?: boolean) => {
    if (local) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);

      return;
    }

    try {
      const data = await getUserData(uid);
      setUser({ ...data, uid } as UserDataType);

      if (data) {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
      }
    } catch (err) {
      console.error('Ошибка получения данных пользователя:', err);
    }
  };

  const saveUserData = async () => {
    const updatedUser = {
      ...userData,
      firstName,
      lastName,
      email,
    };

    user && await updateUserData(user.uid, updatedUser);
    setUserData(userData.uid, true);
    setChanges(false)
  };

  useEffect(() => {
    !user && redirect(`/`);

    if (user && !userData) {
      setUserData(user.uid);
    } else if (user && userData) {
      setUserData(user.uid, true);
    }

  }, [user]);

  useEffect(() => {
    if (userData && (firstName && firstName !== userData.firstName || lastName && lastName !== userData.lastName || email && email !== userData.email)) {
      setChanges(true);
    } else {
      setChanges(false);
    }

  }, [firstName, lastName, email]);

  return (

    <div className={styles.profile}>
      <div className={styles.profile__inner}>
        <div className={styles.profileForm}>
          <BackButton clickButton={closePopup} />
          <h1 className={styles.profileTitle}>Личный кабинет</h1>
          <Input type={'text'} placeholder={'Имя'} value={firstName} onChange={setFirstName} />
          <Input type={'text'} placeholder={'Фамилия'} value={lastName} onChange={setLastName} />
          {/*<Input type={'email'} placeholder={'Почта'} value={email} onChange={setFirstName} />*/}
          {/*<Input type={'password'} placeholder={'Новый пароль'} onChange={setPassword} />*/}
          {/*<Input type={'password'} placeholder={'Повторите пароль'} onChange={setSecondPassword} />*/}
          <div className={styles.profileButtons}>
            {changes && <Button label={'Сохранить изменения'} type={'button'} onClick={saveUserData} />}
            <Button label={'Выйти из аккаунта'} type={'button'} onClick={handleLogout} />
          </div>
        </div>
      </div>
    </div>

  );
};
