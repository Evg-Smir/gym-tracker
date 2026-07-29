import { UserDataType } from '@/@types/userStoreTypes';
import { AppError, toAppError } from '@/domain/errors/AppError';
import { updateUserEmail, updateUserPassword, logoutUser } from '@/repositories/authRepository';
import { getUserData, updateUserData } from '@/repositories/userRepository';

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  secondPassword: string;
  currentPassword: string;
}

export const loadProfileUserData = async (uid: string): Promise<UserDataType | null> => {
  const data = await getUserData(uid);
  if (!data) return null;
  return { ...data, uid };
};

export const saveProfileChanges = async (
  user: { uid: string },
  userData: UserDataType,
  values: ProfileFormValues,
): Promise<UserDataType> => {
  const emailChanged = values.email !== userData.email;
  const passwordChanged = !!values.password || !!values.secondPassword;
  const needsReauth = emailChanged || passwordChanged;

  if (needsReauth && !values.currentPassword) {
    throw new AppError('auth/requires-recent-login');
  }

  if (passwordChanged && values.password !== values.secondPassword) {
    throw new AppError('password-not-match');
  }

  try {
    if (emailChanged) {
      await updateUserEmail(values.email, values.currentPassword);
    }

    if (passwordChanged) {
      await updateUserPassword(values.password, values.currentPassword);
    }

    const updatedUser: UserDataType = {
      ...userData,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    };

    await updateUserData(user.uid, updatedUser);
    return updatedUser;
  } catch (err) {
    throw toAppError(err);
  }
};

export { logoutUser };
