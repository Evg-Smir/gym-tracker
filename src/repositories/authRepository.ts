import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase/app';
import { AppError, toAppError } from '@/domain/errors/AppError';

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    await setDoc(doc(db, 'users', user.uid), {
      firstName,
      lastName,
      email,
      createdAt: new Date(),
    });

    return user;
  } catch (err) {
    throw toAppError(err);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw toAppError(err);
  }
};

export const logoutUser = async () => {
  await signOut(auth);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  window.location.href = `${basePath}/auth/`;
};

export const reauthenticate = async (password: string) => {
  const user = auth.currentUser;
  if (!user?.email) {
    throw new AppError('auth/user-not-found');
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } catch (err) {
    throw toAppError(err);
  }
};

export const updateUserEmail = async (newEmail: string, currentPassword: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw new AppError('auth/user-not-found');
  }

  try {
    await reauthenticate(currentPassword);
    await updateEmail(user, newEmail);
  } catch (err) {
    throw toAppError(err);
  }
};

export const updateUserPassword = async (newPassword: string, currentPassword: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw new AppError('auth/user-not-found');
  }

  try {
    await reauthenticate(currentPassword);
    await updatePassword(user, newPassword);
  } catch (err) {
    throw toAppError(err);
  }
};
