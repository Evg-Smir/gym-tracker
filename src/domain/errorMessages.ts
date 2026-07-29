export const errorCode = (code: string) => {
  switch (code) {
    case 'auth/email-already-exists':
    case 'auth/email-already-in-use':
      return 'Пользователь уже существует';
    case 'auth/invalid-email':
      return 'Некорректный email';
    case 'auth/wrong-password':
      return 'Неверный пароль';
    case 'auth/invalid-credential':
      return 'Неверный email или пароль';
    case 'auth/requires-recent-login':
      return 'Введите текущий пароль для подтверждения';
    case 'auth/weak-password':
      return 'Слишком слабый пароль';
    case 'auth/too-many-requests':
      return 'Слишком много попыток. Попробуйте позже';
    case 'password-not-match':
      return 'Пароли не совпадают';
    default:
      return 'Произошла ошибка. Попробуйте снова.';
  }
};
