import { initializeApp, getApps, getApp, FirebaseError } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  updatePassword,
} from 'firebase/auth';

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

const toAuthError = (err: unknown) => {
  if (err instanceof FirebaseError) {
    return { code: err.code };
  }
  if (typeof err === 'object' && err && 'code' in err) {
    return { code: String((err as { code: string }).code) };
  }
  return { code: 'unknown_error' };
};

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
      categoriesIsUpload: false,
      exercisesIsUpload: false,
    });

    return user;
  } catch (err) {
    throw toAuthError(err);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw toAuthError(err);
  }
};

export const logoutUser = async () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  try {
    await signOut(auth);
  } finally {
    window.location.href = `${basePath}/auth/`;
  }
};

export const reauthenticate = async (password: string) => {
  const user = auth.currentUser;
  if (!user?.email) {
    throw { code: 'auth/user-not-found' };
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } catch (err) {
    throw toAuthError(err);
  }
};

export const updateUserEmail = async (newEmail: string, currentPassword: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw { code: 'auth/user-not-found' };
  }

  try {
    await reauthenticate(currentPassword);
    await verifyBeforeUpdateEmail(user, newEmail);
  } catch (err) {
    throw toAuthError(err);
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
  } catch (err) {
    throw toAuthError(err);
  }
};

export default app;
