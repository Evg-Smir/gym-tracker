import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseApp } from '@firebase/app-types';

export const authUser = (app: FirebaseAppm, email: string, password: string) => {
  const auth = getAuth(app);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode);
    });
};
