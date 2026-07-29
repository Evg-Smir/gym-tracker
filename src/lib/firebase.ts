import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, connectFirestoreEmulator } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  connectAuthEmulator,
} from 'firebase/auth';

declare global {
  // eslint-disable-next-line no-var
  var __FIREBASE_EMULATORS_CONNECTED__: boolean | undefined;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

if (
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' &&
  !globalThis.__FIREBASE_EMULATORS_CONNECTED__
) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9199', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8185);
  globalThis.__FIREBASE_EMULATORS_CONNECTED__ = true;
}

export const registerUser = async (email: string, password: string, firstName: string, lastName: string) => {
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

    console.log('User registered successfully!');
    return user;
  } catch (err: any) {
    console.error('Error registering user: ', err);
    throw { code: err.code || 'unknown_error' };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (err: any) {
    console.error('Ошибка авторизации:', err);
    throw { code: err.code || 'unknown_error' }
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
    throw { code: 'auth/user-not-found' };
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } catch (err: any) {
    throw { code: err.code || 'unknown_error' };
  }
};

export const updateUserEmail = async (newEmail: string, currentPassword: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw { code: 'auth/user-not-found' };
  }

  try {
    await reauthenticate(currentPassword);
    await updateEmail(user, newEmail);
  } catch (err: any) {
    throw { code: err.code || 'unknown_error' };
  }
};

export const updateUserPassword = async (newPassword: string, currentPassword: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw { code: 'auth/user-not-found' };
  }

  try {
    await reauthenticate(currentPassword);
    await updatePassword(user, newPassword);
  } catch (err: any) {
    throw { code: err.code || 'unknown_error' };
  }
};

export default app;
