import { UserDataType } from '@/@types/userStoreTypes';
import { toAppError } from '@/domain/errors/AppError';
import { loginUser, registerUser } from '@/repositories/authRepository';
import { getUserData } from '@/repositories/userRepository';

export const fetchAndNormalizeUser = async (uid: string): Promise<UserDataType | null> => {
  const data = await getUserData(uid);
  if (!data) return null;
  return { ...data, uid };
};

export const signInWithEmail = async (email: string, password: string): Promise<UserDataType | null> => {
  try {
    const credential = await loginUser(email, password);
    return fetchAndNormalizeUser(credential.user.uid);
  } catch (err) {
    throw toAppError(err);
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<UserDataType | null> => {
  try {
    const user = await registerUser(email, password, firstName, lastName);
    return fetchAndNormalizeUser(user.uid);
  } catch (err) {
    throw toAppError(err);
  }
};
