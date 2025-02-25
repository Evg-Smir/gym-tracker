import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

import Cookies from 'js-cookie';

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

const saveToken = async (user: User) => {
  const token = await user.getIdToken();
  Cookies.set('firebaseAuth', token, { expires: 7, secure: true });
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    saveToken(user).then(() => {
    });
  } else {
    Cookies.remove('firebaseAuth');
  }
});

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
  } catch (error) {
    console.error('Error registering user: ', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await saveToken(userCredential.user);
    return userCredential;
  } catch (err: any) {
    console.error('Ошибка авторизации:', err);
    throw { code: err.code || 'unknown_error' }
  }
};

export const logoutUser = async () => {
  await signOut(auth);
  Cookies.remove('firebaseAuth');
  window.location.href = '/auth';
};

export default app;
